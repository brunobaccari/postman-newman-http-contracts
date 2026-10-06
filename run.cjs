const fs = require('node:fs');
const newman = require('newman');

for (const name of ['ECHO_BASE_URL', 'ECHO_USERNAME', 'ECHO_PASSWORD']) {
  if (!process.env[name]) throw new Error(`Configure ${name} in .env or the environment`);
}
const target = new URL(process.env.ECHO_BASE_URL);
if (target.protocol !== 'https:' || target.username || target.password || target.search || target.hash) {
  throw new Error('ECHO_BASE_URL must be HTTPS without credentials, query or fragment');
}
fs.mkdirSync('results', { recursive: true });
newman.run({
  collection: require('./collections/http-contracts.postman_collection.json'),
  envVar: [
    { key: 'base_url', value: target.href.replace(/\/$/, '') },
    { key: 'demo_username', value: process.env.ECHO_USERNAME },
    { key: 'demo_password', value: process.env.ECHO_PASSWORD },
  ],
  reporters: ['cli', 'junit'],
  reporter: { junit: { export: 'results/junit.xml' } },
  timeoutRequest: 15000,
  timeoutScript: 5000,
  timeout: 120000,
  ignoreRedirects: true,
}, (error, summary) => {
  if (error) console.error('Collection could not finish:', error.name);
  const stats = summary?.run?.stats;
  process.exitCode = error || summary?.run?.failures?.length
    || stats?.requests?.total !== 7 || stats?.assertions?.total !== 7 ? 1 : 0;
});
