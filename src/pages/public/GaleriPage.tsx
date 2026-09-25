import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Gallery } from '../../types.ts';
import { GalleryCard } from '../../components/common/Cards.tsx';
import { Loading, EmptyState } from '../../components/common/Feedback.tsx';

export const GaleriPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeMedia, setActiveMedia] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGalleries()
      .then(setGalleries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat galeri media..." />;

  const categories = [
    'Semua',
    'Kegiatan Sekolah',
    'Pembelajaran',
    'Upacara',
    'Ekstrakurikuler',
    'Prestasi',
    'Kegiatan Siswa'
  ];

  const filteredGalleries = galleries.filter(g =>
    selectedCategory === 'Semua' ? true : g.kategori === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Dokumentasi Visual
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Galeri Foto & Video
        </h1>
        <p className="text-sm text-slate-600">
          Kumpulan momen berharga kegiatan pembelajaran, upacara, ekstrakurikuler, dan kebersamaan warga sekolah.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
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
      {filteredGalleries.length === 0 ? (
        <EmptyState
          title="Galeri Kosong"
          description="Belum ada foto atau video dalam kategori ini."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGalleries.map(item => (
            <GalleryCard
              key={item.id}
              gallery={item}
              onClick={() => setActiveMedia(item)}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={activeMedia.mediaUrl}
                alt={activeMedia.judul}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-3 text-xs text-emerald-400">
                <span className="font-semibold">{activeMedia.kategori}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activeMedia.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{activeMedia.judul}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeMedia.deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
