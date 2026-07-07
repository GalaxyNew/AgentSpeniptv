-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PageModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ModuleContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ModuleContent_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "PageModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModuleSeo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "headingLevel" TEXT NOT NULL DEFAULT 'h2',
    "anchorId" TEXT NOT NULL DEFAULT '',
    "focusKeywords" TEXT NOT NULL DEFAULT '',
    "imageAltTexts" TEXT NOT NULL DEFAULT '{}',
    "schemaMicro" TEXT,
    CONSTRAINT "ModuleSeo_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "PageModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PageSeo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "TierLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tierId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "TierLabel_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PricingTier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tierId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PricingPlan_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PricingTier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT '',
    "features" TEXT NOT NULL DEFAULT '[]',
    "ctaText" TEXT NOT NULL DEFAULT '',
    "waMessage" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "PlanLabel_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SchemaConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "orgName" TEXT NOT NULL DEFAULT '',
    "orgUrl" TEXT NOT NULL DEFAULT '',
    "orgLogoUrl" TEXT NOT NULL DEFAULT '',
    "orgPhone" TEXT NOT NULL DEFAULT '',
    "orgEmail" TEXT NOT NULL DEFAULT '',
    "orgAddress" TEXT NOT NULL DEFAULT '',
    "ratingValue" REAL NOT NULL DEFAULT 4.8,
    "reviewCount" INTEGER NOT NULL DEFAULT 15000,
    "priceMin" REAL NOT NULL DEFAULT 6.99,
    "priceMax" REAL NOT NULL DEFAULT 37.99,
    "priceCurrency" TEXT NOT NULL DEFAULT 'EUR'
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "brandName" TEXT NOT NULL DEFAULT 'IPTV Pro',
    "brandLogoUrl" TEXT NOT NULL DEFAULT '',
    "brandSlogan_fr" TEXT NOT NULL DEFAULT 'Streaming illimité, qualité premium',
    "brandSlogan_es" TEXT NOT NULL DEFAULT 'Streaming ilimitado, calidad premium',
    "brandSlogan_en" TEXT NOT NULL DEFAULT 'Unlimited streaming, premium quality',
    "siteDomain" TEXT NOT NULL DEFAULT 'https://example.com',
    "activeTheme" TEXT NOT NULL DEFAULT 'dark-tech',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "whatsappMsg_fr" TEXT NOT NULL DEFAULT 'Bonjour, je souhaite m''abonner à IPTV Pro.',
    "whatsappMsg_es" TEXT NOT NULL DEFAULT 'Hola, quiero suscribirme a IPTV Pro.',
    "whatsappMsg_en" TEXT NOT NULL DEFAULT 'Hello, I want to subscribe to IPTV Pro.',
    "telegramUrl" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "socialLinks" TEXT NOT NULL DEFAULT '{}',
    "defaultLocale" TEXT NOT NULL DEFAULT 'fr',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "footerCopyright" TEXT NOT NULL DEFAULT '© {year} {brand}. All rights reserved.',
    "analyticsHead" TEXT NOT NULL DEFAULT '',
    "analyticsBody" TEXT NOT NULL DEFAULT '',
    "robotsTxt" TEXT NOT NULL DEFAULT 'User-agent: *
Allow: /
Disallow: /admin/'
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "ModuleContent_moduleId_locale_idx" ON "ModuleContent"("moduleId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleContent_moduleId_locale_key_key" ON "ModuleContent"("moduleId", "locale", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleSeo_moduleId_key" ON "ModuleSeo"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "PageSeo_locale_key" ON "PageSeo"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "TierLabel_tierId_locale_key" ON "TierLabel"("tierId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLabel_planId_locale_key" ON "PlanLabel"("planId", "locale");
