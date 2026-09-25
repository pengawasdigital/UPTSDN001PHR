import React, { useEffect, useState } from 'react';
import { Warehouse, Filter } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Facility } from '../../types.ts';
import { FacilityCard } from '../../components/common/Cards.tsx';
import { Loading } from '../../components/common/Feedback.tsx';

export const FasilitasPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFacilities()
      .then(setFacilities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat sarana & fasilitas..." />;

  const categories = ['Semua', ...Array.from(new Set(facilities.map(f => f.kategori)))];

  const filteredFacilities = selectedCategory === 'Semua'
    ? facilities
    : facilities.filter(f => f.kategori === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Sarana & Prasarana
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Fasilitas Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Sarana belajar yang lengkap, representatif, aman, dan nyaman untuk mendukung kegiatan intrakurikuler dan ekstrakurikuler.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map(fac => (
          <FacilityCard key={fac.id} facility={fac} />
        ))}
      </div>
    </div>
  );
};
