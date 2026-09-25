import { Router, type Request, type Response } from 'express';
import * as XLSX from 'xlsx';
import { db } from '../db.ts';
import { authMiddleware } from '../auth.ts';
import type { Student, TeacherStaff } from '../../src/types.ts';

const router = Router();

// ================= TEACHERS / PTK =================
router.get('/teachers', async (_req: Request, res: Response) => {
  const teachers = await db.getTeachers();
  return res.json({ success: true, data: teachers });
});

router.post('/teachers', authMiddleware, async (req: Request, res: Response) => {
  const teacher = await db.createTeacher(req.body);
  return res.status(201).json({ success: true, message: 'Data PTK berhasil ditambahkan', data: teacher });
});

router.put('/teachers/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateTeacher(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Data PTK tidak ditemukan' });
  return res.json({ success: true, message: 'Data PTK berhasil diperbarui', data: updated });
});

router.delete('/teachers/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteTeacher(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Data PTK tidak ditemukan' });
  return res.json({ success: true, message: 'Data PTK berhasil dihapus' });
});

// Import PTK
router.post('/teachers/import', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Format data import tidak valid atau kosong' });
    }

    const errors: { row: number; col: string; message: string }[] = [];
    const validItems: Omit<TeacherStaff, 'id'>[] = [];

    items.forEach((item, index) => {
      const rowNum = index + 2; // header is row 1
      if (!item.nama || typeof item.nama !== 'string' || item.nama.trim().length === 0) {
        errors.push({ row: rowNum, col: 'Nama', message: 'Nama PTK tidak boleh kosong' });
      }
      if (!item.jenisPTK) {
        errors.push({ row: rowNum, col: 'Jenis PTK', message: 'Jenis PTK wajib diisi' });
      }
      if (!item.pendidikanTerakhir) {
        errors.push({ row: rowNum, col: 'Pendidikan', message: 'Pendidikan terakhir wajib diisi' });
      }

      if (errors.length === 0) {
        validItems.push({
          nama: item.nama.trim(),
          nip: item.nip || '-',
          nuptk: item.nuptk || '-',
          jenisPTK: item.jenisPTK || 'Guru Mata Pelajaran',
          jabatan: item.jabatan || item.jenisPTK || 'Guru',
          mataPelajaran: item.mataPelajaran || '-',
          pendidikanTerakhir: item.pendidikanTerakhir || 'S1',
          statusKepegawaian: item.statusKepegawaian || 'PNS',
          foto: item.foto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          email: item.email || `${item.nama.toLowerCase().replace(/[^a-z]/g, '')}@sekolah.sch.id`,
          telepon: item.telepon || '-',
          tahunMulai: item.tahunMulai || '2024',
          deskripsiSingkat: item.deskripsiSingkat || 'Pendidik berdedikasi tinggi'
        });
      }
    });

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: `Terdapat ${errors.length} kesalahan validasi pada data import. Perbaiki data sebelum melanjutkan.`,
        errors
      });
    }

    const count = await db.batchInsertTeachers(validItems);
    return res.json({
      success: true,
      message: `Berhasil mengimpor ${count} data guru/staf (PTK)`,
      count
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal memproses import data PTK' });
  }
});

// Export PTK XLSX / Excel
router.get('/teachers/export', authMiddleware, async (_req: Request, res: Response) => {
  const teachers = await db.getTeachers();
  const rows = teachers.map((t, index) => ({
    'No': index + 1,
    'Nama Lengkap & Gelar': t.nama,
    'NIP': t.nip || '-',
    'NUPTK': t.nuptk || '-',
    'Jenis PTK': t.jenisPTK,
    'Jabatan / Tugas': t.jabatan,
    'Mata Pelajaran': t.mataPelajaran || '-',
    'Pendidikan Terakhir': t.pendidikanTerakhir,
    'Status Kepegawaian': t.statusKepegawaian,
    'Email Resmi': t.email || '-',
    'No. Telepon / WA': t.telepon || '-',
    'Tahun Mulai Bertugas': t.tahunMulai || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 22 },
    { wch: 18 },
    { wch: 20 },
    { wch: 22 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 26 },
    { wch: 18 },
    { wch: 18 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data PTK');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="data-ptk-sekolah.xlsx"');
  return res.send(buffer);
});

// ================= SUBJECTS =================
router.get('/subjects', async (_req: Request, res: Response) => {
  const subjects = await db.getSubjects();
  return res.json({ success: true, data: subjects });
});

router.post('/subjects', authMiddleware, async (req: Request, res: Response) => {
  const subject = await db.createSubject(req.body);
  return res.status(201).json({ success: true, message: 'Mata pelajaran berhasil ditambahkan', data: subject });
});

router.put('/subjects/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateSubject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Mata pelajaran tidak ditemukan' });
  return res.json({ success: true, message: 'Mata pelajaran berhasil diperbarui', data: updated });
});

router.delete('/subjects/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteSubject(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Mata pelajaran tidak ditemukan' });
  return res.json({ success: true, message: 'Mata pelajaran berhasil dihapus' });
});

