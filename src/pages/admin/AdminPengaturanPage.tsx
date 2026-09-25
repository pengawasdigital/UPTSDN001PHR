import React, { useEffect, useState } from 'react';
import { Save, Settings, ShieldCheck, Globe } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { WebSettings } from '../../types.ts';
import { FormInput, FormTextarea } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminPengaturanPage: React.FC = () => {
  const [settings, setSettings] = useState<WebSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      toast.success('Pengaturan website berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage message="Memuat pengaturan website..." />;
  if (!settings) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengaturan Sistem Website</h2>
          <p className="text-xs text-slate-500">Konfigurasi branding, kontak resmi, media sosial, banner, dan hak cipta</p>
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
              <span>Simpan Pengaturan</span>
            </>
          )}
        </button>
      </div>

      {/* Identitas Branding Website */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Branding & Visual Sekolah</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Nama Sekolah (Title)"
            value={settings.namaSekolah}
            onChange={e => setSettings({ ...settings, namaSekolah: e.target.value })}
            required
          />
          <FormInput
            label="Slogan / Tagline Sekolah"
            value={settings.slogan}
            onChange={e => setSettings({ ...settings, slogan: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Logo Sekolah"
            value={settings.logo}
            onChange={url => setSettings({ ...settings, logo: url })}
          />
          <ImageUploader
            label="Hero Banner Beranda Utama"
            value={settings.heroBanner}
            onChange={url => setSettings({ ...settings, heroBanner: url })}
          />
        </div>
      </div>

      {/* Kontak & Media Sosial */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Media Sosial & Kontak Pengaduan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            label="Facebook URL"
            value={settings.facebookUrl}
            onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
          />
          <FormInput
            label="Instagram URL"
            value={settings.instagramUrl}
            onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
          />
          <FormInput
            label="YouTube Channel URL"
            value={settings.youtubeUrl}
            onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
          />
          <FormInput
            label="TikTok URL"
            value={settings.tiktokUrl}
            onChange={e => setSettings({ ...settings, tiktokUrl: e.target.value })}
          />
          <FormInput
            label="Nomor WhatsApp Hotline"
            value={settings.whatsapp}
            onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
          />
          <FormInput
            label="Email Pelayanan"
            type="email"
            value={settings.email}
            onChange={e => setSettings({ ...settings, email: e.target.value })}
            required
          />
        </div>

        <FormInput
          label="Tautan Embed Google Maps"
          value={settings.googleMapsUrl}
          onChange={e => setSettings({ ...settings, googleMapsUrl: e.target.value })}
        />
      </div>

      {/* Footer & Copyright */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Footer & Hak Cipta
        </h3>

        <FormInput
          label="Teks Copyright Footer"
          value={settings.copyright}
          onChange={e => setSettings({ ...settings, copyright: e.target.value })}
          required
        />
      </div>
    </form>
  );
};
