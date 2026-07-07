const { Client } = require('ssh2');

const config = {
  host: '65.20.105.127',
  port: 22,
  username: 'root',
  password: 'i3C?bfh%xE(2cD5r'
};

const conn = new Client();

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('close', (code) => {
        if (code === 0 || code === 1) resolve(); // code 1 = file not found (ok)
        else reject(new Error(`Exit code ${code}`));
      }).on('data', d => process.stdout.write(d.toString()))
        .stderr.on('data', d => process.stderr.write(d.toString()));
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connected.');
  try {
    await exec(conn, 'ls /var/www/igortv/middleware.ts 2>/dev/null && echo EXISTS || echo NOT_FOUND');
    await exec(conn, 'rm -f /var/www/igortv/middleware.ts');
    console.log('\n✅ Deleted middleware.ts from remote server.');
    await exec(conn, 'pm2 restart igortv');
    console.log('✅ PM2 restarted.');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    conn.end();
  }
}).on('error', e => console.error('SSH Error:', e))
  .connect(config);
