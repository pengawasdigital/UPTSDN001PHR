import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Advantage } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminKeunggulanPage: React.FC = () => {
  const [items, setItems] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Advantage | null>(null);
  const [editingItem, setEditingItem] = useState<Advantage | null>(null);

  const [formData, setFormData] = useState<Omit<Advantage, 'id'>>({
    judul: '',
    icon: 'Sparkles',
    deskripsi: '',
    foto: '',
    urutan: 1,
    statusAktif: true
  });

  const toast = useToast();

  const loadData = () => {
    api.getAdvantages()
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
      judul: '',
      icon: 'Sparkles',
      deskripsi: '',
      foto: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      urutan: items.length + 1,
      statusAktif: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Advantage) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      icon: item.icon,
      deskripsi: item.deskripsi,
      foto: item.foto || '',
      urutan: item.urutan,
      statusAktif: item.statusAktif
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateAdvantage(editingItem.id, formData);
        toast.success('Keunggulan berhasil diperbarui');
      } else {
        await api.createAdvantage(formData);
        toast.success('Keunggulan baru berhasil ditambahkan');
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
      await api.deleteAdvantage(deleteTarget.id);
      toast.success('Keunggulan berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Advantage>[] = [
    {
      header: 'Judul Keunggulan',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.judul}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.deskripsi}</p>
        </div>
      )
    },
    {
      header: 'Urutan',
      accessor: 'urutan',
      className: 'w-16 text-center'
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

  if (loading) return <Loading fullPage message="Memuat data keunggulan sekolah..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Keunggulan Sekolah</h2>
          <p className="text-xs text-slate-500">Kelola poin keunggulan dan daya tarik pendidikan sekolah</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Keunggulan</span>
        </button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Cari judul keunggulan..."
        searchFilter={(item, q) =>
          item.judul.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Keunggulan' : 'Tambah Keunggulan'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Judul Keunggulan"
            value={formData.judul}
            onChange={e => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Pembelajaran Berkualitas Berbasis Digital"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Urutan"
              type="number"
              value={formData.urutan}
              onChange={e => setFormData({ ...formData, urutan: parseInt(e.target.value, 10) || 1 })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status Aktif
              </label>
              <select
                value={formData.statusAktif ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, statusAktif: e.target.value === 'true' })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="true">Aktif Ditampilkan</option>
                <option value="false">Disembunyikan</option>
              </select>
            </div>
          </div>

          <ImageUploader
            label="Foto Pendukung (Opsional)"
            value={formData.foto || ''}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormTextarea
            label="Uraian Keunggulan"
            rows={4}
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
        title="Hapus Keunggulan"
        message={`Apakah Anda yakin ingin menghapus keunggulan "${deleteTarget?.judul}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
