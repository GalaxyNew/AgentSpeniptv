const { Client } = require('ssh2');

const config = {
  host: '65.20.105.127',
  port: 22,
  username: 'root',
  password: 'i3C?bfh%xE(2cD5r'
};

const conn = new Client();

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- Running: ${cmd} ---`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      
      let out = '';
      let errOut = '';
      stream.on('close', (code, signal) => {
        resolve({ code, out, errOut });
      }).on('data', (data) => {
        out += data.toString();
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        errOut += data.toString();
        process.stderr.write(data.toString());
      });
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connection established for Nginx log inspection.');
  
  try {
    // View recent access logs
    console.log('Last 20 lines of Nginx access.log:');
    await executeCommand(conn, 'tail -n 20 /var/log/nginx/access.log');
    
    // View recent error logs
    console.log('Last 20 lines of Nginx error.log:');
    await executeCommand(conn, 'tail -n 20 /var/log/nginx/error.log');

    // Check if Nginx config has any SSL server configured
    console.log('Checking active Nginx configs:');
    await executeCommand(conn, 'cat /etc/nginx/sites-enabled/igortv');
    
  } catch (error) {
    console.error('Inspection failed:', error);
  } finally {
    conn.end();
  }
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect(config);
