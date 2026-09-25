import React, { useEffect, useState } from 'react';
import { Target, Compass, Award, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { VisionMission } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const VisiMisiPage: React.FC = () => {
  const [data, setData] = useState<VisionMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVisionMission()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat visi & misi..." />;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Landasan Filosofis & Arah Pendidikan
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Visi, Misi & Tujuan Sekolah
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pedoman dan komitmen bersama seluruh civitas akademika dalam mewujudkan ekosistem pendidikan dasar yang unggul dan bermartabat.
        </p>
      </div>

      {/* 1. VISI SEKOLAH */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-center">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mx-auto backdrop-blur-xs border border-white/10">
            <Target className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Visi Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug italic">
            "{data.visi}"
          </h2>
        </div>
      </div>

      {/* 2. MISI & TUJUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Misi */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Misi Sekolah</h3>
              <p className="text-xs text-slate-400">Langkah nyata pencapaian visi</p>
            </div>
          </div>
          <ul className="space-y-4">
            {data.misi.map((m, idx) => (
              <li key={idx} className="flex items-start gap-3.5 text-sm text-slate-600">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tujuan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tujuan Sekolah</h3>
              <p className="text-xs text-slate-400">Sasaran mutu dan hasil belajar</p>
            </div>
          </div>
          <ul className="space-y-4">
            {data.tujuan.map((t, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. NILAI-NILAI & PROGRAM UNGGULAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nilai Nilai */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Nilai-Nilai Budaya Sekolah</h3>
              <p className="text-xs text-slate-400">Karakter dan integritas warga sekolah</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.nilaiNilai.map((val, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Program Unggulan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Program Unggulan</h3>
              <p className="text-xs text-slate-400">Inisiatif unggulan pengembangan siswa</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.programUnggulan.map((prog, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs font-semibold text-sky-950 flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span>{prog}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
