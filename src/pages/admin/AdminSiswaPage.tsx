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
  GraduationCap,
  Eye
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Student } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminSiswaPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [editingItem, setEditingItem] = useState<Student | null>(null);

  const [importErrors, setImportErrors] = useState<{ row: number; col: string; message: string }[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    nis: '',
    nisn: '',
    nama: '',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Pantai Raja',
    tanggalLahir: '2015-01-01',
    kelas: 'Kelas 1',
    rombel: '1A',
    tahunMasuk: '2024',
    status: 'Aktif',
    namaOrangTua: '',
    teleponOrangTua: '',
    alamat: ''
  });

  const toast = useToast();

  const loadData = () => {
    api.getStudents()
      .then(setStudents)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      nis: '',
      nisn: '',
      nama: '',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Pantai Raja',
      tanggalLahir: '2015-05-10',
      kelas: 'Kelas 1',
      rombel: '1A',
      tahunMasuk: '2024',
      status: 'Aktif',
      namaOrangTua: '',
      teleponOrangTua: '',
      alamat: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Student) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      nisn: item.nisn,
      nama: item.nama,
      jenisKelamin: item.jenisKelamin,
      tempatLahir: item.tempatLahir,
      tanggalLahir: item.tanggalLahir,
      kelas: item.kelas,
      rombel: item.rombel,
      tahunMasuk: item.tahunMasuk,
      status: item.status,
      namaOrangTua: item.namaOrangTua || '',
      teleponOrangTua: item.teleponOrangTua || '',
      alamat: item.alamat || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateStudent(editingItem.id, formData);
        toast.success('Data peserta didik berhasil diperbarui');
      } else {
        await api.createStudent(formData);
        toast.success('Peserta didik baru berhasil ditambahkan');
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
      await api.deleteStudent(deleteTarget.id);
      toast.success('Data siswa berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  // Helper to format date strings or numbers from Excel
  const formatExcelDate = (val: any): string => {
    if (!val) return '';
    if (val instanceof Date && !isNaN(val.getTime())) {
      return val.toISOString().split('T')[0];
    }
    if (typeof val === 'number') {
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    return String(val).trim();
  };

  // Export XLSX
  const handleExportXLSX = () => {
    try {
      if (students.length === 0) {
        toast.error('Tidak ada data siswa untuk diexport.');
        return;
      }

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
      // Auto column widths
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

      const today = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `data-siswa-sekolah-${today}.xlsx`);
      toast.success(`Berhasil mengexport ${students.length} data siswa ke file Excel (.xlsx)`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengexport file Excel');
    }
  };

  // Download Sample Import Template (.xlsx)
  const handleDownloadTemplate = () => {
    try {
      const sampleData = [
        {
          'NIS': '2024099',
          'NISN': '0161234567',
          'Nama Siswa': 'Ahmad Danial',
          'Jenis Kelamin': 'Laki-laki',
          'Kelas': 'Kelas 1',
          'Rombel': '1A',
          'Tempat Lahir': 'Pantai Raja',
          'Tanggal Lahir': '2017-04-10',
          'Tahun Masuk': '2024',
          'Status': 'Aktif',
          'Nama Orang Tua': 'Hasan Basri',
          'Telepon': '081234567890',
          'Alamat': 'Jl. Raya Pantai Raja No. 12'
        },
        {
          'NIS': '2024100',
          'NISN': '0161234568',
          'Nama Siswa': 'Fatimah Azzahra',
          'Jenis Kelamin': 'Perempuan',
          'Kelas': 'Kelas 1',
          'Rombel': '1A',
          'Tempat Lahir': 'Pekanbaru',
          'Tanggal Lahir': '2017-08-22',
          'Tahun Masuk': '2024',
          'Status': 'Aktif',
          'Nama Orang Tua': 'Zulkarnain',
          'Telepon': '081298765432',
          'Alamat': 'Dusun II Pantai Raja'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      worksheet['!cols'] = [
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
        { wch: 20 },
        { wch: 16 },
        { wch: 25 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
      XLSX.writeFile(workbook, 'template-import-siswa.xlsx');
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

        // Helper to normalize column keys (lowercase without spaces/symbols)
        const cleanKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

        const items = rawRows.map(row => {
          // Map dynamic headers
          const entries = Object.entries(row);
          const findVal = (...aliases: string[]) => {
            for (const [k, v] of entries) {
              const ck = cleanKey(k);
              if (aliases.includes(ck)) return v;
            }
            return '';
          };

          const nis = String(findVal('nis')).trim();
          const nisn = String(findVal('nisn')).trim();
          const nama = String(findVal('namasiswa', 'nama', 'namalengkap', 'namapesertadidik')).trim();
          let jenisKelamin = String(findVal('jeniskelamin', 'jk', 'gender')).trim();
          if (jenisKelamin.toLowerCase().startsWith('p') && !jenisKelamin.toLowerCase().startsWith('pri')) {
            jenisKelamin = 'Perempuan';
          } else {
            jenisKelamin = 'Laki-laki';
          }

          const kelas = String(findVal('kelas', 'tingkat')).trim();
          const rombel = String(findVal('rombel', 'rombonganbelajar', 'kelasrombel')).trim();
          const tempatLahir = String(findVal('tempatlahir', 'tempat')).trim();
          const tanggalLahir = formatExcelDate(findVal('tanggallahir', 'tgllahir', 'tgl'));
          const tahunMasuk = String(findVal('tahunmasuk', 'tahun')).trim();
          const status = String(findVal('status', 'statussiswa')).trim() || 'Aktif';
          const namaOrangTua = String(findVal('namaorangtua', 'orangtua', 'wali', 'namaortu', 'ayah')).trim();
          const teleponOrangTua = String(findVal('telepon', 'teleponorangtua', 'nohp', 'hp', 'wa')).trim();
          const alamat = String(findVal('alamat', 'tempattinggal', 'domisili')).trim();

          return {
            nis,
            nisn: nisn || '-',
            nama,
            jenisKelamin,
            kelas,
            rombel: rombel || (kelas ? `${kelas}A` : 'Kelas 1A'),
            tempatLahir: tempatLahir || 'Kampar',
            tanggalLahir: tanggalLahir || '2016-01-01',
            tahunMasuk: tahunMasuk || '2024',
            status,
            namaOrangTua: namaOrangTua || '-',
            teleponOrangTua: teleponOrangTua || '-',
            alamat: alamat || '-'
          };
        });

        const res = await api.importStudents(items);
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

  const columns: Column<Student>[] = [
    {
      header: 'NIS / NISN',
      render: item => (
        <div className="font-mono text-xs">
          <p className="font-bold text-slate-800">{item.nis}</p>
          <p className="text-[10px] text-slate-400">{item.nisn || '-'}</p>
        </div>
      ),
      className: 'w-28'
    },
    {
      header: 'Nama Siswa',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400">
            {item.jenisKelamin === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'} • Masuk: {item.tahunMasuk}
          </p>
        </div>
      )
    },
    {
      header: 'Kelas & Rombel',
      render: item => (
        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
          {item.kelas} ({item.rombel})
        </span>
      ),
      className: 'w-32'
    },
    {
      header: 'Orang Tua / Kontak',
      render: item => (
        <div className="text-xs text-slate-600">
          <p className="font-medium">{item.namaOrangTua || '-'}</p>
          <p className="text-slate-400 text-[11px]">{item.teleponOrangTua || '-'}</p>
        </div>
      )
    },
    {
      header: 'Status',
      render: item => (
        <Badge variant={item.status === 'Aktif' ? 'emerald' : 'slate'}>
          {item.status}
        </Badge>
      ),
      className: 'w-24 text-center'
    },
    {
      header: 'Aksi',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setDetailStudent(item);
              setIsDetailModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="Lihat Detail Lengkap"
          >
            <Eye className="w-4 h-4" />
          </button>
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
      className: 'w-28 text-right'
    }
  ];

  if (loading) return <Loading fullPage message="Memuat database siswa..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Database Peserta Didik (Siswa)</h2>
          <p className="text-xs text-slate-500">Kelola buku induk siswa, data orang tua, rombel, dan import/export data</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXLSX}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Export data siswa ke format Microsoft Excel (.xlsx)"
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
            title="Import data siswa dari file Microsoft Excel (.xlsx)"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Import Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchPlaceholder="Cari nama siswa, NIS, atau orang tua..."
        searchFilter={(item, q) =>
          Boolean(
            item.nama.toLowerCase().includes(q) ||
            item.nis.includes(q) ||
            item.kelas.toLowerCase().includes(q) ||
            item.rombel.toLowerCase().includes(q) ||
            (item.namaOrangTua && item.namaOrangTua.toLowerCase().includes(q))
          )
        }
      />

      {/* Modal Form Tambah/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nomor Induk Siswa (NIS)"
              value={formData.nis}
              onChange={e => setFormData({ ...formData, nis: e.target.value })}
              placeholder="Contoh: 2024001"
              required
            />
            <FormInput
              label="NISN (Nasional)"
              value={formData.nisn}
              onChange={e => setFormData({ ...formData, nisn: e.target.value })}
              placeholder="10 digit angka"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Lengkap Siswa"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              required
            />
            <FormSelect
              label="Jenis Kelamin"
              value={formData.jenisKelamin}
              onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
              options={[
                { label: 'Laki-laki', value: 'Laki-laki' },
                { label: 'Perempuan', value: 'Perempuan' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Tempat Lahir"
              value={formData.tempatLahir}
              onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
              required
            />
            <FormInput
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormSelect
              label="Tingkat Kelas"
              value={formData.kelas}
              onChange={e => setFormData({ ...formData, kelas: e.target.value })}
              options={[
                { label: 'Kelas 1', value: 'Kelas 1' },
                { label: 'Kelas 2', value: 'Kelas 2' },
                { label: 'Kelas 3', value: 'Kelas 3' },
                { label: 'Kelas 4', value: 'Kelas 4' },
                { label: 'Kelas 5', value: 'Kelas 5' },
                { label: 'Kelas 6', value: 'Kelas 6' }
              ]}
            />
            <FormInput
              label="Rombel"
              value={formData.rombel}
              onChange={e => setFormData({ ...formData, rombel: e.target.value })}
              placeholder="Contoh: 1A"
              required
            />
            <FormInput
              label="Tahun Masuk"
              value={formData.tahunMasuk}
              onChange={e => setFormData({ ...formData, tahunMasuk: e.target.value })}
              required
            />
            <FormSelect
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Lulus', value: 'Lulus' },
                { label: 'Pindah', value: 'Pindah' },
                { label: 'Keluar', value: 'Keluar' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Orang Tua / Wali"
              value={formData.namaOrangTua || ''}
              onChange={e => setFormData({ ...formData, namaOrangTua: e.target.value })}
            />
            <FormInput
              label="Nomor Telepon Orang Tua"
              value={formData.teleponOrangTua || ''}
              onChange={e => setFormData({ ...formData, teleponOrangTua: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Alamat Tempat Tinggal"
            rows={2}
            value={formData.alamat || ''}
            onChange={e => setFormData({ ...formData, alamat: e.target.value })}
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
              Simpan Data Siswa
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail Lengkap Siswa */}
      {detailStudent && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Detail Lengkap Peserta Didik"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{detailStudent.nama}</h3>
                <p className="text-xs text-emerald-800 font-mono mt-0.5">
                  NIS: {detailStudent.nis} • NISN: {detailStudent.nisn || '-'}
                </p>
              </div>
              <Badge variant={detailStudent.status === 'Aktif' ? 'emerald' : 'slate'}>
                {detailStudent.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 bg-slate-50 p-4 rounded-2xl">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">{detailStudent.jenisKelamin}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tempat, Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">{detailStudent.tempatLahir}, {detailStudent.tanggalLahir}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tingkat Kelas & Rombel</span>
                <span className="font-semibold text-emerald-700">{detailStudent.kelas} - Rombel {detailStudent.rombel}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tahun Masuk</span>
                <span className="font-semibold text-slate-800">{detailStudent.tahunMasuk}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Nama Orang Tua / Wali</span>
                <span className="font-semibold text-slate-800">{detailStudent.namaOrangTua || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kontak Telepon Orang Tua</span>
                <span className="font-semibold text-slate-800">{detailStudent.teleponOrangTua || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Alamat Tempat Tinggal</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px]">{detailStudent.alamat || '-'}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Import Excel (.xlsx) */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data Siswa dari File Excel (.xlsx)"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Petunjuk Format Kolom Excel (.xlsx):
            </p>
            <p className="text-slate-600 leading-relaxed">
              Pastikan file Excel Anda memiliki kolom header berikut: <code>NIS, NISN, Nama Siswa, Jenis Kelamin, Kelas, Rombel, Tempat Lahir, Tanggal Lahir, Tahun Masuk, Status, Nama Orang Tua, Telepon, Alamat</code>.
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
              <span>{importing ? 'Memvalidasi & Mengimpor...' : 'Pilih File Excel (.xlsx) Siswa'}</span>
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
        title="Hapus Data Peserta Didik"
        message={`Apakah Anda yakin ingin menghapus data siswa "${deleteTarget?.nama}" (NIS: ${deleteTarget?.nis})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Siswa"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
