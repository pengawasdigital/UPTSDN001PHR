import React, { useEffect, useState } from 'react';
import { Save, Building2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { SchoolProfile } from '../../types.ts';
import { FormInput, FormSelect, FormTextarea } from '../../components/common/FormControls.tsx';
import { ImageUploader } from '../../components/common/ImageUploader.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminProfilPage: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.getSchoolProfile()
      .then(setProfile)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await api.updateSchoolProfile(profile);
      setProfile(updated);
      toast.success('Profil sekolah berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage message="Memuat form profil sekolah..." />;
  if (!profile) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Profil Sekolah</h2>
          <p className="text-xs text-slate-500">Edit identitas resmi, akreditasi, kontak, dan sejarah lembaga</p>
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
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Identitas Pokok */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Identitas Pokok & Legalitas</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            label="Nama Sekolah"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            required
          />
          <FormInput
            label="NPSN"
            value={profile.npsn}
            onChange={e => setProfile({ ...profile, npsn: e.target.value })}
            required
          />
          <FormInput
            label="NSS"
            value={profile.nss}
            onChange={e => setProfile({ ...profile, nss: e.target.value })}
            required
          />
          <FormSelect
            label="Status Sekolah"
            value={profile.status}
            onChange={e => setProfile({ ...profile, status: e.target.value as any })}
            options={[
              { label: 'Negeri', value: 'Negeri' },
              { label: 'Swasta', value: 'Swasta' }
            ]}
          />
          <FormSelect
            label="Jenjang Pendidikan"
            value={profile.jenjang}
            onChange={e => setProfile({ ...profile, jenjang: e.target.value as any })}
            options={[
              { label: 'SD', value: 'SD' },
              { label: 'SMP', value: 'SMP' },
              { label: 'SMA', value: 'SMA' },
              { label: 'SMK', value: 'SMK' }
            ]}
          />
          <FormSelect
            label="Akreditasi"
            value={profile.akreditasi}
            onChange={e => setProfile({ ...profile, akreditasi: e.target.value as any })}
            options={[
              { label: 'Akreditasi A (Unggul)', value: 'A' },
              { label: 'Akreditasi B (Baik)', value: 'B' },
              { label: 'Akreditasi C (Cukup)', value: 'C' },
              { label: 'Belum Terakreditasi', value: 'Belum Terakreditasi' }
            ]}
          />
          <FormInput
            label="Tahun Berdiri"
            value={profile.tahunBerdiri}
            onChange={e => setProfile({ ...profile, tahunBerdiri: e.target.value })}
            required
          />
          <FormInput
            label="Kepala Sekolah"
            value={profile.kepalaSekolah}
            onChange={e => setProfile({ ...profile, kepalaSekolah: e.target.value })}
            required
          />
          <FormInput
            label="Website Resmi"
            value={profile.website}
            onChange={e => setProfile({ ...profile, website: e.target.value })}
          />
        </div>
      </div>

      {/* Alamat & Kontak */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Alamat Geografis & Kontak Resmi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="sm:col-span-2 md:col-span-3">
            <FormInput
              label="Alamat Lengkap (Jalan, RT/RW, Dusun)"
              value={profile.alamat}
              onChange={e => setProfile({ ...profile, alamat: e.target.value })}
              required
            />
          </div>
          <FormInput
            label="Desa / Kelurahan"
            value={profile.desaKelurahan}
            onChange={e => setProfile({ ...profile, desaKelurahan: e.target.value })}
            required
          />
          <FormInput
            label="Kecamatan"
            value={profile.kecamatan}
            onChange={e => setProfile({ ...profile, kecamatan: e.target.value })}
            required
          />
          <FormInput
            label="Kabupaten / Kota"
            value={profile.kabupatenKota}
            onChange={e => setProfile({ ...profile, kabupatenKota: e.target.value })}
            required
          />
          <FormInput
            label="Provinsi"
            value={profile.provinsi}
            onChange={e => setProfile({ ...profile, provinsi: e.target.value })}
            required
          />
          <FormInput
            label="Kode Pos"
            value={profile.kodePos}
            onChange={e => setProfile({ ...profile, kodePos: e.target.value })}
            required
          />
          <FormInput
            label="Email Resmi"
            type="email"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            required
          />
          <FormInput
            label="Nomor Telepon Kantor"
            value={profile.telepon}
            onChange={e => setProfile({ ...profile, telepon: e.target.value })}
          />
          <FormInput
            label="Nomor WhatsApp Hotline"
            value={profile.whatsapp}
            onChange={e => setProfile({ ...profile, whatsapp: e.target.value })}
          />
        </div>
      </div>

      {/* Media & Narasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Media Gambar & Sejarah Sekolah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Logo Sekolah"
            value={profile.logo}
            onChange={url => setProfile({ ...profile, logo: url })}
          />
          <ImageUploader
            label="Foto Utama Gedung / Halaman Sekolah"
            value={profile.fotoSekolah}
            onChange={url => setProfile({ ...profile, fotoSekolah: url })}
          />
        </div>

        <FormTextarea
          label="Deskripsi / Selayang Pandang Sekolah"
          rows={5}
          value={profile.deskripsi}
          onChange={e => setProfile({ ...profile, deskripsi: e.target.value })}
          required
        />

        <FormTextarea
          label="Sejarah Lengkap Sekolah"
          rows={6}
          value={profile.sejarah}
          onChange={e => setProfile({ ...profile, sejarah: e.target.value })}
          required
        />
      </div>
    </form>
  );
};
