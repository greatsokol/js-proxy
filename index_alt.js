const express = require('express');
const proxy = require('express-http-proxy');
const cors = require("cors");
const compression = require('compression');
const url = require("url");
const fs = require("fs");
const https = require("https");
//https.globalAgent.options.ca = require('ssl-root-cas').create();

const app = express();
//app.use(cors());
//app.use(compression());

const host = 'https://keycloak.local';
const apiProxy = proxy(host, {

    proxyReqPathResolver: req => {
        //console.log(req);
        const path = url.parse(req.originalUrl).path;
        console.log(host + req.originalUrl);
        return path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
        const caCert = fs.readFileSync('certs/ca.crt', 'utf8');
        console.log("decorator");
        proxyReqOpts.ca = [caCert]
        return proxyReqOpts;
    }
});
app.use(apiProxy)

const privateKey = fs.readFileSync('certs/any.local.key', 'utf8');
const certificate = fs.readFileSync('certs/any.local.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);

const port = 8080;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // switch off certificate hostname check
console.log('App listening at https://localhost:' + port);
httpsServer.listen(port);
