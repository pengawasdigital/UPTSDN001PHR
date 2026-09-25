import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle2, MessageSquare, Phone, Calendar, Clock } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { ContactMessage } from '../../types.ts';
import { DataTable, type Column } from '../../components/common/DataTable.tsx';
import { Modal, ConfirmDialog } from '../../components/common/Modal.tsx';
import { Badge } from '../../components/common/FormControls.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminPesanPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const toast = useToast();

  const loadData = () => {
    api.getContactMessages()
      .then(setMessages)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (msg.status === 'belum_dibaca') {
      try {
        await api.updateContactMessageStatus(msg.id, 'sudah_dibaca');
        loadData();
      } catch (e) {
        console.warn('Failed to update status', e);
      }
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      await api.updateContactMessageStatus(id, 'dibalas');
      toast.success('Pesan ditandai sudah dibalas');
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: 'dibalas' });
      }
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteContactMessage(deleteTarget.id);
      toast.success('Pesan berhasil dihapus');
      setDeleteTarget(null);
      if (activeMessage && activeMessage.id === deleteTarget.id) {
        setActiveMessage(null);
      }
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus pesan');
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: 'Pengirim',
      render: item => (
        <div>
          <p className="font-bold text-slate-900">{item.nama}</p>
          <p className="text-[11px] text-slate-400">{item.email}</p>
        </div>
      )
    },
    {
      header: 'Subjek & Cuplikan',
      render: item => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{item.subjek}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.pesan}</p>
        </div>
      )
    },
    {
      header: 'Waktu',
      render: item => (
        <span className="text-xs text-slate-500">
          {new Date(item.tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      ),
      className: 'w-28'
    },
    {
      header: 'Status',
      render: item => (
        <Badge
          variant={
            item.status === 'belum_dibaca'
              ? 'rose'
              : item.status === 'sudah_dibaca'
              ? 'sky'
              : 'emerald'
          }
        >
          {item.status === 'belum_dibaca'
            ? 'Belum Dibaca'
            : item.status === 'sudah_dibaca'
            ? 'Sudah Dibaca'
            : 'Telah Dibalas'}
        </Badge>
      ),
      className: 'w-32 text-center'
    },
    {
      header: 'Aksi',
      render: item => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenMessage(item)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Buka Pesan
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-36 text-right'
    }
  ];

  if (loading) return <Loading fullPage message="Memuat kotak pesan masuk..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kotak Masuk Pesan Pengunjung</h2>
          <p className="text-xs text-slate-500">Kelola pertanyaan, masukan, dan permohonan informasi dari formulir kontak</p>
        </div>
      </div>

      <DataTable
        data={messages}
        columns={columns}
        searchPlaceholder="Cari pengirim, email, atau subjek pesan..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.subjek.toLowerCase().includes(q) ||
          item.pesan.toLowerCase().includes(q)
        }
      />

      {/* Modal Detail Pesan */}
      {activeMessage && (
        <Modal
          isOpen={!!activeMessage}
          onClose={() => setActiveMessage(null)}
          title="Detail Pesan Pengunjung"
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900">{activeMessage.nama}</h4>
                <p className="text-xs text-slate-500">{activeMessage.email}</p>
                {activeMessage.telepon && (
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    WhatsApp: {activeMessage.telepon}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  activeMessage.status === 'belum_dibaca'
                    ? 'rose'
                    : activeMessage.status === 'sudah_dibaca'
                    ? 'sky'
                    : 'emerald'
                }
              >
                {activeMessage.status === 'belum_dibaca'
                  ? 'Belum Dibaca'
                  : activeMessage.status === 'sudah_dibaca'
                  ? 'Sudah Dibaca'
                  : 'Telah Dibalas'}
              </Badge>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Subjek Pesan:
              </span>
              <p className="text-sm font-bold text-slate-900 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
                {activeMessage.subjek}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Isi Pesan:
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {activeMessage.pesan}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Diterima pada {new Date(activeMessage.tanggal).toLocaleString('id-ID')}
              </span>
              <div className="flex items-center gap-2">
                {activeMessage.status !== 'dibalas' && (
                  <button
                    type="button"
                    onClick={() => handleMarkReplied(activeMessage.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tandai Telah Dibalas
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pesan Pengunjung"
        message={`Apakah Anda yakin ingin menghapus pesan dari "${deleteTarget?.nama}"?`}
        confirmText="Hapus Pesan"
        isDangerous
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
