import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Gallery } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminGaleriPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Gallery | null>(null);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);

  const [formData, setFormData] = useState<Omit<Gallery, 'id'>>({
    judul: '',
    kategori: 'Kegiatan Sekolah',
    tipe: 'foto',
    mediaUrl: '',
    deskripsi: '',
    tanggal: new Date().toISOString().split('T')[0],
    isPublished: true
  });

  const toast = useToast();

  const loadData = () => {
    api.getGalleries()
      .then(setGalleries)
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
      kategori: 'Kegiatan Sekolah',
      tipe: 'foto',
      mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      deskripsi: '',
      tanggal: new Date().toISOString().split('T')[0],
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Gallery) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      tipe: item.tipe,
      mediaUrl: item.mediaUrl,
      deskripsi: item.deskripsi,
      tanggal: item.tanggal,
      isPublished: item.isPublished
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateGallery(editingItem.id, formData);
        toast.success('Media galeri berhasil diperbarui');
      } else {
        await api.createGallery(formData);
        toast.success('Media galeri baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan media');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteGallery(deleteTarget.id);
      toast.success('Media galeri berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<Gallery>[] = [
    {
      header: 'Pratinjau',
      render: item => (
        <img
          src={item.mediaUrl}
          alt={item.judul}
          className="w-14 h-10 rounded-lg object-cover ring-1 ring-slate-200"
        />
      ),
      className: 'w-20'
    },
    {
      header: 'Judul Media',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.judul}</p>
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
      header: 'Tanggal',
      render: item => (
        <span className="text-xs text-slate-500">
          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
      className: 'w-28'
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

  if (loading) return <Loading fullPage message="Memuat media galeri..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Galeri Media</h2>
          <p className="text-xs text-slate-500">Unggah foto dan dokumentasi visual kegiatan sekolah</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto / Media</span>
        </button>
      </div>

      <DataTable
        data={galleries}
        columns={columns}
        searchPlaceholder="Cari judul galeri..."
        searchFilter={(item, q) =>
          item.judul.toLowerCase().includes(q) || item.kategori.toLowerCase().includes(q)
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Media Galeri' : 'Tambah Media Galeri'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Judul Foto / Dokumentasi"
            value={formData.judul}
            onChange={e => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Upacara Bendera HUT RI Ke-81"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Kategori"
              value={formData.kategori}
              onChange={e => setFormData({ ...formData, kategori: e.target.value })}
              options={[
                { label: 'Kegiatan Sekolah', value: 'Kegiatan Sekolah' },
                { label: 'Pembelajaran', value: 'Pembelajaran' },
                { label: 'Upacara', value: 'Upacara' },
                { label: 'Ekstrakurikuler', value: 'Ekstrakurikuler' },
                { label: 'Prestasi', value: 'Prestasi' },
                { label: 'Perayaan', value: 'Perayaan' },
                { label: 'Kegiatan Siswa', value: 'Kegiatan Siswa' },
                { label: 'Kegiatan Guru', value: 'Kegiatan Guru' }
              ]}
            />
            <FormInput
              label="Tanggal Dokumentasi"
              type="date"
              value={formData.tanggal}
              onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>

          <ImageUploader
            label="File Gambar / Foto"
            value={formData.mediaUrl}
            onChange={url => setFormData({ ...formData, mediaUrl: url })}
          />

          <FormTextarea
            label="Keterangan / Deskripsi Foto"
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
              Simpan Media
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Media Galeri"
        message={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.judul}"?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
