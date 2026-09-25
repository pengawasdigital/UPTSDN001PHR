import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Achievement } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminPrestasiPage: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>({
    nama: '',
    namaSiswa: '',
    tingkat: 'Kabupaten/Kota',
    cabang: '',
    juara: '',
    tahun: '2026',
    tanggal: new Date().toISOString().split('T')[0],
    pembina: '',
    deskripsi: '',
    foto: ''
  });

  const toast = useToast();

  const loadData = () => {
    api.getAchievements()
      .then(setItems)
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
      namaSiswa: '',
      tingkat: 'Kabupaten/Kota',
      cabang: '',
      juara: 'Juara 1',
      tahun: new Date().getFullYear().toString(),
      tanggal: new Date().toISOString().split('T')[0],
      pembina: '',
      deskripsi: '',
      foto: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      namaSiswa: item.namaSiswa,
      tingkat: item.tingkat,
      cabang: item.cabang,
      juara: item.juara,
      tahun: item.tahun,
      tanggal: item.tanggal,
      pembina: item.pembina,
      deskripsi: item.deskripsi,
      foto: item.foto
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateAchievement(editingItem.id, formData);
        toast.success('Prestasi berhasil diperbarui');
      } else {
        await api.createAchievement(formData);
        toast.success('Prestasi baru berhasil ditambahkan');
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
      await api.deleteAchievement(deleteTarget.id);
      toast.success('Prestasi berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Achievement>[] = [
    {
      header: 'Dokumentasi',
      render: item => (
        <img
          src={item.foto}
          alt={item.nama}
          className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-200"
        />
      ),
      className: 'w-16'
    },
    {
      header: 'Prestasi & Kejuaraan',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-amber-600 font-semibold">{item.juara} • {item.cabang}</p>
        </div>
      )
    },
    {
      header: 'Pemenang / Siswa',
      accessor: 'namaSiswa'
    },
    {
      header: 'Tingkat',
      render: item => <Badge variant="slate">{item.tingkat}</Badge>,
      className: 'w-28 text-center'
    },
    {
      header: 'Tahun',
      accessor: 'tahun',
      className: 'w-20 text-center'
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

  if (loading) return <Loading fullPage message="Memuat data prestasi..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Prestasi Siswa & Sekolah</h2>
          <p className="text-xs text-slate-500">Kelola rekam jejak juara olimpiade, seni, olahraga, dan penghargaan</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi</span>
        </button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Cari prestasi atau nama siswa..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) ||
          item.namaSiswa.toLowerCase().includes(q) ||
          item.cabang.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nama Prestasi / Event"
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
            placeholder="Contoh: Juara 1 Olimpiade Sains Nasional (OSN) IPA"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Siswa / Tim Pemenang"
              value={formData.namaSiswa}
              onChange={e => setFormData({ ...formData, namaSiswa: e.target.value })}
              required
            />
            <FormInput
              label="Cabang Lomba / Bidang"
              value={formData.cabang}
              onChange={e => setFormData({ ...formData, cabang: e.target.value })}
              placeholder="Contoh: Sains, Seni Tari, Futsal"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Predikat Juara"
              value={formData.juara}
              onChange={e => setFormData({ ...formData, juara: e.target.value })}
              placeholder="Contoh: Juara 1 (Medali Emas)"
              required
            />
            <FormSelect
              label="Tingkat Lomba"
              value={formData.tingkat}
              onChange={e => setFormData({ ...formData, tingkat: e.target.value as any })}
              options={[
                { label: 'Sekolah', value: 'Sekolah' },
                { label: 'Kecamatan', value: 'Kecamatan' },
                { label: 'Kabupaten/Kota', value: 'Kabupaten/Kota' },
                { label: 'Provinsi', value: 'Provinsi' },
                { label: 'Nasional', value: 'Nasional' },
                { label: 'Internasional', value: 'Internasional' }
              ]}
            />
            <FormInput
              label="Tahun"
              value={formData.tahun}
              onChange={e => setFormData({ ...formData, tahun: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Guru Pembina / Pelatih"
              value={formData.pembina}
              onChange={e => setFormData({ ...formData, pembina: e.target.value })}
            />
            <FormInput
              label="Tanggal Capaian"
              type="date"
              value={formData.tanggal}
              onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>

          <ImageUploader
            label="Foto Dokumentasi / Piagam"
            value={formData.foto}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormTextarea
            label="Deskripsi Singkat Prestasi"
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
              Simpan Prestasi
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Prestasi"
        message={`Apakah Anda yakin ingin menghapus data prestasi "${deleteTarget?.nama}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
