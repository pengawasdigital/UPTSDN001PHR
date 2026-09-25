import React, { useEffect, useState } from 'react';
import { Save, MessageSquareQuote } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { PrincipalMessage } from '../../types.ts';
import { FormInput, FormTextarea } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminSambutanPage: React.FC = () => {
  const [data, setData] = useState<PrincipalMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.getPrincipalMessage()
      .then(setData)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      const updated = await api.updatePrincipalMessage(data);
      setData(updated);
      toast.success('Sambutan kepala sekolah berhasil diperbarui!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan sambutan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage message="Memuat sambutan kepala sekolah..." />;
  if (!data) return null;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Sambutan Kepala Sekolah</h2>
          <p className="text-xs text-slate-500">Edit foto resmi, nama, masa jabatan, dan isi teks sambutan</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Sambutan</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormInput
              label="Nama Lengkap & Gelar Kepala Sekolah"
              value={data.nama}
              onChange={e => setData({ ...data, nama: e.target.value })}
              required
            />
            <FormInput
              label="Jabatan Resmi"
              value={data.jabatan}
              onChange={e => setData({ ...data, jabatan: e.target.value })}
              required
            />
            <FormInput
              label="Periode Jabatan"
              value={data.periode}
              onChange={e => setData({ ...data, periode: e.target.value })}
              placeholder="Contoh: 2022 - Sekarang"
              required
            />
          </div>

          <ImageUploader
            label="Foto Resmi Kepala Sekolah"
            value={data.foto}
            onChange={url => setData({ ...data, foto: url })}
          />
        </div>

        <FormTextarea
          label="Teks Lengkap Sambutan Kepala Sekolah"
          rows={12}
          value={data.isiSambutan}
          onChange={e => setData({ ...data, isiSambutan: e.target.value })}
          required
        />
      </div>
    </form>
  );
};
