import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Users,
  Newspaper,
  Trophy,
  Image as ImageIcon,
  Activity,
  Warehouse,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { DashboardStats } from '../../types.ts';
import { StatCard } from '../../components/common/Cards.tsx';
import { Loading } from '../../components/common/Feedback.tsx';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Menyiapkan data ringkasan dashboard..." />;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Sistem Informasi Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Panel Manajemen
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Kelola data pokok sekolah, berita, prestasi, kurikulum, serta database peserta didik secara terpadu dan efisien.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/berita')}
            className="px-4 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
          >
            Tulis Berita Baru
          </button>
          <button
            onClick={() => onNavigate('/admin/siswa')}
            className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-500/50 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Kelola Siswa
          </button>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigate('/admin/siswa')} className="cursor-pointer">
          <StatCard
            title="Total Siswa"
            value={stats.totalSiswa}
            icon={<GraduationCap className="w-6 h-6" />}
            subtitle="Peserta Didik Aktif"
            color="emerald"
          />
        </div>
        <div onClick={() => onNavigate('/admin/guru-staf')} className="cursor-pointer">
          <StatCard
            title="Total PTK"
            value={stats.totalPTK}
            icon={<Users className="w-6 h-6" />}
            subtitle="Guru & Staf Sekolah"
            color="sky"
          />
        </div>
        <div onClick={() => onNavigate('/admin/berita')} className="cursor-pointer">
          <StatCard
            title="Total Berita"
            value={stats.totalBerita}
            icon={<Newspaper className="w-6 h-6" />}
            subtitle="Artikel & Informasi"
            color="indigo"
          />
        </div>
        <div onClick={() => onNavigate('/admin/prestasi')} className="cursor-pointer">
          <StatCard
            title="Total Prestasi"
            value={stats.totalPrestasi}
            icon={<Trophy className="w-6 h-6" />}
            subtitle="Penghargaan Diraih"
            color="amber"
          />
        </div>
        <div onClick={() => onNavigate('/admin/galeri')} className="cursor-pointer">
          <StatCard
            title="Total Galeri"
            value={stats.totalGaleri}
            icon={<ImageIcon className="w-6 h-6" />}
            subtitle="Foto & Video Dokumentasi"
            color="emerald"
          />
        </div>
        <div onClick={() => onNavigate('/admin/ekstrakurikuler')} className="cursor-pointer">
          <StatCard
            title="Ekstrakurikuler"
            value={stats.totalEkstrakurikuler}
            icon={<Activity className="w-6 h-6" />}
            subtitle="Wadah Minat & Bakat"
            color="sky"
          />
        </div>
        <div onClick={() => onNavigate('/admin/fasilitas')} className="cursor-pointer">
          <StatCard
            title="Fasilitas"
            value={stats.totalFasilitas}
            icon={<Warehouse className="w-6 h-6" />}
            subtitle="Sarana Penunjang"
            color="indigo"
          />
        </div>
        <div onClick={() => onNavigate('/admin/pesan')} className="cursor-pointer">
          <StatCard
            title="Pesan Masuk"
            value={stats.pesanMasuk}
            icon={<Inbox className="w-6 h-6" />}
            subtitle="Belum Dibalas"
            color="rose"
          />
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Distribusi Siswa Berdasarkan Kelas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Peserta Didik per Tingkat</h3>
              <p className="text-xs text-slate-400">Jumlah siswa per rombel kelas</p>
            </div>
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.siswaPerKelas.map(item => {
              const maxSiswa = Math.max(...stats.siswaPerKelas.map(s => s.count), 1);
              const percentage = Math.round((item.count / maxSiswa) * 100);
              return (
                <div key={item.kelas} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.kelas}</span>
                    <span className="text-emerald-700 font-bold">{item.count} Siswa</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Prestasi Berdasarkan Tahun */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statistik Prestasi per Tahun</h3>
              <p className="text-xs text-slate-400">Capaian medali dan kejuaraan siswa</p>
            </div>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.prestasiPerTahun.map(item => {
              const maxPrestasi = Math.max(...stats.prestasiPerTahun.map(p => p.count), 1);
              const percentage = Math.round((item.count / maxPrestasi) * 100);
              return (
                <div key={item.tahun} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Tahun {item.tahun}</span>
                    <span className="text-amber-600 font-bold">{item.count} Prestasi</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Komposisi Tenaga Pendidik & Kependidikan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Komposisi Pendidik & Tenaga Kependidikan</h3>
              <p className="text-xs text-slate-400">Berdasarkan jenis tugas pengabdian</p>
            </div>
            <Users className="w-5 h-5 text-sky-600" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.ptkPerJenis.map(item => {
              const maxPtk = Math.max(...stats.ptkPerJenis.map(p => p.count), 1);
              const percentage = Math.round((item.count / maxPtk) * 100);
              return (
                <div key={item.jenis} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.jenis}</span>
                    <span className="text-sky-700 font-bold">{item.count} Orang</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Publikasi Berita per Bulan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aktivitas Publikasi Berita (Tahun 2026)</h3>
              <p className="text-xs text-slate-400">Intensitas update portal resmi sekolah</p>
            </div>
            <Newspaper className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="grid grid-cols-6 gap-2 pt-4 items-end h-36">
            {stats.beritaPerBulan.map(item => {
              const heightPercent = Math.min(Math.round((item.count / 10) * 100), 100);
              return (
                <div key={item.bulan} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-indigo-600">{item.count}</span>
                  <div
                    className="w-full max-w-[32px] bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-slate-500">{item.bulan}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