// ================= STUDENTS =================
// Public safe student listing (Privacy protected: no phone numbers, parents, or home addresses)
router.get('/students/public', async (req: Request, res: Response) => {
  const { kelas, rombel, search } = req.query;
  const students = await db.getStudents({
    kelas: kelas as string,
    rombel: rombel as string,
    search: search as string
  });

  const sanitized = students.map(s => ({
    id: s.id,
    nis: s.nis,
    nama: s.nama,
    jenisKelamin: s.jenisKelamin,
    kelas: s.kelas,
    rombel: s.rombel,
    tahunMasuk: s.tahunMasuk,
    status: s.status
  }));

  return res.json({ success: true, data: sanitized });
});

// Admin full student listing
router.get('/students', authMiddleware, async (req: Request, res: Response) => {
  const { kelas, rombel, search } = req.query;
  const students = await db.getStudents({
    kelas: kelas as string,
    rombel: rombel as string,
    search: search as string
  });
  return res.json({ success: true, data: students });
});

router.post('/students', authMiddleware, async (req: Request, res: Response) => {
  const student = await db.createStudent(req.body);
  return res.status(201).json({ success: true, message: 'Data siswa berhasil ditambahkan', data: student });
});

router.put('/students/:id', authMiddleware, async (req: Request, res: Response) => {
  const updated = await db.updateStudent(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan' });
  return res.json({ success: true, message: 'Data siswa berhasil diperbarui', data: updated });
});

router.delete('/students/:id', authMiddleware, async (req: Request, res: Response) => {
  const deleted = await db.deleteStudent(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan' });
  return res.json({ success: true, message: 'Data siswa berhasil dihapus' });
});

// Import Students with strict row & column error reporting
router.post('/students/import', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Format data siswa kosong atau tidak valid' });
    }

    const errors: { row: number; col: string; message: string }[] = [];
    const validItems: Omit<Student, 'id'>[] = [];

    items.forEach((item, index) => {
      const rowNum = index + 2;
      if (!item.nis || String(item.nis).trim().length === 0) {
        errors.push({ row: rowNum, col: 'NIS', message: 'Nomor Induk Siswa (NIS) tidak boleh kosong' });
      }
      if (!item.nama || String(item.nama).trim().length === 0) {
        errors.push({ row: rowNum, col: 'Nama', message: 'Nama siswa wajib diisi' });
      }
      if (!item.kelas) {
        errors.push({ row: rowNum, col: 'Kelas', message: 'Tingkat kelas wajib diisi' });
      }
      if (!item.jenisKelamin || !['Laki-laki', 'Perempuan'].includes(item.jenisKelamin)) {
        errors.push({ row: rowNum, col: 'Jenis Kelamin', message: 'Jenis kelamin harus "Laki-laki" atau "Perempuan"' });
      }

      if (errors.length === 0) {
        validItems.push({
          nis: String(item.nis).trim(),
          nisn: item.nisn ? String(item.nisn).trim() : '-',
          nama: String(item.nama).trim(),
          jenisKelamin: item.jenisKelamin === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
          tempatLahir: item.tempatLahir || 'Kampar',
          tanggalLahir: item.tanggalLahir || '2015-01-01',
          kelas: String(item.kelas).trim(),
          rombel: item.rombel ? String(item.rombel).trim() : `${item.kelas}A`,
          tahunMasuk: item.tahunMasuk ? String(item.tahunMasuk).trim() : '2024',
          status: item.status || 'Aktif',
          namaOrangTua: item.namaOrangTua || '-',
          teleponOrangTua: item.teleponOrangTua || '-',
          alamat: item.alamat || '-'
        });
      }
    });

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: `Validasi gagal pada ${errors.length} data. Perbaiki baris dan kolom berikut:`,
        errors
      });
    }

    const count = await db.batchInsertStudents(validItems);
    return res.json({
      success: true,
      message: `Berhasil mengimpor ${count} data peserta didik baru`,
      count
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal memproses import data siswa' });
  }
});

// Export Students XLSX / Excel
router.get('/students/export', authMiddleware, async (_req: Request, res: Response) => {
  const students = await db.getStudents();
  const rows = students.map((s, index) => ({
    'No': index + 1,
    'NIS': s.nis,
    'NISN': s.nisn || '-',
    'Nama Siswa': s.nama,
    'Jenis Kelamin': s.jenisKelamin,
    'Kelas': s.kelas,
    'Rombel': s.rombel,
    'Tempat Lahir': s.tempatLahir,
    'Tanggal Lahir': s.tanggalLahir,
    'Tahun Masuk': s.tahunMasuk,
    'Status': s.status,
    'Nama Orang Tua': s.namaOrangTua || '-',
    'Telepon': s.teleponOrangTua || '-',
    'Alamat': s.alamat || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 15 },
    { wch: 25 },
    { wch: 14 },
    { wch: 10 },
    { wch: 10 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
    { wch: 10 },
    { wch: 22 },
    { wch: 16 },
    { wch: 30 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="data-siswa-sekolah.xlsx"');
  return res.send(buffer);
});

export default router;
