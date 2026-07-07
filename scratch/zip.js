const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'temp_zip');
const zipPath = path.join(rootDir, 'deploy.zip');

console.log('Preparing to package project...');

// Cleanup old temp and zip
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Create temp directory
fs.mkdirSync(tempDir);

// Folders and files to copy
const itemsToCopy = [
  'app',
  'components',
  'lib',
  'prisma',
  'public',
  'scripts',
  'next.config.ts',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'proxy.ts',
  'prisma.config.ts',
  '.next'
];

try {
  for (const item of itemsToCopy) {
    const src = path.join(rootDir, item);
    const dest = path.join(tempDir, item);
    if (!fs.existsSync(src)) continue;
    
    console.log(`Copying ${item}...`);
    if (fs.statSync(src).isDirectory()) {
      fs.cpSync(src, dest, { 
        recursive: true,
        filter: (srcPath) => {
          const relative = path.relative(rootDir, srcPath);
          const normalized = relative.replace(/\\/g, '/');
          
          if (
            normalized.includes('.next/cache') ||
            normalized.includes('.next/dev') ||
            normalized.includes('.next/node_modules') ||
            normalized.endsWith('dev.db') ||
            normalized.endsWith('dev.db.bak') ||
            normalized.includes('public/uploads')
          ) {
            return false;
          }
          return true;
        }
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
} catch (err) {
  console.error('Error copying item:', err);
  process.exit(1);
}

// Exclude large/sensitive files
const uploadsDir = path.join(tempDir, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sqliteDb = path.join(tempDir, 'prisma', 'dev.db');
if (fs.existsSync(sqliteDb)) {
  console.log('Removing SQLite dev.db from zip payload...');
  fs.unlinkSync(sqliteDb);
}
const sqliteDbBak = path.join(tempDir, 'prisma', 'dev.db.bak');
if (fs.existsSync(sqliteDbBak)) {
  fs.unlinkSync(sqliteDbBak);
}

// Compress using PowerShell
console.log('Compressing files to project.zip...');
try {
  execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}'"`);
  console.log('🎉 Successfully created deploy.zip!');
} catch (err) {
  console.error('Failed to compress using PowerShell:', err.message);
}

// Cleanup temp directory
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Cleanup completed.');
