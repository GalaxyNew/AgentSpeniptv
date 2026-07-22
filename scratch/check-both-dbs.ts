const Database = require('better-sqlite3');
const path = require('path');

function checkDb(dbPath) {
  console.log(`\n=== Checking Database: ${dbPath} ===`);
  try {
    const db = new Database(dbPath);
    
    // Get defaultLocale from SiteSettings
    const settings = db.prepare("SELECT * FROM SiteSettings WHERE id = 'main'").get();
    console.log('Site Domain:', settings ? settings.siteDomain : 'null');
    console.log('Default Locale:', settings ? settings.defaultLocale : 'null');
    
    // Check which modules are visible for locale: es
    const modules = db.prepare("SELECT id, isVisible_es, sortOrder_es FROM PageModule ORDER BY sortOrder_es ASC").all();
    console.log('Visible Modules for es:');
    const visible = modules.filter(m => m.isVisible_es === 1 || m.isVisible_es === 'true' || m.isVisible_es === true).map(m => m.id);
    console.log(visible);
    
    db.close();
  } catch (err) {
    console.error('Error reading database:', err.message);
  }
}

checkDb(path.resolve(__dirname, '../dev.db'));
checkDb(path.resolve(__dirname, '../prisma/dev.db'));
