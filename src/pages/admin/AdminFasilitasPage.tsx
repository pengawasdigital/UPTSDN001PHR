import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Warehouse } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Facility } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminFasilitasPage: React.FC = () => {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);
  const [editingItem, setEditingItem] = useState<Facility | null>(null);

  const [formData, setFormData] = useState<Omit<Facility, 'id'>>({
    nama: '',
    kategori: 'Ruang Kelas',
    deskripsi: '',
    jumlah: 1,
    kondisi: 'Baik',
    foto: ''
  });

  const toast = useToast();

  const loadData = () => {
    api.getFacilities()
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
      kategori: 'Ruang Kelas',
      deskripsi: '',
      jumlah: 1,
      kondisi: 'Sangat Baik',
      foto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Facility) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
      foto: item.foto
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateFacility(editingItem.id, formData);
        toast.success('Fasilitas berhasil diperbarui');
      } else {
        await api.createFacility(formData);
        toast.success('Fasilitas baru berhasil ditambahkan');
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
      await api.deleteFacility(deleteTarget.id);
      toast.success('Fasilitas berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Facility>[] = [
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
      header: 'Nama Sarana / Fasilitas',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.deskripsi}</p>
        </div>
      )
    },
    {
      header: 'Kategori',
      render: item => <Badge variant="slate">{item.kategori}</Badge>,
      className: 'w-32'
    },
    {
      header: 'Jumlah',
      render: item => (
        <span className="text-xs font-semibold text-slate-700">
          {item.jumlah} Unit
        </span>
      ),
      className: 'w-20 text-center'
    },
    {
      header: 'Kondisi',
      render: item => (
        <Badge
          variant={
            item.kondisi === 'Sangat Baik' || item.kondisi === 'Baik'
              ? 'emerald'
              : 'amber'
          }
        >
          {item.kondisi}
        </Badge>
      ),
      className: 'w-28 text-center'
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

  if (loading) return <Loading fullPage message="Memuat sarana fasilitas..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Fasilitas & Sarpras</h2>
          <p className="text-xs text-slate-500">Kelola inventaris ruang belajar, laboratorium, dan sarana penunjang</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas</span>
        </button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Cari nama fasilitas..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) || item.kategori.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nama Fasilitas"
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
            placeholder="Contoh: Perpustakaan Digital Graha Ilmu"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Kategori"
              value={formData.kategori}
              onChange={e => setFormData({ ...formData, kategori: e.target.value })}
              options={[
                { label: 'Ruang Kelas', value: 'Ruang Kelas' },
                { label: 'Perpustakaan', value: 'Perpustakaan' },
                { label: 'Laboratorium', value: 'Laboratorium' },
                { label: 'Sarana Digital', value: 'Sarana Digital' },
                { label: 'UKS', value: 'UKS' },
                { label: 'Lapangan', value: 'Lapangan' },
                { label: 'Ruang Guru', value: 'Ruang Guru' },
                { label: 'Kantin', value: 'Kantin' },
                { label: 'Toilet', value: 'Toilet' },
                { label: 'Lainnya', value: 'Lainnya' }
              ]}
            />
            <FormInput
              label="Jumlah Unit"
              type="number"
              value={formData.jumlah}
              onChange={e => setFormData({ ...formData, jumlah: parseInt(e.target.value, 10) || 1 })}
              required
            />
            <FormSelect
              label="Kondisi Fisik"
              value={formData.kondisi}
              onChange={e => setFormData({ ...formData, kondisi: e.target.value as any })}
              options={[
                { label: 'Sangat Baik', value: 'Sangat Baik' },
                { label: 'Baik', value: 'Baik' },
                { label: 'Cukup', value: 'Cukup' },
                { label: 'Perbaikan', value: 'Perbaikan' }
              ]}
            />
          </div>

          <ImageUploader
            label="Foto Fasilitas"
            value={formData.foto}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormTextarea
            label="Deskripsi & Spesifikasi"
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
        title="Hapus Fasilitas"
        message={`Apakah Anda yakin ingin menghapus fasilitas "${deleteTarget?.nama}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
