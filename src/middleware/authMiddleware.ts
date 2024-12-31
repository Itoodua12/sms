import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token;
    let authHeader = req.headers.authorization as string;
    
    if (!authHeader?.startsWith("Bearer")) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: 'Authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default verifyToken;