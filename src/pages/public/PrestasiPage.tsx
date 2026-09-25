import React, { useEffect, useState } from 'react';
import { Trophy, Filter, Award } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Achievement } from '../../types.ts';
import { AchievementCard } from '../../components/common/Cards.tsx';
import { Loading, EmptyState } from '../../components/common/Feedback.tsx';

export const PrestasiPage: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [selectedTahun, setSelectedTahun] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat prestasi..." />;

  const tingkats = ['Semua', 'Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
  const years = ['Semua', ...Array.from(new Set(items.map(i => i.tahun))).sort().reverse()];

  const filteredItems = items.filter(item => {
    const matchTingkat = selectedTingkat === 'Semua' || item.tingkat === selectedTingkat;
    const matchTahun = selectedTahun === 'Semua' || item.tahun === selectedTahun;
    return matchTingkat && matchTahun;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
          Bangga Berprestasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Prestasi Sekolah & Siswa
        </h1>
        <p className="text-sm text-slate-600">
          Apresiasi atas kerja keras, dedikasi, dan capaian membanggakan peserta didik dan dewan guru di berbagai tingkatan.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Filter Tingkat */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Tingkat:
          </span>
          {tingkats.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTingkat(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedTingkat === t
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filter Tahun */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Tahun:</span>
          <select
            value={selectedTahun}
            onChange={e => setSelectedTahun(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden cursor-pointer"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="Prestasi Tidak Ditemukan"
          description="Tidak ada data prestasi dengan kriteria filter yang dipilih."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};
