import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Subject } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminMataPelajaranPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [editingItem, setEditingItem] = useState<Subject | null>(null);

  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    nama: '',
    kode: '',
    jenjang: 'SD',
    kelas: 'Kelas 1 - 6',
    guruPengampu: '',
    jumlahJP: 4,
    deskripsi: '',
    statusAktif: true
  });

  const toast = useToast();

  const loadData = () => {
    api.getSubjects()
      .then(setSubjects)
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
      kode: '',
      jenjang: 'SD',
      kelas: 'Kelas 1 - 6',
      guruPengampu: '',
      jumlahJP: 4,
      deskripsi: '',
      statusAktif: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Subject) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      kode: item.kode,
      jenjang: item.jenjang,
      kelas: item.kelas,
      guruPengampu: item.guruPengampu,
      jumlahJP: item.jumlahJP,
      deskripsi: item.deskripsi,
      statusAktif: item.statusAktif
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateSubject(editingItem.id, formData);
        toast.success('Mata pelajaran berhasil diperbarui');
      } else {
        await api.createSubject(formData);
        toast.success('Mata pelajaran baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteSubject(deleteTarget.id);
      toast.success('Mata pelajaran berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Subject>[] = [
    {
      header: 'Kode',
      render: item => (
        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          {item.kode}
        </span>
      ),
      className: 'w-28'
    },
    {
      header: 'Nama Mata Pelajaran',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.deskripsi}</p>
        </div>
      )
    },
    {
      header: 'Tingkat & Jam',
      render: item => (
        <div className="text-xs text-slate-600">
          <p className="font-medium">{item.kelas}</p>
          <p className="text-slate-400">{item.jumlahJP} JP/Minggu</p>
        </div>
      ),
      className: 'w-36'
    },
    {
      header: 'Guru Pengampu',
      accessor: 'guruPengampu'
    },
    {
      header: 'Status',
      render: item => (
        <Badge variant={item.statusAktif ? 'emerald' : 'slate'}>
          {item.statusAktif ? 'Aktif' : 'Non-aktif'}
        </Badge>
      ),
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

  if (loading) return <Loading fullPage message="Memuat mata pelajaran..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Kurikulum & Mata Pelajaran</h2>
          <p className="text-xs text-slate-500">Kelola beban jam pelajaran (JP), kode mata pelajaran, dan guru pengampu</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      <DataTable
        data={subjects}
        columns={columns}
        searchPlaceholder="Cari nama atau kode mata pelajaran..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) ||
          item.kode.toLowerCase().includes(q) ||
          item.guruPengampu.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Mata Pelajaran"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Matematika Dasar"
              required
            />
            <FormInput
              label="Kode Mata Pelajaran"
              value={formData.kode}
              onChange={e => setFormData({ ...formData, kode: e.target.value })}
              placeholder="Contoh: MTK-SD"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Jenjang"
              value={formData.jenjang}
              onChange={e => setFormData({ ...formData, jenjang: e.target.value })}
              required
            />
            <FormInput
              label="Kelas Sasaran"
              value={formData.kelas}
              onChange={e => setFormData({ ...formData, kelas: e.target.value })}
              placeholder="Contoh: Kelas 1 - 6"
              required
            />
            <FormInput
              label="Jumlah JP / Minggu"
              type="number"
              value={formData.jumlahJP}
              onChange={e => setFormData({ ...formData, jumlahJP: parseInt(e.target.value, 10) || 1 })}
              required
            />
          </div>

          <FormInput
            label="Guru Pengampu"
            value={formData.guruPengampu}
            onChange={e => setFormData({ ...formData, guruPengampu: e.target.value })}
            placeholder="Nama guru yang mengajar..."
            required
          />

          <FormTextarea
            label="Deskripsi Capaian Pembelajaran"
            rows={3}
            value={formData.deskripsi}
            onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
            required
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
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Mata Pelajaran"
        message={`Apakah Anda yakin ingin menghapus mata pelajaran "${deleteTarget?.nama}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
