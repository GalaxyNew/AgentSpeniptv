const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const config = {
  host: '65.20.105.127',
  port: 22,
  username: 'root',
  password: 'i3C?bfh%xE(2cD5r'
};

const remoteAppDir = '/var/www/igortv';
const remoteZipPath = '/tmp/server-data.zip';
const localZipPath = path.join(__dirname, '..', 'server-data.zip');

const conn = new Client();

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`Executing remote command: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      
      stream.on('close', (code, signal) => {
        if (code === 0 || code === 12) { // 12 might be warning for zip if some files don't exist
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  });
}

function downloadFile(conn, remotePath, localPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading remote ${remotePath} to local ${localPath}...`);
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      
      const writeStream = fs.createWriteStream(localPath);
      
      sftp.fastGet(remotePath, localPath, {}, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Download complete.');
          resolve();
        }
      });
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connection established to download server data.');
  
  try {
    // 1. Package remote data
    console.log('--- Step 1: Packaging remote database and uploads ---');
    // Zip dev.db, prisma/dev.db and public/uploads if they exist
    await executeCommand(conn, `cd ${remoteAppDir} && zip -r ${remoteZipPath} dev.db prisma/dev.db public/uploads`);

    // 2. Download zip file
    console.log('--- Step 2: Downloading package ---');
    await downloadFile(conn, remoteZipPath, localZipPath);

    // 3. Clean remote zip
    console.log('--- Step 3: Cleaning up remote temporary package ---');
    await executeCommand(conn, `rm -f ${remoteZipPath}`);

    console.log('\n=========================================');
    console.log('DOWNLOAD SUCCESSFUL! Package saved as server-data.zip');
    console.log('=========================================');
    
    conn.end();
  } catch (error) {
    console.error('\nDownload process failed with error:', error);
    conn.end();
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('SSH Client Error:', err);
  process.exit(1);
}).connect(config);
