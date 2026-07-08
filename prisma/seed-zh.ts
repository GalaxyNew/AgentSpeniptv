import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding Chinese translations into database...')

  // ── Site Settings ─────────────────────────────────────────
  await prisma.siteSettings.update({
    where: { id: 'main' },
    data: {
      brandSlogan_zh: '无限流媒体，卓越品质',
      whatsappMsg_zh: '你好，我想订阅 IPTV Pro。',
    },
  })
  console.log('✅ Site settings updated with Chinese defaults')

  // ── Page SEO ─────────────────────────────────────────────
  await prisma.pageSeo.upsert({
    where: { locale: 'zh' },
    update: {
      metaTitle: 'IPTV Pro - 优质 IPTV 订阅服务 | 26,000+ 超高清 4K 频道直播点播',
      metaDescription: '使用 IPTV Pro 畅享全球超过 26,000 个超高清 4K 频道。热门点播电影、电视剧、精彩体育直播，24 小时免费试用，即时开通服务。',
    },
    create: {
      locale: 'zh',
      metaTitle: 'IPTV Pro - 优质 IPTV 订阅服务 | 26,000+ 超高清 4K 频道直播点播',
      metaDescription: '使用 IPTV Pro 畅享全球超过 26,000 个超高清 4K 频道。热门点播电影、电视剧、精彩体育直播，24 小时免费试用，即时开通服务。',
    },
  })
  // ── Page Module Sort Order & Visibility Chinese defaults ──
  const dbModules = await prisma.pageModule.findMany()
  for (const dbMod of dbModules) {
    await prisma.pageModule.update({
      where: { id: dbMod.id },
      data: {
        sortOrder_zh: dbMod.sortOrder_zh === 0 ? dbMod.sortOrder : dbMod.sortOrder_zh,
      },
    })
  }
  console.log('✅ Page module Chinese sort orders initialized')

  // ── Module Content: Hero ──────────────────────────────────
  const allContent: Record<string, Record<string, string>> = {
    hero: {
      badge: '🔥 +26 000 热门频道 HD & 4K',
      h1: '欧洲第一的\nPremium IPTV 订阅',
      subtitle: '电影、电视剧、体育、国际频道——一应俱全。无合约绑定，流畅无卡顿。',
      cta_primary: '立即开始',
      cta_secondary: '查看套餐',
      stat_channels: '26,000+',
      stat_channels_label: '可用频道',
      stat_quality: '4K',
      stat_quality_label: '超高清',
      stat_uptime: '99.9%',
      stat_uptime_label: '在线率保障',
      stat_trial: '24h',
      stat_trial_label: '免费试用',
    },
    features: {
      badge: '产品特性',
      title: '您所需要的一切',
      subtitle: '全方位的流媒体播放体验，品质绝无妥协',
      f1_title: '4K 超高清画质',
      f1_desc: '在您的所有设备屏幕上享受晶莹剔透的画质',
      f2_title: '先进防卡顿技术',
      f2_desc: '智能缓冲技术，确保流畅、不间断的观影体验',
      f3_title: '多设备支持',
      f3_desc: '支持多达 4 台设备同时在线播放',
      f4_title: '无限点播 VOD',
      f4_desc: '80,000+ 电影和电视剧随时点播',
      f5_title: '精彩体育直播',
      f5_desc: '实时观看所有主流体育赛事和 PPV 活动',
      f6_title: '24/7 客户支持',
      f6_desc: '我们的团队随时为您提供全天候的技术支持',
    },
    faq: {
      badge: 'FAQ',
      title: '常见问题',
      q1: '什么是 IPTV 订阅？',
      a1: 'IPTV 订阅允许您通过互联网观看电视直播频道、点播电影和电视剧，无需安装有线或卫星天线。',
      q2: '支持哪些设备？',
      a2: '智能电视、Android TV、Firestick、Apple TV、PC、Mac、iPhone、Android 手机——所有现代设备均能完美支持。',
      q3: '有任何合约绑定吗？',
      a3: '没有！我们的订阅是完全无合约的。选择您喜欢的时间长度，满意后再续订即可。',
      q4: '我如何付款？',
      a4: '我们支持 PayPal、信用卡以及加密货币支付。付款流程 100% 安全。',
      q5: '我可以在付款前进行试用吗？',
      a5: '可以的！我们提供 24 小时免费试用。请在 WhatsApp 上联系我们获取试用账号。',
      q6: '06. 购买后，我将如何收到我的登录凭据或连接链接？',
      a6: '您的连接信息（包括 M3U 链接、Xtream Codes API 接口以及详细的设置指南）将直接通过电子邮件或 WhatsApp 发送给您。',
      q7: '07. 订阅期满后会自动续费吗？',
      a7: '不会。我们的订阅不会自动续费，以避免产生任何意外扣费。我们会在到期前联系您，提供手动续订服务。',
      q8: '08. 你们的服务兼容哪些类型的设备或应用程序？',
      a8: '我们的服务兼容所有设备：智能电视（三星、LG、索尼）、安卓设备（电视、机顶盒、手机）、苹果（Apple TV、iPhone、iPad）、FireStick、MAG 盒子以及电脑。',
    },
    authority: {
      badge_1: '✅ 安全支付',
      badge_2: '⚡ 即时开通',
      badge_3: '🔒 无合约绑定',
      badge_4: '🌍 畅享全球',
      s1_val: '26,000+',
      s1_lbl: '可用频道',
      s2_val: '80,000+',
      s2_lbl: '点播电影与剧集',
      s3_val: '15,000+',
      s3_lbl: '满意客户',
      s4_val: '99.9%',
      s4_lbl: '在线率保障',
    },
    pricing: {
      badge: '特惠套餐',
      title: '选择您的订阅计划',
      subtitle: '无合约绑定 · 即时开通 · 24/7 客服支持',
    },
    content: {
      badge: '丰富内容',
      title: '数千个直播频道与海量点播内容',
      subtitle: '为您汇聚最棒的国际电视节目、体育赛事和热门电影。',
      t1_name: '⚽ 体育直播',
      t1_desc: '以 HD 和 4K 画质观看欧冠、英超、西甲、意甲、法甲、F1 等精彩赛事。',
      t2_name: '🎬 电影与点播',
      t2_desc: '超过 80,000 部点播视频（Netflix、Prime、Disney+）。提供中英文字幕及原声。',
      t3_name: '🌍 全球频道',
      t3_desc: '收看来自英国、美国、法国、西班牙、德国、阿拉伯地区、非洲以及亚洲的电视频道。',
      t4_name: '👶 儿童与家庭',
      t4_desc: '包含动画片、高质量纪录片、音乐及综艺频道，适合全年龄段观赏。',
    },
    how_it_works: {
      title: 'IPTV 是如何运行的？',
      subtitle: '简单三步，轻装上阵。',
      step1_title: '1. 提交订单',
      step1_desc: '选择您中意的订阅套餐并在线提交订单',
      step1_icon: '/images/icons/step1.svg',
      step2_title: '2. 获取账号',
      step2_desc: '支付完成后，通过电子邮箱或 WhatsApp 接收您的登录凭证',
      step2_icon: '/images/icons/step2.svg',
      step3_title: '3. 畅享体验',
      step3_desc: '尽情收看 31,000+ 电视直播频道与 120,000+ 点播大片',
      step3_icon: '/images/icons/step3.svg',
      banner_title: '所有体育频道，尽在指尖掌控！',
      banner_desc: '用我们的 IPTV 服务开启极致体育观赛体验！轻松收看所有您喜爱的体育频道，再也无需支付昂贵的单独订阅费，向额外开销说再见！',
      banner_image: '/images/sports_collage.png',
      bg_image_url: '/images/sports_stadium_bg.webp',
    },
    sports_marquee: {
      title: '畅享您喜爱的所有体育直播',
      subtitle: '所有主流赛事与 PPV 活动实时精彩呈现',
    },
    movies_marquee: {
      title: '海量大片 随心点播',
      subtitle: '每日更新，以 4K 超高清画质播映最新电影佳作。',
    },
    series_marquee: {
      title: '必看精彩电视剧集',
      subtitle: '提供您最喜爱的完整季度剧集，从经典老剧到最新热门大作。',
    },
    devices: {
      badge: '设备兼容',
      title: '支持您所有的设备',
      subtitle: '在您的智能电视、手机、平板或电脑上随时随地开始播放。',
      dev1_lbl: '智能电视',
      dev2_lbl: '安卓手机/平板',
      dev3_lbl: 'iPhone / iPad',
      dev4_lbl: 'PC / Mac 电脑',
      dev5_lbl: 'FireStick',
      dev6_lbl: '安卓机顶盒',
      dev7_lbl: 'Apple TV',
      dev8_lbl: 'MAG 机顶盒',
    },
    testimonials: {
      badge: '用户评价',
      title: '看看我们的客户怎么说',
      subtitle: '与全球 17,500+ 满意客户一起畅享优质服务',
      rating_score: '4.9',
      rating_text: '极佳 • 基于 17,500+ 条真实评价',
    },
    nos_services: {
      badge: '我们的服务',
      title: '行业领跑者',
      subtitle: '我们提供舒适的界面和简单易用的 IPTV 网站，无繁琐的支付流程，开通设置方便快捷。',
      s1_title: '覆盖 115 个国家和地区的频道',
      s1_desc: '您可以收看来自世界各地的电视频道（荷兰、比利时、德国、英国、西班牙、葡萄牙、法国、意大利、前南斯拉夫、印地语、阿拉伯语、土耳其语等）',
      s1_icon: 'Globe',
      s2_title: '2 天内退款保障',
      s2_desc: '如果您在购买后 2 天内对服务不满意，可申请取消您的 IPTV 订阅，我们将为您办理全额退款。',
      s2_icon: 'ShieldCheck',
      s3_title: '高清/全高清/4K/8K 极致画质',
      s3_desc: '我们提供各种图像质量，无论您的网络速度如何，都可以在移动端、智能电视、安卓机顶盒或电脑上流畅观赏我们的 IPTV 服务。',
      s3_icon: 'Tv',
    },
    temoignages: {
      badge: '客户见证',
      title: '看看客户的真实反馈',
      subtitle: '查看我们与满意客户的真实沟通截图。',
    },
    affiliate_links: {
      badge: '🔗 推广伙伴',
      title: '我们的官方合作伙伴',
      subtitle: '探索我们信任的合作伙伴，以优化您的 IPTV 体验。',
    },
  }

  for (const [moduleId, data] of Object.entries(allContent)) {
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId, locale: 'zh', key } },
        update: { value },
        create: { moduleId, locale: 'zh', key, value },
      })
    }
  }
  console.log('✅ Module contents seeded in Chinese')

  // ── Pricing Tiers & Plans Translation Seeding ──────────────────
  const tiers = await prisma.pricingTier.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      plans: { orderBy: { sortOrder: 'asc' } },
    },
  })

  const zhTierNames = ['1 屏幕', '2 屏幕', '3 屏幕']
  const zhPlanData: Record<number, Array<{
    duration: string
    features: string
    ctaText: string
    waMessage: string
  }>> = {
    0: [
      { duration: '1 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 1个月/1屏幕 套餐（7.99€）' },
      { duration: '3 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 37%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 3个月/1屏幕 套餐（14.99€）' },
      { duration: '6 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 48%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 6个月/1屏幕 套餐（24.99€）' },
      { duration: '12 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 58%","全网最划算"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 12个月/1屏幕 套餐（39.99€）' },
    ],
    1: [
      { duration: '1 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 1个月/2屏幕 套餐（11.99€）' },
      { duration: '3 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 30%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 3个月/2屏幕 套餐（24.99€）' },
      { duration: '6 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 44%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 6个月/2屏幕 套餐（39.99€）' },
      { duration: '12 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 55%","全网最划算"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 12个月/2屏幕 套餐（64.99€）' },
    ],
    2: [
      { duration: '1 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 1个月/3屏幕 套餐（14.99€）' },
      { duration: '3 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 22%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 3个月/3屏幕 套餐（34.99€）' },
      { duration: '6 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 39%"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 6个月/3屏幕 套餐（54.99€）' },
      { duration: '12 个月', features: '["26,000+ 直播频道","HD & 4K 超高清","先进防卡顿","24/7 客户支持","立省 50%","全网最划算"]', ctaText: '立即订阅', waMessage: '您好，我想订阅 12个月/3屏幕 套餐（89.99€）' },
    ],
  }

  for (let tIdx = 0; tIdx < tiers.length; tIdx++) {
    const tier = tiers[tIdx]
    const name = zhTierNames[tIdx] ?? zhTierNames[zhTierNames.length - 1]

    await prisma.tierLabel.upsert({
      where: { tierId_locale: { tierId: tier.id, locale: 'zh' } },
      update: { name },
      create: { tierId: tier.id, locale: 'zh', name },
    })

    const plans = tier.plans
    const planTranslations = zhPlanData[tIdx] ?? []

    for (let pIdx = 0; pIdx < plans.length; pIdx++) {
      const plan = plans[pIdx]
      const trans = planTranslations[pIdx] ?? planTranslations[planTranslations.length - 1]
      if (!trans) continue

      await prisma.planLabel.upsert({
        where: { planId_locale: { planId: plan.id, locale: 'zh' } },
        update: {
          duration: trans.duration,
          features: trans.features,
          ctaText: trans.ctaText,
          waMessage: trans.waMessage,
        },
        create: {
          planId: plan.id,
          locale: 'zh',
          duration: trans.duration,
          features: trans.features,
          ctaText: trans.ctaText,
          waMessage: trans.waMessage,
          currencySymbol: '€',
        },
      })
    }
  }
  console.log('✅ Pricing tiers & plans seeded in Chinese')

  console.log('🎉 Seeding Chinese translation complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
