const { Client } = require('ssh2');
const config = {
  host: '65.20.101.78',
  port: 22,
  username: 'root',
  password: 'E3m{StZ-UbYoxdQV'
};

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established to check remote status.');
  conn.exec('pm2 show igortv2', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).connect(config);
