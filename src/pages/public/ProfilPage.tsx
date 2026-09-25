import React, { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  BookOpen,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { SchoolProfile } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const ProfilPage: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSchoolProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat profil sekolah..." />;
  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Page Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Identitas Resmi Lembaga</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Profil & Sejarah Sekolah
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Mengenal lebih dekat {profile.name}, dedikasi pendidikan karakter, dan komitmen menuju sekolah berprestasi dan berwawasan lingkungan.
          </p>
        </div>
      </div>

      {/* Main Grid: Data Pokok Sekolah & Deskripsi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Identitas Sekolah */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{profile.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Akreditasi {profile.akreditasi}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">NPSN</span>
                <span className="font-semibold text-slate-900">{profile.npsn}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">NSS</span>
                <span className="font-semibold text-slate-900">{profile.nss}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Jenjang Pendidikan</span>
                <span className="font-semibold text-slate-900">{profile.jenjang}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Status Sekolah</span>
                <span className="font-semibold text-slate-900">{profile.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Tahun Berdiri</span>
                <span className="font-semibold text-slate-900">{profile.tahunBerdiri}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Kepala Sekolah</span>
                <span className="font-semibold text-slate-900 text-right">{profile.kepalaSekolah}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{profile.alamat}, {profile.desaKelurahan}, Kec. {profile.kecamatan}, {profile.kabupatenKota}, {profile.provinsi} {profile.kodePos}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.telepon} / {profile.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deskripsi & Sejarah Sekolah */}
        <div className="lg:col-span-2 space-y-8">
          {/* Foto Sekolah Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-16/9 bg-slate-100 shadow-xs border border-slate-100">
            <img
              src={profile.fotoSekolah}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Deskripsi */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Tentang Sekolah Kami</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.deskripsi}
            </p>
          </div>

          {/* Sejarah Sekolah */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Sejarah Singkat Berdirinya Sekolah</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.sejarah}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
