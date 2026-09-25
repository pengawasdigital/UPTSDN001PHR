import React, { useEffect, useState } from 'react';
import { Calendar, User, Eye, ArrowLeft, Share2, Tag } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { News } from '../../types.ts';
import { Badge } from '../../components/common/FormControls.tsx';
import { Loading, ErrorState } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

interface BeritaDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BeritaDetailPage: React.FC<BeritaDetailPageProps> = ({ slug, onNavigate }) => {
  const [news, setNews] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.getNewsBySlug(slug)
      .then(async data => {
        setNews(data);
        const all = await api.getNews({ status: 'published' });
        setRelated(all.filter(n => n.id !== data.id).slice(0, 3));
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan berita berhasil disalin ke clipboard');
    }
  };

  if (loading) return <Loading fullPage message="Memuat artikel berita..." />;
  if (error || !news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Berita Tidak Ditemukan"
          message="Artikel yang Anda cari mungkin telah dihapus atau dipindahkan."
          onRetry={() => onNavigate('/berita')}
        />
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/berita')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Berita</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <Badge variant="emerald">{news.kategori}</Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {news.judul}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {new Date(news.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              {news.penulis}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" />
              {news.views} Pembaca
            </span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden aspect-16/9 bg-slate-100 shadow-xs border border-slate-100">
        <img src={news.thumbnail} alt={news.judul} className="w-full h-full object-cover" />
      </div>

      {/* Article Body */}
      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4"
        dangerouslySetInnerHTML={{ __html: news.isi }}
      />

      {/* Related News */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Berita Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate(`/berita/${item.slug}`)}
                className="group p-3 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img src={item.thumbnail} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 leading-snug">
                  {item.judul}
                </h4>
                <p className="text-[10px] text-slate-400 mt-2">
                  {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
