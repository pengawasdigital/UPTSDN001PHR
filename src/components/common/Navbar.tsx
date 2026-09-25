import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  LogIn,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { SchoolProfile } from '../../types.ts';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  profile?: SchoolProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [academicDropdown, setAcademicDropdown] = useState(false);
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setProfileDropdown(false);
    setAcademicDropdown(false);
    setStudentDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const schoolName = profile?.name || 'UPT SD Negeri 001 Perhentian Raja';
  const schoolPhone = profile?.telepon || '(0761) 852109';
  const schoolEmail = profile?.email || 'sdn001perhentianraja@gmail.com';

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Perhentian Raja, Kampar, Riau
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {schoolPhone}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {schoolEmail}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Akreditasi {profile?.akreditasi || 'A'}
            </span>
            {isAuthenticated ? (
              <button
                onClick={() => handleNav('/admin')}
                className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Dashboard ({user?.role})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login Operator</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`transition-all duration-200 ${isScrolled ? 'py-2.5' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight block">
                {schoolName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                NPSN: {profile?.npsn || '10400341'} • Unggul & Berkarakter
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            {/* Dropdown: Profil */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdown(!profileDropdown);
                  setAcademicDropdown(false);
                  setStudentDropdown(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  ['/profil', '/visi-misi', '/sambutan-kepala-sekolah', '/struktur-organisasi', '/keunggulan'].includes(
                    currentPath
                  )
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <span>Profil</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {profileDropdown && (
                <div
                  onMouseLeave={() => setProfileDropdown(false)}
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    onClick={() => handleNav('/profil')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Profil Lengkap & Sejarah
                  </button>
                  <button
                    onClick={() => handleNav('/sambutan-kepala-sekolah')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Sambutan Kepala Sekolah
                  </button>
                  <button
                    onClick={() => handleNav('/visi-misi')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Visi, Misi & Nilai
                  </button>
                  <button
                    onClick={() => handleNav('/struktur-organisasi')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Struktur Organisasi
                  </button>
                  <button
                    onClick={() => handleNav('/keunggulan')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Keunggulan Sekolah
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Direktori Akademik */}
            <div className="relative">
              <button
                onClick={() => {
                  setAcademicDropdown(!academicDropdown);
                  setProfileDropdown(false);
                  setStudentDropdown(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  ['/guru-staf', '/mata-pelajaran', '/siswa'].includes(currentPath)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {academicDropdown && (
                <div
                  onMouseLeave={() => setAcademicDropdown(false)}
                  className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    onClick={() => handleNav('/guru-staf')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Guru & Tenaga Kependidikan
                  </button>
                  <button
                    onClick={() => handleNav('/mata-pelajaran')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Kurikulum & Mata Pelajaran
                  </button>
                  <button
                    onClick={() => handleNav('/siswa')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Direktori Peserta Didik
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Kesiswaan & Fasilitas */}
            <div className="relative">
              <button
                onClick={() => {
                  setStudentDropdown(!studentDropdown);
                  setProfileDropdown(false);
                  setAcademicDropdown(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  ['/ekstrakurikuler', '/prestasi', '/fasilitas'].includes(currentPath)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <span>Kesiswaan</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {studentDropdown && (
                <div
                  onMouseLeave={() => setStudentDropdown(false)}
                  className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    onClick={() => handleNav('/ekstrakurikuler')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Ekstrakurikuler
                  </button>
                  <button
                    onClick={() => handleNav('/prestasi')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Prestasi Sekolah
                  </button>
                  <button
                    onClick={() => handleNav('/fasilitas')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Sarana & Fasilitas
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/berita')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPath.startsWith('/berita')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Berita
            </button>

            <button
              onClick={() => handleNav('/galeri')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === '/galeri'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Galeri
            </button>

            <button
              onClick={() => handleNav('/kontak')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === '/kontak'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Kontak
            </button>
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Beranda
          </button>

          <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Profil Sekolah
          </div>
          <button
            onClick={() => handleNav('/profil')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Profil Lengkap & Sejarah
          </button>
          <button
            onClick={() => handleNav('/sambutan-kepala-sekolah')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Sambutan Kepala Sekolah
          </button>
          <button
            onClick={() => handleNav('/visi-misi')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Visi, Misi & Nilai
          </button>
          <button
            onClick={() => handleNav('/struktur-organisasi')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Struktur Organisasi
          </button>
          <button
            onClick={() => handleNav('/keunggulan')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Keunggulan Sekolah
          </button>

          <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Akademik & Siswa
          </div>
          <button
            onClick={() => handleNav('/guru-staf')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Guru & Tenaga Kependidikan
          </button>
          <button
            onClick={() => handleNav('/mata-pelajaran')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Mata Pelajaran & Kurikulum
          </button>
          <button
            onClick={() => handleNav('/siswa')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Direktori Siswa (Publik)
          </button>
          <button
            onClick={() => handleNav('/ekstrakurikuler')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Ekstrakurikuler
          </button>
          <button
            onClick={() => handleNav('/prestasi')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Prestasi Siswa & Sekolah
          </button>
          <button
            onClick={() => handleNav('/fasilitas')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Fasilitas Sekolah
          </button>

          <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Informasi
          </div>
          <button
            onClick={() => handleNav('/berita')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Berita & Pengumuman
          </button>
          <button
            onClick={() => handleNav('/galeri')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Galeri Foto & Video
          </button>
          <button
            onClick={() => handleNav('/kontak')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Hubungi Kami & Peta
          </button>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => handleNav('/admin')}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Masuk ke Dashboard Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Dashboard Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
