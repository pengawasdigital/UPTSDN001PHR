import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Calendar, User, Newspaper } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { News } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminBeritaPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);
  const [editingItem, setEditingItem] = useState<News | null>(null);

  const [formData, setFormData] = useState<Omit<News, 'id' | 'views' | 'createdAt'>>({
    judul: '',
    slug: '',
    isi: '',
    ringkasan: '',
    thumbnail: '',
    penulis: 'Admin Sekolah',
    kategori: 'Kegiatan Sekolah',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'published',
    featured: false
  });

  const toast = useToast();

  const loadData = () => {
    api.getNews()
      .then(setNews)
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
      slug: '',
      isi: '',
      ringkasan: '',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      penulis: 'Admin Sekolah',
      kategori: 'Kegiatan Sekolah',
      tanggal: new Date().toISOString().split('T')[0],
      status: 'published',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: News) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      slug: item.slug,
      isi: item.isi,
      ringkasan: item.ringkasan,
      thumbnail: item.thumbnail,
      penulis: item.penulis,
      kategori: item.kategori,
      tanggal: item.tanggal,
      status: item.status,
      featured: item.featured
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({
      ...formData,
      judul: val,
      slug: editingItem ? formData.slug : generatedSlug
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateNews(editingItem.id, formData);
        toast.success('Berita berhasil diperbarui');
      } else {
        await api.createNews(formData);
        toast.success('Berita berhasil dipublikasikan');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan berita');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteNews(deleteTarget.id);
      toast.success('Berita berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus berita');
    }
  };

  const columns: Column<News>[] = [
    {
      header: 'Thumbnail',
      render: item => (
        <img
          src={item.thumbnail}
          alt={item.judul}
          className="w-14 h-10 rounded-lg object-cover ring-1 ring-slate-200"
        />
      ),
      className: 'w-20'
    },
    {
      header: 'Judul Berita',
      render: item => (
        <div>
          <p className="font-bold text-slate-900 line-clamp-1">{item.judul}</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {item.penulis}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Kategori',
      render: item => <Badge variant="slate">{item.kategori}</Badge>,
      className: 'w-32'
    },
    {
      header: 'Status',
      render: item => (
        <Badge variant={item.status === 'published' ? 'emerald' : 'amber'}>
          {item.status === 'published' ? 'Tayang' : 'Draft'}
        </Badge>
      ),
      className: 'w-24 text-center'
    },
    {
      header: 'Pembaca',
      render: item => (
        <span className="text-xs text-slate-500 font-medium">
          {item.views} views
        </span>
      ),
      className: 'w-20 text-center'
    },
    {
      header: 'Aksi',
      render: item => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Berita"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Berita"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-right'
    }
  ];

  if (loading) return <Loading fullPage message="Memuat artikel berita..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Berita & Pengumuman</h2>
          <p className="text-xs text-slate-500">Buat, sunting, terbitkan, dan kelola artikel informasi sekolah</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </button>
      </div>

      <DataTable
        data={news}
        columns={columns}
        searchPlaceholder="Cari judul berita..."
        searchFilter={(item, q) =>
          item.judul.toLowerCase().includes(q) || item.isi.toLowerCase().includes(q)
        }
      />

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Berita' : 'Tulis Berita Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <FormInput
            label="Judul Berita"
            value={formData.judul}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Tuliskan judul berita..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="URL Slug (SEO Friendly)"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <FormSelect
              label="Kategori Berita"
              value={formData.kategori}
              onChange={e => setFormData({ ...formData, kategori: e.target.value })}
              options={[
                { label: 'Kegiatan Sekolah', value: 'Kegiatan Sekolah' },
                { label: 'Pengumuman', value: 'Pengumuman' },
                { label: 'Akademik', value: 'Akademik' },
                { label: 'Prestasi', value: 'Prestasi' },
                { label: 'Informasi', value: 'Informasi' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Penulis / Kontributor"
              value={formData.penulis}
              onChange={e => setFormData({ ...formData, penulis: e.target.value })}
              required
            />
            <FormInput
              label="Tanggal Publikasi"
              type="date"
              value={formData.tanggal}
              onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
            <FormSelect
              label="Status Tayang"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { label: 'Published (Tayang)', value: 'published' },
                { label: 'Draft (Disimpan)', value: 'draft' }
              ]}
            />
          </div>

          <ImageUploader
            label="Foto Sampul (Thumbnail / Featured Image)"
            value={formData.thumbnail}
            onChange={url => setFormData({ ...formData, thumbnail: url })}
          />

          <FormTextarea
            label="Ringkasan Singkat (Lead Paragraph)"
            rows={2}
            value={formData.ringkasan}
            onChange={e => setFormData({ ...formData, ringkasan: e.target.value })}
            placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
            required
          />

          <FormTextarea
            label="Isi Konten Berita (Mendukung format paragraf HTML <p>, <ul>, <li>)"
            rows={8}
            value={formData.isi}
            onChange={e => setFormData({ ...formData, isi: e.target.value })}
            placeholder="Tuliskan isi berita lengkap di sini..."
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              Simpan & Publikasikan
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus artikel "${deleteTarget?.judul}"?`}
        confirmText="Hapus Berita"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
