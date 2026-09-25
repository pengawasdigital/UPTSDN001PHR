import React from 'react';
import { Calendar, User, Eye, Trophy, Award, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { News, Achievement, Gallery, TeacherStaff, Facility, Extracurricular } from '../../types.ts';
import { Badge } from './FormControls.tsx';

export const NewsCard: React.FC<{
  news: News;
  onReadMore?: (slug: string) => void;
}> = ({ news, onReadMore }) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={news.thumbnail}
          alt={news.judul}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="emerald">{news.kategori}</Badge>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(news.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {news.penulis}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
            {news.judul}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
            {news.ringkasan}
          </p>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            {news.views} dilihat
          </span>
          <button
            onClick={() => onReadMore?.(news.slug)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const getBadgeVariant = (tingkat: string) => {
    switch (tingkat) {
      case 'Internasional':
        return 'rose';
      case 'Nasional':
        return 'indigo';
      case 'Provinsi':
        return 'sky';
      case 'Kabupaten/Kota':
        return 'amber';
      default:
        return 'emerald';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={achievement.foto}
          alt={achievement.nama}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariant(achievement.tingkat)}>
            Tingkat {achievement.tingkat}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-amber-500/90 text-white backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Trophy className="w-3.5 h-3.5" />
          {achievement.juara}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
            {achievement.cabang} • Tahun {achievement.tahun}
          </span>
          <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 leading-snug">
            {achievement.nama}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {achievement.deskripsi}
          </p>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-700 truncate max-w-[180px]">
            Oleh: {achievement.namaSiswa}
          </span>
          <span className="text-[11px] text-slate-400">
            {new Date(achievement.tanggal).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export const GalleryCard: React.FC<{
  gallery: Gallery;
  onClick?: () => void;
}> = ({ gallery, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer border border-slate-100 shadow-xs hover:shadow-xl transition-all"
    >
      <img
        src={gallery.mediaUrl}
        alt={gallery.judul}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
      <div className="absolute top-3 left-3">
        <Badge variant="emerald">{gallery.kategori}</Badge>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h4 className="text-sm font-bold line-clamp-2 leading-snug drop-shadow-xs mb-1">
          {gallery.judul}
        </h4>
        <p className="text-[11px] text-slate-300 line-clamp-1">
          {new Date(gallery.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export const TeacherCard: React.FC<{
  teacher: TeacherStaff;
  onDetail?: () => void;
}> = ({ teacher, onDetail }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all p-5 flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-emerald-50 group-hover:ring-emerald-200 transition-all bg-slate-100">
        <img
          src={teacher.foto}
          alt={teacher.nama}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-1 leading-snug">{teacher.nama}</h4>
      <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-3">
        {teacher.jabatan}
      </p>
      <div className="w-full text-xs text-slate-500 space-y-1.5 mb-4 border-t border-slate-100 pt-3">
        {teacher.nip && teacher.nip !== '-' && (
          <p className="truncate">NIP: {teacher.nip}</p>
        )}
        {teacher.mataPelajaran && teacher.mataPelajaran !== '-' && (
          <p className="text-slate-600 truncate font-medium">Mapel: {teacher.mataPelajaran}</p>
        )}
        <p className="text-slate-400 truncate">{teacher.pendidikanTerakhir}</p>
      </div>
      {onDetail && (
        <button
          onClick={onDetail}
          className="w-full mt-auto py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
        >
          Lihat Profil Lengkap
        </button>
      )}
    </div>
  );
};

export const FacilityCard: React.FC<{ facility: Facility }> = ({ facility }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={facility.foto}
          alt={facility.nama}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="slate">{facility.kategori}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200 shadow-xs">
          {facility.jumlah} Unit ({facility.kondisi})
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
            {facility.nama}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {facility.deskripsi}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ExtracurricularCard: React.FC<{ extra: Extracurricular }> = ({ extra }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={extra.foto}
          alt={extra.nama}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={extra.statusAktif ? 'emerald' : 'slate'}>
            {extra.statusAktif ? 'Aktif' : 'Non-aktif'}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5">
            {extra.nama}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {extra.deskripsi}
          </p>
          <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Pembina: {extra.pembina}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{extra.jadwal}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{extra.tempat}</span>
            </div>
          </div>
        </div>
        {extra.prestasi && (
          <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-amber-700">
            <Award className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <span className="line-clamp-1 italic">{extra.prestasi}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  color?: 'emerald' | 'sky' | 'amber' | 'indigo' | 'rose';
}> = ({ title, value, icon, subtitle, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
};
