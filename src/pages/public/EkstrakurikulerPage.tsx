import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Extracurricular } from '../../types.ts';
import { ExtracurricularCard } from '../../components/common/Cards.tsx';
import { Loading } from '../../components/common/Feedback.tsx';

export const EkstrakurikulerPage: React.FC = () => {
  const [items, setItems] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExtracurriculars()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat ekstrakurikuler..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Pengembangan Potensi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ekstrakurikuler Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Wadah penyaluran bakat, minat, kepemimpinan, dan kreativitas siswa di bidang keagamaan, seni, olahraga, dan kepanduan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(extra => (
          <ExtracurricularCard key={extra.id} extra={extra} />
        ))}
      </div>
    </div>
  );
};
