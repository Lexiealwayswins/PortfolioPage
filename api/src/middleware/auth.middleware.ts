console.log('[auth.middleware] JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('[auth.middleware] process.env loaded?', !!process.env.JWT_SECRET);

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';
console.log('JWT_SECRET used for verification:', JWT_SECRET);
// extend Request type，add user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// JWT Authentication middleware
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token（from Authorization header）
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

    // 3. check whether user exists and active
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    // 4. put user info on req
    req.user = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Option：Only allow main admin's middleware（if roles are different）
export const requireMainAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'main') {
    return res.status(403).json({ message: 'Main admin access required' });
  }
  next();
};

export default authenticate;