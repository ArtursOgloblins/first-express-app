"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = void 0;
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Authentication required.');
    }
    const [authType, base64Credentials] = authHeader.split(' ');
    if (authType !== 'Basic') {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Invalid credentials');
        return;
    }
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    if (username === 'admin' && password === 'qwerty') {
        next();
    }
    else {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Invalid credentials');
    }
};
exports.basicAuth = basicAuth;
