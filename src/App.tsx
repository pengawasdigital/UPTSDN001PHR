import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider, useToast } from './components/common/Toast.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { AdminSidebar } from './components/admin/AdminSidebar.tsx';
import { AdminHeader } from './components/admin/AdminHeader.tsx';
import { api } from './services/api.ts';
import type { SchoolProfile } from './types.ts';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { ProfilPage } from './pages/public/ProfilPage.tsx';
import { VisiMisiPage } from './pages/public/VisiMisiPage.tsx';
import { SambutanPage } from './pages/public/SambutanPage.tsx';
import { StrukturOrganisasiPage } from './pages/public/StrukturOrganisasiPage.tsx';
import { KeunggulanPage } from './pages/public/KeunggulanPage.tsx';
import { FasilitasPage } from './pages/public/FasilitasPage.tsx';
import { EkstrakurikulerPage } from './pages/public/EkstrakurikulerPage.tsx';
import { PrestasiPage } from './pages/public/PrestasiPage.tsx';
import { BeritaPage } from './pages/public/BeritaPage.tsx';
import { BeritaDetailPage } from './pages/public/BeritaDetailPage.tsx';
import { GaleriPage } from './pages/public/GaleriPage.tsx';
import { GuruStafPage } from './pages/public/GuruStafPage.tsx';
import { MataPelajaranPage } from './pages/public/MataPelajaranPage.tsx';
import { SiswaPage } from './pages/public/SiswaPage.tsx';
import { KontakPage } from './pages/public/KontakPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminProfilPage } from './pages/admin/AdminProfilPage.tsx';
import { AdminSambutanPage } from './pages/admin/AdminSambutanPage.tsx';
import { AdminVisiMisiPage } from './pages/admin/AdminVisiMisiPage.tsx';
import { AdminStrukturPage } from './pages/admin/AdminStrukturPage.tsx';
import { AdminKeunggulanPage } from './pages/admin/AdminKeunggulanPage.tsx';
import { AdminBeritaPage } from './pages/admin/AdminBeritaPage.tsx';
import { AdminPrestasiPage } from './pages/admin/AdminPrestasiPage.tsx';
import { AdminGaleriPage } from './pages/admin/AdminGaleriPage.tsx';
import { AdminEkstrakurikulerPage } from './pages/admin/AdminEkstrakurikulerPage.tsx';
import { AdminFasilitasPage } from './pages/admin/AdminFasilitasPage.tsx';
import { AdminGuruStafPage } from './pages/admin/AdminGuruStafPage.tsx';
import { AdminMataPelajaranPage } from './pages/admin/AdminMataPelajaranPage.tsx';
import { AdminSiswaPage } from './pages/admin/AdminSiswaPage.tsx';
import { AdminPesanPage } from './pages/admin/AdminPesanPage.tsx';
import { AdminPengaturanPage } from './pages/admin/AdminPengaturanPage.tsx';

