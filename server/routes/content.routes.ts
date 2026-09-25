import { Router, type Request, type Response } from 'express';
import { db } from '../db.ts';
import { authMiddleware } from '../auth.ts';

const router = Router();

// ================= NEWS =================
router.get('/news', async (req: Request, res: Response) => {
  const { category, search, status } = req.query;
  const news = await db.getNews({
    category: category as string,
    search: search as string,
    status: status as string
  });
  return res.json({ success: true, data: news });
});

router.get('/news/:idOrSlug', async (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  let item = await db.getNewsById(param);
  if (!item) {
    item = await db.getNewsBySlug(param);
  }
  if (!item) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
  return res.json({ success: true, data: item });
});

router.post('/news', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createNews(req.body);
  return res.status(201).json({ success: true, message: 'Berita berhasil diterbitkan', data: item });
});

router.put('/news/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateNews(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  return res.json({ success: true, message: 'Berita berhasil diperbarui', data: updated });
});

router.delete('/news/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteNews(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  return res.json({ success: true, message: 'Berita berhasil dihapus' });
});

// ================= ACHIEVEMENTS =================
router.get('/achievements', async (_req: Request, res: Response) => {
  const list = await db.getAchievements();
  return res.json({ success: true, data: list });
});

router.post('/achievements', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createAchievement(req.body);
  return res.status(201).json({ success: true, message: 'Prestasi berhasil ditambahkan', data: item });
});

router.put('/achievements/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateAchievement(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Prestasi tidak ditemukan' });
  return res.json({ success: true, message: 'Prestasi berhasil diperbarui', data: updated });
});

router.delete('/achievements/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteAchievement(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Prestasi tidak ditemukan' });
  return res.json({ success: true, message: 'Prestasi berhasil dihapus' });
});

// ================= GALLERIES =================
router.get('/galleries', async (_req: Request, res: Response) => {
  const list = await db.getGalleries();
  return res.json({ success: true, data: list });
});

router.post('/galleries', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createGallery(req.body);
  return res.status(201).json({ success: true, message: 'Media galeri berhasil ditambahkan', data: item });
});

router.put('/galleries/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateGallery(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Galeri tidak ditemukan' });
  return res.json({ success: true, message: 'Galeri berhasil diperbarui', data: updated });
});

router.delete('/galleries/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteGallery(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Galeri tidak ditemukan' });
  return res.json({ success: true, message: 'Galeri berhasil dihapus' });
});

// ================= EXTRACURRICULARS =================
router.get('/extracurriculars', async (_req: Request, res: Response) => {
  const list = await db.getExtracurriculars();
  return res.json({ success: true, data: list });
});

router.post('/extracurriculars', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createExtracurricular(req.body);
  return res.status(201).json({ success: true, message: 'Ekstrakurikuler berhasil ditambahkan', data: item });
});

router.put('/extracurriculars/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateExtracurricular(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Ekstrakurikuler tidak ditemukan' });
  return res.json({ success: true, message: 'Ekstrakurikuler berhasil diperbarui', data: updated });
});

router.delete('/extracurriculars/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteExtracurricular(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Ekstrakurikuler tidak ditemukan' });
  return res.json({ success: true, message: 'Ekstrakurikuler berhasil dihapus' });
});

// ================= FACILITIES =================
router.get('/facilities', async (_req: Request, res: Response) => {
  const list = await db.getFacilities();
  return res.json({ success: true, data: list });
});

router.post('/facilities', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createFacility(req.body);
  return res.status(201).json({ success: true, message: 'Fasilitas berhasil ditambahkan', data: item });
});

router.put('/facilities/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateFacility(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Fasilitas tidak ditemukan' });
  return res.json({ success: true, message: 'Fasilitas berhasil diperbarui', data: updated });
});

router.delete('/facilities/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteFacility(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Fasilitas tidak ditemukan' });
  return res.json({ success: true, message: 'Fasilitas berhasil dihapus' });
});

// ================= ORGANIZATION MEMBERS =================
router.get('/organization', async (_req: Request, res: Response) => {
  const list = await db.getOrganization();
  return res.json({ success: true, data: list });
});

router.post('/organization', authMiddleware, async (req: Request, res: Response) => {
  const item = await db.createOrganization(req.body);
  return res.status(201).json({ success: true, message: 'Anggota organisasi berhasil ditambahkan', data: item });
});

router.put('/organization/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateOrganization(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
  return res.json({ success: true, message: 'Anggota organisasi berhasil diperbarui', data: updated });
});

router.delete('/organization/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteOrganization(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
  return res.json({ success: true, message: 'Anggota organisasi berhasil dihapus' });
});

export default router;
