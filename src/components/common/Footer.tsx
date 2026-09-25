import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import type { SchoolProfile } from '../../types.ts';

interface FooterProps {
  onNavigate: (path: string) => void;
  profile?: SchoolProfile | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, profile }) => {
  const schoolName = profile?.name || 'UPT SD Negeri 001 Perhentian Raja';
  const schoolAddress = profile?.alamat || 'Jl. Raya Pekanbaru - Taluk Kuantan KM 21, Desa Pantai Raja, Kec. Perhentian Raja, Kab. Kampar, Riau 28462';
  const schoolPhone = profile?.telepon || '(0761) 852109';
  const schoolEmail = profile?.email || 'sdn001perhentianraja@gmail.com';

  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">{schoolName}</h3>
                <p className="text-xs text-emerald-400 font-medium">NPSN: {profile?.npsn || '10400341'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mewujudkan generasi berakhlak mulia, berprestasi unggul, adaptif terhadap perkembangan teknologi dan peduli terhadap kelestarian lingkungan hidup.
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('/profil')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Profil & Sejarah Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/visi-misi')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Visi, Misi & Program Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/struktur-organisasi')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Struktur Organisasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/guru-staf')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Direktori Guru & Staf
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/mata-pelajaran')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Mata Pelajaran & Kurikulum
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/siswa')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Direktori Peserta Didik
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Life & Facilities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Kesiswaan & Informasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('/ekstrakurikuler')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Kegiatan Ekstrakurikuler
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/prestasi')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Prestasi Sekolah & Siswa
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/fasilitas')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Fasilitas & Sarana Belajar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/berita')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Berita & Pengumuman Terbaru
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/galeri')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  Galeri Foto & Dokumentasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Kontak Sekolah
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{schoolAddress}</p>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{schoolPhone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{schoolEmail}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Senin - Sabtu: 07.15 - 14.00 WIB</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with mandatory copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 - Website Sekolah. Semua Hak Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('/kontak')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Hubungi Kami
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('/admin/login')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Portal Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
