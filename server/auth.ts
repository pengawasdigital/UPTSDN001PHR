import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';
import type { Role, User } from '../src/types.ts';

// Automatically managed internal server-side secret (JWT_SECRET is not required from user)
const SERVER_SECRET = process.env.JWT_SECRET || 'sekolah-secret-' + crypto.createHash('sha256').update(process.env.APP_URL || 'sekolah-default-salt').digest('hex');

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    SERVER_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Akses ditolak: Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SERVER_SECRET) as { id: string; email: string; role: Role };

    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak valid atau sudah dihapus' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token kedaluwarsa atau tidak valid' });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Otentikasi dibutuhkan' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses dibatasi: Anda tidak memiliki izin untuk tindakan ini'
      });
    }
    next();
  };
}
