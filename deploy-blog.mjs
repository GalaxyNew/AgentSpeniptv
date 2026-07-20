import { PrismaClient } from './app/generated/prisma/index.js';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('/tmp/blog-payload.json', 'utf-8'));

const db = new PrismaClient();
try {
  const existing = await db.blogPost.findUnique({
    where: { locale_slug: { locale: data.locale, slug: data.slug } }
  });
  if (existing) {
    console.log("EXISTS: id=" + existing.id + ", status=" + existing.status);
  } else {
    const post = await db.blogPost.create({ data });
    console.log("CREATED: id=" + post.id + ", slug=" + post.slug + ", status=" + post.status);
  }
} catch(e) {
  console.error("ERROR: " + e.message);
} finally {
  await db.$disconnect();
}
