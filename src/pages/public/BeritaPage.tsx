import React, { useEffect, useState } from 'react';
import { Newspaper, Search, Filter } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { News } from '../../types.ts';
import { NewsCard } from '../../components/common/Cards.tsx';
import { SearchBar, Pagination } from '../../components/common/FormControls.tsx';
import { Loading, EmptyState } from '../../components/common/Feedback.tsx';

interface BeritaPageProps {
  onNavigate: (path: string) => void;
}

export const BeritaPage: React.FC<BeritaPageProps> = ({ onNavigate }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    api.getNews({ status: 'published' })
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat berita & pengumuman..." />;

  const categories = [
    'Semua',
    'Kegiatan Sekolah',
    'Prestasi',
    'Pengumuman',
    'Informasi',
    'Akademik'
  ];

  const filteredNews = news.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchSearch =
      !search ||
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Portal Berita & Publikasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Berita & Pengumuman
        </h1>
        <p className="text-sm text-slate-600">
          Ikuti perkembangan terkini seputar kegiatan akademik, prestasi peserta didik, dan agenda resmi sekolah.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={val => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Cari berita atau agenda..."
        />
      </div>

      {/* Grid News */}
      {paginatedNews.length === 0 ? (
        <EmptyState
          title="Berita Tidak Ditemukan"
          description="Tidak ada artikel berita yang cocok dengan kriteria pencarian Anda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map(item => (
            <NewsCard
              key={item.id}
              news={item}
              onReadMore={slug => onNavigate(`/berita/${slug}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredNews.length > itemsPerPage && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredNews.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};
