import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Network } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { OrganizationMember } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { FormInput, FormSelect, FormTextarea, Badge } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminStrukturPage: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrganizationMember | null>(null);
  const [editingItem, setEditingItem] = useState<OrganizationMember | null>(null);

  const [formData, setFormData] = useState<Omit<OrganizationMember, 'id'>>({
    nama: '',
    jabatan: '',
    nip: '',
    nuptk: '',
    foto: '',
    urutan: 1,
    kategori: 'Pimpinan',
    deskripsiTugas: ''
  });

  const toast = useToast();

  const loadData = () => {
    api.getOrganization()
      .then(setMembers)
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
      jabatan: '',
      nip: '',
      nuptk: '',
      foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      urutan: members.length + 1,
      kategori: 'Pimpinan',
      deskripsiTugas: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: OrganizationMember) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      nip: item.nip || '',
      nuptk: item.nuptk || '',
      foto: item.foto || '',
      urutan: item.urutan,
      kategori: item.kategori,
      deskripsiTugas: item.deskripsiTugas
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateOrganization(editingItem.id, formData);
        toast.success('Anggota struktur berhasil diperbarui');
      } else {
        await api.createOrganization(formData);
        toast.success('Anggota struktur baru berhasil ditambahkan');
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
      await api.deleteOrganization(deleteTarget.id);
      toast.success('Anggota struktur berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const columns: Column<OrganizationMember>[] = [
    {
      header: 'Foto',
      render: item => (
        <img
          src={item.foto}
          alt={item.nama}
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
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
      header: 'Jabatan',
      accessor: 'jabatan'
    },
    {
      header: 'Kategori',
      render: item => (
        <Badge
          variant={
            item.kategori === 'Pimpinan'
              ? 'emerald'
              : item.kategori === 'Komite'
              ? 'amber'
              : 'slate'
          }
        >
          {item.kategori}
        </Badge>
      )
    },
    {
      header: 'Urutan',
      accessor: 'urutan',
      className: 'w-16 text-center'
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

  if (loading) return <Loading fullPage message="Memuat data struktur organisasi..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Struktur Organisasi</h2>
          <p className="text-xs text-slate-500">Kelola jajaran kepemimpinan, komite, dan staf sekolah</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      <DataTable
        data={members}
        columns={columns}
        searchPlaceholder="Cari nama atau jabatan..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) || item.jabatan.toLowerCase().includes(q)
        }
      />

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Anggota Struktur' : 'Tambah Anggota Struktur'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Lengkap & Gelar"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              required
            />
            <FormInput
              label="Jabatan dalam Organisasi"
              value={formData.jabatan}
              onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Kategori Posisi"
              value={formData.kategori}
              onChange={e => setFormData({ ...formData, kategori: e.target.value as any })}
              options={[
                { label: 'Pimpinan', value: 'Pimpinan' },
                { label: 'Komite', value: 'Komite' },
                { label: 'Guru', value: 'Guru' },
                { label: 'Administrasi', value: 'Administrasi' }
              ]}
            />
            <FormInput
              label="NIP (Jika Ada)"
              value={formData.nip || ''}
              onChange={e => setFormData({ ...formData, nip: e.target.value })}
            />
            <FormInput
              label="Nomor Urut Tampil"
              type="number"
              value={formData.urutan}
              onChange={e => setFormData({ ...formData, urutan: parseInt(e.target.value, 10) || 1 })}
              required
            />
          </div>

          <ImageUploader
            label="Foto Anggota"
            value={formData.foto || ''}
            onChange={url => setFormData({ ...formData, foto: url })}
          />

          <FormTextarea
            label="Deskripsi Tugas & Fungsi"
            rows={3}
            value={formData.deskripsiTugas}
            onChange={e => setFormData({ ...formData, deskripsiTugas: e.target.value })}
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

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Anggota Struktur"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.nama}" dari struktur organisasi sekolah?`}
        confirmText="Hapus Sekarang"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
