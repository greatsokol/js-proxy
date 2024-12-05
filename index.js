const fs = require("fs");
const httpProxy = require('http-proxy');

const privateKey = fs.readFileSync('certs/any.local.key', 'utf8');
const certificate = fs.readFileSync('certs/any.local.crt', 'utf8');

const option_need_ssl = false;
const credentials = option_need_ssl
    ? {key: privateKey, cert: certificate}
    : null;

const server = httpProxy.createServer({
    ssl: credentials ? credentials : undefined,
    target: 'https://keycloak.local',
    secure: false // Depends on your needs, could be false.
});

const protocol = credentials
    ? 'https'
    : 'http';

const port = 8888;
console.log(`listening on ${protocol}://localhost:${port}`);
server
    .on('proxyReq', (ev) => {
        console.log(`${ev.method} ${ev.path}`)
    })
    .listen(port);

