import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { generateToken, authMiddleware, type AuthRequest } from '../auth.ts';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    };

    const token = generateToken(safeUser);

    return res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: safeUser
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server saat login'
    });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Logout berhasil'
  });
});

export default router;
