import {Request, Response, NextFunction} from "express";
export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        res.set('WWW-Authenticate', 'Basic realm="401"')
        return res.status(401).send('Authentication required.')
    }
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = credentials.split(':')

    if (username === 'admin' && password === 'qwerty') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Invalid credentials');
    }
}
