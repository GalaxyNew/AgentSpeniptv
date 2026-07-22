const Database = require('better-sqlite3');
const path = require('path');

function checkDb(dbPath) {
  console.log(`\n=== Checking Database: ${dbPath} ===`);
  try {
    const db = new Database(dbPath);
    
    const modules = db.prepare("SELECT id, isVisible_es, sortOrder_es FROM PageModule ORDER BY sortOrder_es ASC").all();
    console.log('All Modules for es (id | isVisible_es | sortOrder_es):');
    modules.forEach(m => {
      console.log(`  ${m.id} | ${m.isVisible_es} | ${m.sortOrder_es}`);
    });
    
    db.close();
  } catch (err) {
    console.error('Error reading database:', err.message);
  }
}

checkDb(path.resolve(__dirname, '../dev.db'));
