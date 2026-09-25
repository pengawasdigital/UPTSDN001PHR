import { Router, type Request, type Response } from 'express';
import { db } from '../db.ts';
import { authMiddleware } from '../auth.ts';

const router = Router();

// Public contact submission
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { nama, email, telepon, subjek, pesan } = req.body;

    if (!nama || !email || !subjek || !pesan) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi nama, email, subjek, dan isi pesan Anda.'
      });
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format alamat email tidak valid.'
      });
    }

    const message = await db.createContactMessage({
      nama: nama.trim(),
      email: email.trim(),
      telepon: telepon ? telepon.trim() : undefined,
      subjek: subjek.trim(),
      pesan: pesan.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Pesan Anda telah berhasil terkirim. Pihak sekolah akan segera merespons ke email/kontak Anda.',
      data: message
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengirimkan pesan.'
    });
  }
});

// Admin get contact messages
router.get('/contact', authMiddleware, async (_req: Request, res: Response) => {
  const messages = await db.getContactMessages();
  return res.json({ success: true, data: messages });
});

// Admin update message status
router.put('/contact/:id/status', authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['belum_dibaca', 'sudah_dibaca', 'dibalas'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  }

  const updated = await db.updateContactMessageStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
  return res.json({ success: true, message: 'Status pesan berhasil diperbarui', data: updated });
});

// Admin delete contact message
router.delete('/contact/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteContactMessage(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
  return res.json({ success: true, message: 'Pesan berhasil dihapus' });
});

export default router;
