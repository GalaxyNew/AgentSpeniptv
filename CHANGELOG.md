# Changelog

## 2026-07-22 - Listas IPTV España SEO Blog（待发布）
- 新增 `listas-iptv-espana-legales` 西语文章的幂等 seed 与冻结输入
- 博客详情页支持从可见 FAQ 自动生成 `FAQPage` JSON-LD
- `BlogPosting.mainEntityOfPage` 与页面自定义 canonical 保持一致
- 将已知 404 内链替换为实测 HTTP 200 的站内博客 URL
- 补齐现有 releases API 已引用但未声明的 `pg` 运行依赖
- 本变更仅提交代码与验证，不含生产部署

## 2026-07-11 - SEO P0 Meta/Title/Redirect Fix
- 修复 PageSeo.es metaDescription 脏前缀 `Description：`
- 补齐 3 篇西语博客缺失 metaDescription
- 缩短过长 Title/metaTitle
- proxy.ts: `/es/*` 默认 307 改为 301 永久重定向
- 生产已验证并通过 DataForSEO 复检 P0 PASS
- 同步自生产 /var/www/igortv（不含 .env / dev.db / node_modules / .next / uploads）

