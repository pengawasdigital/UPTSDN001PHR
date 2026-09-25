import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Users,
  Trophy,
  Activity,
  Warehouse,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Phone,
  Calendar,
  Eye
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type {
  SchoolProfile,
  PrincipalMessage,
  Advantage,
  News,
  Achievement,
  Gallery,
  Extracurricular,
  Facility
} from '../../types.ts';
import { NewsCard, AchievementCard, GalleryCard, ExtracurricularCard, FacilityCard, StatCard } from '../../components/common/Cards.tsx';
import { Loading } from '../../components/common/Feedback.tsx';

interface HomePageProps {
  onNavigate: (path: string) => void;
  profile: SchoolProfile | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, profile }) => {
  const [loading, setLoading] = useState(true);
  const [principalMessage, setPrincipalMessage] = useState<PrincipalMessage | null>(null);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [latestAchievements, setLatestAchievements] = useState<Achievement[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [stats, setStats] = useState({
    siswa: 248,
    guru: 18,
    tendik: 5,
    ekskul: 8,
    prestasi: 24
  });

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [pm, adv, nw, ach, gal, extra, fac, std, tch] = await Promise.all([
          api.getPrincipalMessage().catch(() => null),
          api.getAdvantages().catch(() => []),
          api.getNews({ status: 'published' }).catch(() => []),
          api.getAchievements().catch(() => []),
          api.getGalleries().catch(() => []),
          api.getExtracurriculars().catch(() => []),
          api.getFacilities().catch(() => []),
          api.getStudentsPublic().catch(() => []),
          api.getTeachers().catch(() => [])
        ]);

        if (pm) setPrincipalMessage(pm);
        setAdvantages(adv.slice(0, 6));
        setLatestNews(nw.slice(0, 3));
        setLatestAchievements(ach.slice(0, 3));
        setGalleries(gal.slice(0, 4));
        setExtracurriculars(extra.slice(0, 3));
        setFacilities(fac.slice(0, 3));

        setStats({
          siswa: std.length > 0 ? std.length : 248,
          guru: tch.filter(t => t.jenisPTK.includes('Guru')).length || 18,
          tendik: tch.filter(t => !t.jenisPTK.includes('Guru')).length || 5,
          ekskul: extra.length || 8,
          prestasi: ach.length || 24
        });
      } catch (e) {
        console.error('Error loading home data', e);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const schoolName = profile?.name || 'UPT SD Negeri 001 Perhentian Raja';

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile?.fotoSekolah || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80'}
            alt={schoolName}
            className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 brightness-105 contrast-105 transition-opacity duration-700"
          />
          {/* Balanced directional scrim: keeps text readable on the left while leaving the photo vivid, bright, and clearly visible */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/40 to-transparent sm:from-slate-950/75 sm:via-slate-950/30 sm:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-slate-950/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Sekolah Unggulan Berwawasan Adiwiyata</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
              Membangun Generasi <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Cerdas, Mandiri & Berakhlak
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal max-w-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] bg-slate-950/30 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:border-0">
              Selamat datang di portal resmi {schoolName}. Pusat informasi pendidikan dasar berkualitas, berkarakter Profil Pelajar Pancasila, dan siap menyongsong era digital.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/profil')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-600/40 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Profil Sekolah</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('/kontak')}
                className="px-6 py-3.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-xl text-sm font-semibold backdrop-blur-md border border-white/20 hover:border-white/40 transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-black/20"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Hubungi Kami</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="Jumlah Siswa"
            value={stats.siswa}
            icon={<GraduationCap className="w-6 h-6" />}
            subtitle="Peserta Didik Aktif"
            color="emerald"
          />
          <StatCard
            title="Dewan Guru"
            value={stats.guru}
            icon={<Users className="w-6 h-6" />}
            subtitle="Tenaga Pengajar"
            color="sky"
          />
          <StatCard
            title="Staf & Tendik"
            value={stats.tendik}
            icon={<BookOpen className="w-6 h-6" />}
            subtitle="Administrasi & IT"
            color="indigo"
          />
          <StatCard
            title="Ekstrakurikuler"
            value={stats.ekskul}
            icon={<Activity className="w-6 h-6" />}
            subtitle="Minat & Bakat"
            color="amber"
          />
          <StatCard
            title="Total Prestasi"
            value={stats.prestasi}
            icon={<Trophy className="w-6 h-6" />}
            subtitle="Tingkat Prestasi"
            color="rose"
          />
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA SEKOLAH */}
      {principalMessage && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-xl ring-8 ring-emerald-50 mb-4">
                <img
                  src={principalMessage.foto}
                  alt={principalMessage.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{principalMessage.nama}</h3>
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-1">
                {principalMessage.jabatan}
              </p>
              <p className="text-xs text-slate-400 mt-1">Periode {principalMessage.periode}</p>
            </div>

            <div className="w-full lg:w-2/3 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Kata Sambutan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Mencetak Insan Berkarakter Unggul & Mandiri
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-6">
                {principalMessage.isiSambutan}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/sambutan-kepala-sekolah')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <span>Baca Sambutan Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. PROFIL SINGKAT & KEUNGGULAN SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Kenapa Memilih Kami?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Keunggulan Pendidikan Di Sekolah Kami
          </h2>
          <p className="text-sm text-slate-600">
            Kami mengintegrasikan pembentukan karakter luhur dengan fasilitas teknologi modern dan wawasan lingkungan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, idx) => (
            <div
              key={adv.id || idx}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {adv.judul}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{adv.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BERITA & PENGUMUMAN TERBARU */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Kabar Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Berita & Informasi Terkini
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/berita')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>Lihat Semua Berita</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map(item => (
            <NewsCard
              key={item.id}
              news={item}
              onReadMore={slug => onNavigate(`/berita/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 6. PRESTASI SISWA */}
      <section className="bg-slate-900 text-white py-16 -mx-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Rekam Jejak Prestasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Prestasi Membanggakan Siswa Kami
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/prestasi')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <span>Semua Prestasi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestAchievements.map(ach => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. EKSTRAKURIKULER & FASILITAS SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Ekstrakurikuler */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Minat & Bakat
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Kegiatan Ekstrakurikuler
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/ekstrakurikuler')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Selengkapnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {extracurriculars.map(extra => (
              <ExtracurricularCard key={extra.id} extra={extra} />
            ))}
          </div>
        </div>

        {/* Fasilitas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Sarana Prasarana
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Fasilitas Penunjang Pembelajaran
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/fasilitas')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Selengkapnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map(fac => (
              <FacilityCard key={fac.id} facility={fac} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. GALERI FOTO */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Dokumentasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Galeri Kegiatan Sekolah
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/galeri')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Galeri Penuh</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleries.map(item => (
            <GalleryCard
              key={item.id}
              gallery={item}
              onClick={() => onNavigate('/galeri')}
            />
          ))}
        </div>
      </section>

      {/* 9. CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-8 sm:p-14 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              Penerimaan Peserta Didik Baru (PPDB)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Kenali Lebih Dekat Sekolah Kami & Bergabunglah Bersama Kami
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Kami siap mendampingi putra-putri Anda tumbuh menjadi pribadi yang cerdas, berdaya saing, berakhlak mulia, dan berwawasan masa depan.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/kontak')}
                className="px-6 py-3 bg-white text-emerald-950 font-bold text-sm rounded-xl hover:bg-emerald-50 transition-colors shadow-md cursor-pointer"
              >
                Hubungi Panitia Sekolah
              </button>
              <button
                onClick={() => onNavigate('/profil')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Pelajari Profil Sekolah
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
