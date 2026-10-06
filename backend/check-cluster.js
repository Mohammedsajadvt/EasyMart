const dns = require('dns');

const candidates = [
  'cluster0.mongodb.net',
  'cluster0.6ac48.mongodb.net',
  'cluster0.6ac4841.mongodb.net',
  'cluster0.6ac4844.mongodb.net',
  'cluster0-shard-00-00.mongodb.net'
];

candidates.forEach(host => {
  dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
    if (!err) {
      console.log('FOUND VALID CLUSTER HOST:', host, addresses);
    } else {
      console.log('Not found:', host);
    }
  });
});
