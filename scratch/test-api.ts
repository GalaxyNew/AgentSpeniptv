import { POST as publishPOST } from '../app/api/posts/publish/route'
import { POST as uploadPOST } from '../app/api/posts/upload/route'
import { db } from '../lib/db'

async function runTests() {
  console.log('🧪 Starting API publishing and upload tests with SiteSettings database token validation...')

  // Backup original settings
  let originalDbToken: string | null = null
  let originalEnvToken = process.env.API_PUBLISH_TOKEN

  try {
    const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
    originalDbToken = settings ? settings.apiPublishToken : null
  } catch (e) {}

  try {
    // ----------------------------------------------------
    // SETUP: Write DB Token and Clear Env Token
    // ----------------------------------------------------
    console.log('Setting database apiPublishToken to "db-test-token-777"...')
    await db.siteSettings.upsert({
      where: { id: 'main' },
      update: { apiPublishToken: 'db-test-token-777' },
      create: { id: 'main', apiPublishToken: 'db-test-token-777' }
    })
    
    // Clear env token to ensure it reads from DB
    delete process.env.API_PUBLISH_TOKEN

    // ----------------------------------------------------
    // TEST 1: Upload with invalid token (against DB Token)
    // ----------------------------------------------------
    console.log('\n----------------------------------------')
    console.log('Test 1: Upload with invalid token (should fail 401)')
    const req1 = new Request('http://localhost/api/posts/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer wrong-token'
      }
    })
    const res1 = await uploadPOST(req1)
    console.log('Status:', res1.status)
    const json1 = await res1.json()
    console.log('Body:', json1)
    if (res1.status !== 401) throw new Error('Test 1 failed: Expected 401')

    // ----------------------------------------------------
    // TEST 2: Upload with DB token (should succeed 200)
    // ----------------------------------------------------
    console.log('\n----------------------------------------')
    console.log('Test 2: Upload image with database token (should succeed 200)')
    const formData2 = new FormData()
    const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 108, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])
    formData2.append('file', new Blob([pngBytes], { type: 'image/png' }), 'test-db-pixel.png')
    
    const req2 = new Request('http://localhost/api/posts/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer db-test-token-777'
      },
      body: formData2
    })
    const res2 = await uploadPOST(req2)
    console.log('Status:', res2.status)
    const json2 = await res2.json()
    console.log('Body:', json2)
    if (res2.status !== 200 || !json2.ok || !json2.url) throw new Error('Test 2 failed: Expected 200 and image URL')
    const uploadedImageUrl = json2.url

    // ----------------------------------------------------
    // TEST 3: Publish post with DB token (should succeed 201)
    // ----------------------------------------------------
    console.log('\n----------------------------------------')
    console.log('Test 3: Publish article with database token (should succeed 201)')
    const uniqueSlug = `db-test-slug-${Date.now()}`
    const req3 = new Request('http://localhost/api/posts/publish', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer db-test-token-777',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Database Configured Token Test Article',
        slug: uniqueSlug,
        content: `<p>Testing database token configurations. Image: <img src="${uploadedImageUrl}" /></p>`,
        category: 'comparativas',
        status: 'published',
        metaTitle: 'DB Token Test',
        metaDescription: 'Testing how DB tokens validate.',
        keywords: 'database, api, token'
      })
    })
    const res3 = await publishPOST(req3)
    console.log('Status:', res3.status)
    const json3 = await res3.json()
    console.log('Body:', json3)
    if (res3.status !== 201 || !json3.ok) throw new Error('Test 3 failed: Expected 201 Created')

    // Clean up created post from DB
    await db.blogPost.delete({
      where: {
        locale_slug: {
          locale: 'es',
          slug: uniqueSlug
        }
      }
    })
    console.log('Cleaned up test post from DB.')

    console.log('\n🎉 ALL DATABASE TOKEN VALIDATION TESTS PASSED SUCCESSFULLY!')

  } catch (err: any) {
    console.error('\n❌ Test execution failed:', err.stack || err.message)
    process.exit(1)
  } finally {
    // Restore original settings
    console.log('\nRestoring original database and environment tokens...')
    try {
      await db.siteSettings.upsert({
        where: { id: 'main' },
        update: { apiPublishToken: originalDbToken || '' },
        create: { id: 'main', apiPublishToken: originalDbToken || '' }
      })
      console.log('Original DB token restored.')
    } catch (e) {
      console.error('Failed to restore original DB settings token:', e)
    }

    if (originalEnvToken) {
      process.env.API_PUBLISH_TOKEN = originalEnvToken
      console.log('Original Env token restored.')
    }

    await db.$disconnect()
  }
}

runTests()
