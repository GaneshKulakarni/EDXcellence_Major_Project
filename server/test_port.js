const net = require('net');
const host = 'cluster1-shard-00-00.be8arxv.mongodb.net';
const port = 27017;
const client = net.createConnection({ host, port }, () => {
    console.log('✅ Port 27017 is open!');
    client.end();
}).on('error', (err) => {
    console.error('❌ Port 27017 is BLOCKED:', err.message);
    process.exit(1);
});
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 5000);