import { Loading, ErrorState } from './components/common/Feedback.tsx';

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [adminMobileOpen, setAdminMobileOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const { isAuthenticated, loading: authLoading, user, hasRole } = useAuth();
  const toast = useToast();

  // Load school profile & unread message count
  useEffect(() => {
    api.getSchoolProfile()
      .then(setProfile)
      .catch(console.error);

    if (isAuthenticated) {
      api.getContactMessages()
        .then(msgs => {
          const unread = msgs.filter(m => m.status === 'belum_dibaca').length;
          setUnreadMessagesCount(unread);
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // Handle browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic SEO title
  useEffect(() => {
    const baseTitle = profile?.name || 'UPT SD Negeri 001 Perhentian Raja';
    let pageTitle = baseTitle;

    if (currentPath === '/') pageTitle = `${baseTitle} | Website Resmi Sekolah`;
    else if (currentPath === '/profil') pageTitle = `Profil Sekolah | ${baseTitle}`;
    else if (currentPath === '/visi-misi') pageTitle = `Visi & Misi | ${baseTitle}`;
    else if (currentPath === '/sambutan-kepala-sekolah') pageTitle = `Sambutan Kepala Sekolah | ${baseTitle}`;
    else if (currentPath === '/struktur-organisasi') pageTitle = `Struktur Organisasi | ${baseTitle}`;
    else if (currentPath === '/keunggulan') pageTitle = `Keunggulan Sekolah | ${baseTitle}`;
    else if (currentPath === '/fasilitas') pageTitle = `Fasilitas & Sarana | ${baseTitle}`;
    else if (currentPath === '/ekstrakurikuler') pageTitle = `Ekstrakurikuler | ${baseTitle}`;
    else if (currentPath === '/prestasi') pageTitle = `Prestasi Sekolah & Siswa | ${baseTitle}`;
    else if (currentPath === '/berita') pageTitle = `Berita & Pengumuman | ${baseTitle}`;
    else if (currentPath === '/galeri') pageTitle = `Galeri Foto & Video | ${baseTitle}`;
    else if (currentPath === '/guru-staf') pageTitle = `Direktori Guru & Staf (PTK) | ${baseTitle}`;
    else if (currentPath === '/mata-pelajaran') pageTitle = `Kurikulum & Mata Pelajaran | ${baseTitle}`;
    else if (currentPath === '/siswa') pageTitle = `Direktori Peserta Didik | ${baseTitle}`;
    else if (currentPath === '/kontak') pageTitle = `Kontak & Lokasi | ${baseTitle}`;
    else if (currentPath.startsWith('/admin')) pageTitle = `Dashboard Manajemen | ${baseTitle}`;

    document.title = pageTitle;
  }, [currentPath, profile]);

  if (authLoading) {
    return <Loading fullPage message="Memulai aplikasi sekolah..." />;
  }

  // Admin Login Screen
  if (currentPath === '/admin/login') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => navigate('/admin')}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  // Protected Admin Area
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onBackToHome={() => navigate('/')}
        />
      );
    }

    // Role check for Settings: restricted to ADMIN
    if (currentPath === '/admin/pengaturan' && !hasRole('ADMIN')) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-4">
            <h3 className="text-lg font-bold text-rose-400">Akses Dibatasi (Forbidden)</h3>
            <p className="text-xs text-slate-400">
              Menu Pengaturan Sistem hanya dapat diakses oleh akun dengan Role Administrator.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Kembali ke Dashboard Admin
            </button>
          </div>
        </div>
      );
    }

    let adminTitle = 'Dashboard Utama';
    let adminSubtitle = 'Ringkasan data operasional sekolah';
    let AdminContent = <AdminDashboardPage onNavigate={navigate} />;

    if (currentPath === '/admin/profil') {
      adminTitle = 'Profil Sekolah';
      adminSubtitle = 'Identitas resmi, akreditasi, dan sejarah';
      AdminContent = <AdminProfilPage />;
    } else if (currentPath === '/admin/sambutan') {
      adminTitle = 'Sambutan Kepala Sekolah';
      adminSubtitle = 'Pesan sambutan resmi untuk pengunjung';
      AdminContent = <AdminSambutanPage />;
    } else if (currentPath === '/admin/visi-misi') {
      adminTitle = 'Visi, Misi & Tujuan';
      adminSubtitle = 'Pedoman filosofis dan sasaran mutu';
      AdminContent = <AdminVisiMisiPage />;
    } else if (currentPath === '/admin/struktur-organisasi') {
      adminTitle = 'Struktur Organisasi';
      adminSubtitle = 'Susunan pimpinan, komite, dan administrasi';
      AdminContent = <AdminStrukturPage />;
    } else if (currentPath === '/admin/keunggulan') {
      adminTitle = 'Keunggulan Sekolah';
      adminSubtitle = 'Poin diferensiasi mutu pendidikan';
      AdminContent = <AdminKeunggulanPage />;
    } else if (currentPath === '/admin/berita') {
      adminTitle = 'Berita & Pengumuman';
      adminSubtitle = 'Publikasi artikel dan agenda resmi sekolah';
      AdminContent = <AdminBeritaPage />;
    } else if (currentPath === '/admin/prestasi') {
      adminTitle = 'Prestasi Siswa & Sekolah';
      adminSubtitle = 'Arsip medali kejuaraan dan capaian membanggakan';
      AdminContent = <AdminPrestasiPage />;
    } else if (currentPath === '/admin/galeri') {
      adminTitle = 'Galeri Media';
      adminSubtitle = 'Koleksi dokumentasi foto dan video kegiatan';
      AdminContent = <AdminGaleriPage />;
    } else if (currentPath === '/admin/ekstrakurikuler') {
      adminTitle = 'Ekstrakurikuler';
      adminSubtitle = 'Kegiatan pembinaan minat dan bakat siswa';
      AdminContent = <AdminEkstrakurikulerPage />;
    } else if (currentPath === '/admin/fasilitas') {
      adminTitle = 'Sarana & Fasilitas';
      adminSubtitle = 'Inventaris ruang kelas, lab, dan sarana penunjang';
      AdminContent = <AdminFasilitasPage />;
    } else if (currentPath === '/admin/guru-staf') {
      adminTitle = 'Guru & Tenaga Kependidikan';
      adminSubtitle = 'Database PTK, NIP, status kepegawaian, dan import/export Excel (XLSX)';
      AdminContent = <AdminGuruStafPage />;
    } else if (currentPath === '/admin/mata-pelajaran') {
      adminTitle = 'Mata Pelajaran & Kurikulum';
      adminSubtitle = 'Alokasi jam pelajaran (JP) dan guru pengampu';
      AdminContent = <AdminMataPelajaranPage />;
    } else if (currentPath === '/admin/siswa') {
      adminTitle = 'Database Peserta Didik';
      adminSubtitle = 'Buku induk siswa, rombel kelas, dan import/export Excel (XLSX)';
      AdminContent = <AdminSiswaPage />;
    } else if (currentPath === '/admin/pesan') {
      adminTitle = 'Kotak Masuk Pesan Pengunjung';
      adminSubtitle = 'Pertanyaan dan aspirasi masyarakat melalui formulir kontak';
      AdminContent = <AdminPesanPage />;
    } else if (currentPath === '/admin/pengaturan') {
      adminTitle = 'Pengaturan Website';
      adminSubtitle = 'Branding, logo, sosmed, kontak resmi, dan copyright';
      AdminContent = <AdminPengaturanPage />;
    }

    return (
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar
          currentPath={currentPath}
          onNavigate={navigate}
          unreadCount={unreadMessagesCount}
          mobileOpen={adminMobileOpen}
          onCloseMobile={() => setAdminMobileOpen(false)}
        />
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <AdminHeader
            title={adminTitle}
            subtitle={adminSubtitle}
            onOpenMobileMenu={() => setAdminMobileOpen(true)}
            onNavigate={navigate}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {AdminContent}
          </main>
        </div>
      </div>
    );
  }

  // Detail Berita Route (/berita/:slug)
  if (currentPath.startsWith('/berita/')) {
    const slug = currentPath.replace('/berita/', '');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar currentPath={currentPath} onNavigate={navigate} profile={profile} />
        <main className="flex-1">
          <BeritaDetailPage slug={slug} onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} profile={profile} />
      </div>
    );
  }

  // Public Routes Mapping
  let PublicPageContent = <HomePage onNavigate={navigate} profile={profile} />;

  if (currentPath === '/profil') {
    PublicPageContent = <ProfilPage />;
  } else if (currentPath === '/visi-misi') {
    PublicPageContent = <VisiMisiPage />;
  } else if (currentPath === '/sambutan-kepala-sekolah') {
    PublicPageContent = <SambutanPage />;
  } else if (currentPath === '/struktur-organisasi') {
    PublicPageContent = <StrukturOrganisasiPage />;
  } else if (currentPath === '/keunggulan') {
    PublicPageContent = <KeunggulanPage />;
  } else if (currentPath === '/fasilitas') {
    PublicPageContent = <FasilitasPage />;
  } else if (currentPath === '/ekstrakurikuler') {
    PublicPageContent = <EkstrakurikulerPage />;
  } else if (currentPath === '/prestasi') {
    PublicPageContent = <PrestasiPage />;
  } else if (currentPath === '/berita') {
    PublicPageContent = <BeritaPage onNavigate={navigate} />;
  } else if (currentPath === '/galeri') {
    PublicPageContent = <GaleriPage />;
  } else if (currentPath === '/guru-staf') {
    PublicPageContent = <GuruStafPage />;
  } else if (currentPath === '/mata-pelajaran') {
    PublicPageContent = <MataPelajaranPage />;
  } else if (currentPath === '/siswa') {
    PublicPageContent = <SiswaPage />;
  } else if (currentPath === '/kontak') {
    PublicPageContent = <KontakPage profile={profile} />;
  } else if (currentPath !== '/') {
    // 404 Not Found Page
    PublicPageContent = (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan salah.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Kembali ke Beranda Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar currentPath={currentPath} onNavigate={navigate} profile={profile} />
      <main className="flex-1">{PublicPageContent}</main>
      <Footer onNavigate={navigate} profile={profile} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
