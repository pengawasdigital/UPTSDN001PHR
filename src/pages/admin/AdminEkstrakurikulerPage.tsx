import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Activity } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Extracurricular } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminEkstrakurikulerPage: React.FC = () => {
  const [items, setItems] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Extracurricular | null>(null);
  const [editingItem, setEditingItem] = useState<Extracurricular | null>(null);

  const [formData, setFormData] = useState<Omit<Extracurricular, 'id'>>({
    nama: '',
    pembina: '',
    deskripsi: '',
    jadwal: '',
    tempat: '',
    foto: '',
    prestasi: '',
    statusAktif: true
  });

  const toast = useToast();

  const loadData = () => {
    api.getExtracurriculars()
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
      pembina: '',
      deskripsi: '',
      jadwal: 'Setiap Sabtu, 14.30 - 16.30 WIB',
      tempat: 'Lapangan Sekolah',
      foto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      prestasi: '',
      statusAktif: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Extracurricular) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      pembina: item.pembina,
      deskripsi: item.deskripsi,
      jadwal: item.jadwal,
      tempat: item.tempat,
      foto: item.foto,
      prestasi: item.prestasi,
      statusAktif: item.statusAktif
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateExtracurricular(editingItem.id, formData);
        toast.success('Ekstrakurikuler berhasil diperbarui');
      } else {
        await api.createExtracurricular(formData);
        toast.success('Ekstrakurikuler baru berhasil ditambahkan');
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
      await api.deleteExtracurricular(deleteTarget.id);
      toast.success('Ekstrakurikuler berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Extracurricular>[] = [
    {
      header: 'Foto',
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
      header: 'Nama Ekstrakurikuler',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400">Pembina: {item.pembina}</p>
        </div>
      )
    },
    {
      header: 'Jadwal & Tempat',
      render: item => (
        <div className="text-xs text-slate-600">
          <p className="font-medium">{item.jadwal}</p>
          <p className="text-slate-400">{item.tempat}</p>
        </div>
      )
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

  if (loading) return <Loading fullPage message="Memuat ekstrakurikuler..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Ekstrakurikuler</h2>
          <p className="text-xs text-slate-500">Kelola kelompok pembinaan bakat, jadwal, pembina, dan prestasi</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ekstrakurikuler</span>
        </button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Cari nama atau pembina..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) || item.pembina.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Ekstrakurikuler"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Pramuka Siaga"
              required
            />
            <FormInput
              label="Guru Pembina / Pelatih"
              value={formData.pembina}
              onChange={e => setFormData({ ...formData, pembina: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Jadwal Latihan"
              value={formData.jadwal}
              onChange={e => setFormData({ ...formData, jadwal: e.target.value })}
              placeholder="Contoh: Setiap Sabtu, 14.30 - 16.30 WIB"
              required
            />
            <FormInput
              label="Lokasi / Tempat"
              value={formData.tempat}
              onChange={e => setFormData({ ...formData, tempat: e.target.value })}
              placeholder="Contoh: Lapangan Utama / Aula"
              required
            />
          </div>

          <ImageUploader
            label="Foto Kegiatan"
            value={formData.foto}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormInput
            label="Catatan Prestasi Terbaru (Opsional)"
            value={formData.prestasi}
            onChange={e => setFormData({ ...formData, prestasi: e.target.value })}
            placeholder="Contoh: Juara 1 Pionering Kwarran Perhentian Raja 2025"
          />

          <FormTextarea
            label="Deskripsi Program Kegiatan"
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
        title="Hapus Ekstrakurikuler"
        message={`Apakah Anda yakin ingin menghapus ekstrakurikuler "${deleteTarget?.nama}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
