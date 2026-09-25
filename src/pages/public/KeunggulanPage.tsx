import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Advantage } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const KeunggulanPage: React.FC = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdvantages()
      .then(setAdvantages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat keunggulan sekolah..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Daya Saing & Keistimewaan
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Keunggulan Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Standar mutu, fasilitas modern, dan budaya unggul yang menjadikan sekolah kami pilihan terdepan orang tua.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advantages.map((adv, index) => (
          <div
            key={adv.id || index}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between"
          >
            {adv.foto && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img src={adv.foto} alt={adv.judul} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{adv.judul}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{adv.deskripsi}</p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Program Aktif & Berjalan</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
