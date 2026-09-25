import { Router, type Request, type Response } from 'express';
import { db } from '../db.ts';
import { authMiddleware, requireRole } from '../auth.ts';

const router = Router();

// Profile
router.get('/school-profile', async (_req: Request, res: Response) => {
  const profile = await db.getSchoolProfile();
  return res.json({ success: true, data: profile });
});

router.put('/school-profile', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateSchoolProfile(req.body);
  return res.json({ success: true, message: 'Profil sekolah berhasil diperbarui', data: updated });
});

// Vision & Mission
router.get('/vision-mission', async (_req: Request, res: Response) => {
  const vm = await db.getVisionMission();
  return res.json({ success: true, data: vm });
});

router.put('/vision-mission', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateVisionMission(req.body);
  return res.json({ success: true, message: 'Visi dan misi berhasil diperbarui', data: updated });
});

// Principal Message
router.get('/principal-message', async (_req: Request, res: Response) => {
  const pm = await db.getPrincipalMessage();
  return res.json({ success: true, data: pm });
});

router.put('/principal-message', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updatePrincipalMessage(req.body);
  return res.json({ success: true, message: 'Sambutan kepala sekolah berhasil diperbarui', data: updated });
});

// Settings (Admin only)
router.get('/settings', async (_req: Request, res: Response) => {
  const settings = await db.getSettings();
  return res.json({ success: true, data: settings });
});

router.put('/settings', authMiddleware, requireRole('ADMIN'), async (req: Request, res: Response) => {
  const updated = await db.updateSettings(req.body);
  return res.json({ success: true, message: 'Pengaturan website berhasil diperbarui', data: updated });
});

// Advantages
router.get('/advantages', async (_req: Request, res: Response) => {
  const list = await db.getAdvantages();
  return res.json({ success: true, data: list });
});

router.post('/advantages', authMiddleware, async (req: Request, res: Response) => {
  const created = await db.createAdvantage(req.body);
  return res.status(201).json({ success: true, message: 'Keunggulan berhasil ditambahkan', data: created });
});

router.put('/advantages/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateAdvantage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
  return res.json({ success: true, message: 'Keunggulan berhasil diperbarui', data: updated });
});

router.delete('/advantages/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteAdvantage(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
  return res.json({ success: true, message: 'Keunggulan berhasil dihapus' });
});

// Dashboard Statistics
router.get('/dashboard/stats', authMiddleware, async (_req: Request, res: Response) => {
  const stats = await db.getDashboardStats();
  return res.json({ success: true, data: stats });
});

export default router;
