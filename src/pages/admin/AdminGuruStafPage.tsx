import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { TeacherStaff } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminGuruStafPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeacherStaff | null>(null);
  const [editingItem, setEditingItem] = useState<TeacherStaff | null>(null);

  const [importErrors, setImportErrors] = useState<{ row: number; col: string; message: string }[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<TeacherStaff, 'id'>>({
    nama: '',
    nip: '',
    nuptk: '',
    jenisPTK: 'Guru Mata Pelajaran',
    jabatan: 'Guru Mata Pelajaran',
    mataPelajaran: '',
    pendidikanTerakhir: 'S1',
    statusKepegawaian: 'PNS',
    foto: '',
    email: '',
    telepon: '',
    tahunMulai: '2024',
    deskripsiSingkat: ''
  });

  const toast = useToast();

  const loadData = () => {
    api.getTeachers()
      .then(setTeachers)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      nip: '',
      nuptk: '',
      jenisPTK: 'Guru Mata Pelajaran',
      jabatan: 'Guru',
      mataPelajaran: '',
      pendidikanTerakhir: 'S1 PGSD',
      statusKepegawaian: 'PNS',
      foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      email: '',
      telepon: '',
      tahunMulai: '2024',
      deskripsiSingkat: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TeacherStaff) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      nip: item.nip,
      nuptk: item.nuptk,
      jenisPTK: item.jenisPTK,
      jabatan: item.jabatan,
      mataPelajaran: item.mataPelajaran || '',
      pendidikanTerakhir: item.pendidikanTerakhir,
      statusKepegawaian: item.statusKepegawaian,
      foto: item.foto,
      email: item.email,
      telepon: item.telepon || '',
      tahunMulai: item.tahunMulai,
      deskripsiSingkat: item.deskripsiSingkat
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateTeacher(editingItem.id, formData);
        toast.success('Data PTK berhasil diperbarui');
      } else {
        await api.createTeacher(formData);
        toast.success('Data PTK baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteTeacher(deleteTarget.id);
      toast.success('Data PTK berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus data');
    }
  };

  // Export XLSX
  const handleExportXLSX = () => {
    try {
      if (teachers.length === 0) {
        toast.error('Tidak ada data PTK untuk diexport.');
        return;
      }

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

      const today = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `data-ptk-sekolah-${today}.xlsx`);
      toast.success(`Berhasil mengexport ${teachers.length} data PTK ke file Excel (.xlsx)`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengexport file Excel');
    }
  };

  // Download Sample Import Template (.xlsx)
  const handleDownloadTemplate = () => {
    try {
      const sampleData = [
        {
          'Nama': 'Budi Santoso, S.Pd',
          'NIP': '198501012010011005',
          'NUPTK': '1234567890123456',
          'Jenis PTK': 'Guru Kelas',
          'Jabatan': 'Guru Kelas 3',
          'Mata Pelajaran': 'Tematik',
          'Pendidikan': 'S1 PGSD',
          'Status Kepegawaian': 'PNS',
          'Email': 'budi.santoso@sekolah.sch.id',
          'Telepon': '081234567890',
          'Tahun Mulai': '2010'
        },
        {
          'Nama': 'Siti Aminah, S.Pd.I',
          'NIP': '-',
          'NUPTK': '2345678901234567',
          'Jenis PTK': 'Guru Mapel',
          'Jabatan': 'Guru PAI',
          'Mata Pelajaran': 'Pendidikan Agama Islam',
          'Pendidikan': 'S1 Tarbiyah',
          'Status Kepegawaian': 'PPPK',
          'Email': 'siti.aminah@sekolah.sch.id',
          'Telepon': '081298765432',
          'Tahun Mulai': '2021'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      worksheet['!cols'] = [
        { wch: 25 },
        { wch: 22 },
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
        { wch: 22 },
        { wch: 16 },
        { wch: 18 },
        { wch: 26 },
        { wch: 16 },
        { wch: 14 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template PTK');
      XLSX.writeFile(workbook, 'template-import-ptk.xlsx');
      toast.success('Template Excel (.xlsx) berhasil diunduh');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunduh template Excel');
    }
  };

  // Parse & Import Excel File (.xlsx / .xls / .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    setImporting(true);

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          toast.error('File Excel tidak memiliki lembar kerja (sheet).');
          setImporting(false);
          return;
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        if (rawRows.length === 0) {
          toast.error('File Excel kosong atau tidak memiliki baris data.');
          setImporting(false);
          return;
        }

        // Helper to normalize column keys
        const cleanKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Parse Excel rows into objects
        const items = rawRows.map(row => {
          const entries = Object.entries(row);
          const findVal = (...aliases: string[]) => {
            for (const [k, v] of entries) {
              const ck = cleanKey(k);
              if (aliases.includes(ck)) return v;
            }
            return '';
          };

          const nama = String(findVal('nama', 'namalengkap', 'namaptk', 'namaguru')).trim();
          const nip = String(findVal('nip')).trim();
          const nuptk = String(findVal('nuptk')).trim();
          const jenisPTK = String(findVal('jenisptk', 'jenis', 'kategori')).trim() || 'Guru Mata Pelajaran';
          const jabatan = String(findVal('jabatan', 'tugas', 'tugasutama')).trim() || jenisPTK || 'Guru';
          const mataPelajaran = String(findVal('matapelajaran', 'mapel', 'bidangstudi')).trim() || '-';
          const pendidikanTerakhir = String(findVal('pendidikanterakhir', 'pendidikan', 'ijazah')).trim() || 'S1';
          const statusKepegawaian = String(findVal('statuskepegawaian', 'status', 'kepegawaian')).trim() || 'PNS';
          const email = String(findVal('email', 'emailresmi', 'surel')).trim();
          const telepon = String(findVal('telepon', 'nohp', 'notelepon', 'whatsapp', 'wa')).trim();
          const tahunMulai = String(findVal('tahunmulai', 'tahunmulaibertugas', 'tahun')).trim() || '2020';

          return {
            nama,
            nip: nip || '-',
            nuptk: nuptk || '-',
            jenisPTK,
            jabatan,
            mataPelajaran,
            pendidikanTerakhir,
            statusKepegawaian,
            email: email || `${nama.toLowerCase().replace(/[^a-z]/g, '')}@sekolah.sch.id`,
            telepon: telepon || '-',
            tahunMulai
          };
        });

        const res = await api.importTeachers(items);
        toast.success(res.message);
        setIsImportModalOpen(false);
        loadData();
      } catch (err: any) {
        if (err.errors) {
          setImportErrors(err.errors);
        } else {
          toast.error(err.message || 'Gagal mengimpor file Excel');
        }
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const columns: Column<TeacherStaff>[] = [
    {
      header: 'Foto',
      render: item => (
        <img
          src={item.foto}
          alt={item.nama}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
        />
      ),
      className: 'w-16'
    },
    {
      header: 'Nama & NIP',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400">NIP: {item.nip || '-'}</p>
        </div>
      )
    },
    {
      header: 'Jabatan & Mapel',
      render: item => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{item.jabatan}</p>
          {item.mataPelajaran && item.mataPelajaran !== '-' && (
            <p className="text-[11px] text-emerald-600">{item.mataPelajaran}</p>
          )}
        </div>
      )
    },
    {
      header: 'Jenis PTK',
      render: item => <Badge variant="slate">{item.jenisPTK}</Badge>
    },
    {
      header: 'Status',
      render: item => <Badge variant="emerald">{item.statusKepegawaian}</Badge>,
      className: 'w-24 text-center'
    },
    {
      header: 'Aksi',
      render: item => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-right'
    }
  ];

  if (loading) return <Loading fullPage message="Memuat database PTK..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Direktori Guru & Tenaga Kependidikan (PTK)</h2>
          <p className="text-xs text-slate-500">Kelola database profil, NIP, pangkat, tugas, dan import/export data</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXLSX}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Export data PTK ke format Microsoft Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => {
              setImportErrors([]);
              setIsImportModalOpen(true);
            }}
            className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Import data PTK dari file Microsoft Excel (.xlsx)"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Import Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah PTK</span>
          </button>
        </div>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchPlaceholder="Cari nama, NIP, atau mata pelajaran..."
        searchFilter={(item, q) =>
          Boolean(
            item.nama.toLowerCase().includes(q) ||
            item.nip.includes(q) ||
            item.jabatan.toLowerCase().includes(q) ||
            (item.mataPelajaran && item.mataPelajaran.toLowerCase().includes(q))
          )
        }
      />

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data PTK' : 'Tambah PTK Baru'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Lengkap & Gelar"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              required
            />
            <FormInput
              label="Jabatan Sekolah"
              value={formData.jabatan}
              onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="NIP (PNS/PPPK)"
              value={formData.nip}
              onChange={e => setFormData({ ...formData, nip: e.target.value })}
              placeholder="19xxxxxxxxxxxxxx atau -"
            />
            <FormInput
              label="NUPTK"
              value={formData.nuptk}
              onChange={e => setFormData({ ...formData, nuptk: e.target.value })}
              placeholder="16 digit angka atau -"
            />
            <FormSelect
              label="Jenis PTK"
              value={formData.jenisPTK}
              onChange={e => setFormData({ ...formData, jenisPTK: e.target.value as any })}
              options={[
                { label: 'Kepala Sekolah', value: 'Kepala Sekolah' },
                { label: 'Guru Kelas', value: 'Guru Kelas' },
                { label: 'Guru Mata Pelajaran', value: 'Guru Mata Pelajaran' },
                { label: 'Guru PJOK', value: 'Guru PJOK' },
                { label: 'Guru Pendidikan Agama', value: 'Guru Pendidikan Agama' },
                { label: 'Tenaga Administrasi', value: 'Tenaga Administrasi' },
                { label: 'Operator', value: 'Operator' },
                { label: 'Pustakawan', value: 'Pustakawan' },
                { label: 'Tenaga Kependidikan lainnya', value: 'Tenaga Kependidikan lainnya' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Mata Pelajaran (Jika Guru)"
              value={formData.mataPelajaran || ''}
              onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
            />
            <FormInput
              label="Pendidikan Terakhir"
              value={formData.pendidikanTerakhir}
              onChange={e => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
              placeholder="Contoh: S1 PGSD"
              required
            />
            <FormSelect
              label="Status Kepegawaian"
              value={formData.statusKepegawaian}
              onChange={e => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
              options={[
                { label: 'PNS', value: 'PNS' },
                { label: 'PPPK', value: 'PPPK' },
                { label: 'GTT', value: 'GTT' },
                { label: 'PTT', value: 'PTT' },
                { label: 'Honorer', value: 'Honorer' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              label="Telepon / WhatsApp"
              value={formData.telepon || ''}
              onChange={e => setFormData({ ...formData, telepon: e.target.value })}
            />
            <FormInput
              label="Tahun Mulai Tugas"
              value={formData.tahunMulai}
              onChange={e => setFormData({ ...formData, tahunMulai: e.target.value })}
            />
          </div>

          <ImageUploader
            label="Foto PTK"
            value={formData.foto}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormTextarea
            label="Deskripsi Singkat / Catatan"
            rows={2}
            value={formData.deskripsiSingkat}
            onChange={e => setFormData({ ...formData, deskripsiSingkat: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
            >
              Simpan Data PTK
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Import Excel (.xlsx) */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data PTK dari File Excel (.xlsx)"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Petunjuk Format Kolom Excel (.xlsx):
            </p>
            <p className="text-slate-600 leading-relaxed">
              Gunakan file Excel (.xlsx) dengan kolom header: <code>Nama, NIP, NUPTK, Jenis PTK, Jabatan, Mata Pelajaran, Pendidikan, Status Kepegawaian, Email, Telepon, Tahun Mulai</code>.
            </p>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Excel (.xlsx) Contoh</span>
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 mx-auto"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{importing ? 'Memproses Validasi & Import...' : 'Pilih File Excel (.xlsx) PTK'}</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">Mendukung format file .xlsx dan .xls</p>
          </div>

          {/* Validation Errors Box */}
          {importErrors.length > 0 && (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-2 max-h-48 overflow-y-auto">
              <p className="font-bold flex items-center gap-1.5 text-rose-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Ditemukan {importErrors.length} Kesalahan Validasi:
              </p>
              <ul className="space-y-1 divide-y divide-rose-100">
                {importErrors.map((err, i) => (
                  <li key={i} className="pt-1">
                    <strong>Baris {err.row}, Kolom {err.col}:</strong> {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data PTK"
        message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.nama}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
