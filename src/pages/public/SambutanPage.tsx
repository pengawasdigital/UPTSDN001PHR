import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, Calendar, Award } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { PrincipalMessage } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const SambutanPage: React.FC = () => {
  const [data, setData] = useState<PrincipalMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPrincipalMessage()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat sambutan..." />;
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Kata Sambutan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Sambutan Kepala Sekolah
        </h1>
        <p className="text-xs text-slate-500">Mewujudkan masa depan cerah anak bangsa</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg ring-4 ring-emerald-50 shrink-0">
            <img src={data.foto} alt={data.nama} className="w-full h-full object-cover" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{data.nama}</h2>
            <p className="text-sm font-semibold text-emerald-700">{data.jabatan}</p>
            <p className="text-xs text-slate-400">Masa Bakti: {data.periode}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
          {data.isiSambutan}
        </div>
      </div>
    </div>
  );
};
