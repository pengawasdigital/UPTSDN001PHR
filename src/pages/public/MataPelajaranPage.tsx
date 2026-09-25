import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, User, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Subject } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const MataPelajaranPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects()
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat mata pelajaran..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Kurikulum Merdeka Belajar
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Struktur Mata Pelajaran
        </h1>
        <p className="text-sm text-slate-600">
          Daftar mata pelajaran intrakurikuler dan muatan lokal yang diajarkan dengan alokasi jam pembelajaran (JP).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subj => (
          <div
            key={subj.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {subj.kode}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {subj.jumlahJP} JP / Minggu
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {subj.nama}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {subj.deskripsi}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Sasaran:</span>
                <span className="font-semibold text-slate-800">{subj.kelas} ({subj.jenjang})</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate">{subj.guruPengampu}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
