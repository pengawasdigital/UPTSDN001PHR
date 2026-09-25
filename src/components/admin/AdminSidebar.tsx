import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Image as ImageIcon,
  Activity,
  Newspaper,
  Trophy,
  Target,
  Network,
  Warehouse,
  Sparkles,
  MessageSquareQuote,
  Users,
  BookOpen,
  GraduationCap,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  unreadCount?: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  onNavigate,
  unreadCount = 0,
  mobileOpen,
  onCloseMobile
}) => {
  const { user, logout, hasRole } = useAuth();

  const handleNav = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Profil Sekolah', path: '/admin/profil', icon: Building2 },
    { label: 'Galeri Media', path: '/admin/galeri', icon: ImageIcon },
    { label: 'Ekstrakurikuler', path: '/admin/ekstrakurikuler', icon: Activity },
    { label: 'Berita & Info', path: '/admin/berita', icon: Newspaper },
    { label: 'Prestasi', path: '/admin/prestasi', icon: Trophy },
    { label: 'Visi & Misi', path: '/admin/visi-misi', icon: Target },
    { label: 'Struktur Organisasi', path: '/admin/struktur-organisasi', icon: Network },
    { label: 'Fasilitas', path: '/admin/fasilitas', icon: Warehouse },
    { label: 'Keunggulan', path: '/admin/keunggulan', icon: Sparkles },
    { label: 'Sambutan Kepala Sekolah', path: '/admin/sambutan', icon: MessageSquareQuote },
    { label: 'Guru & Staf (PTK)', path: '/admin/guru-staf', icon: Users },
    { label: 'Mata Pelajaran', path: '/admin/mata-pelajaran', icon: BookOpen },
    { label: 'Data Siswa', path: '/admin/siswa', icon: GraduationCap },
    {
      label: 'Pesan Masuk',
      path: '/admin/pesan',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Admin Portal</h2>
              <p className="text-[11px] text-emerald-400 font-medium">SDN 001 Perhentian Raja</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-3 my-2 bg-slate-900/90 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  user?.role === 'ADMIN'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {user?.role === 'ADMIN' ? (
                  <Shield className="w-2.5 h-2.5 mr-0.5" />
                ) : (
                  <UserCheck className="w-2.5 h-2.5 mr-0.5" />
                )}
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Menu Manajemen
          </p>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Settings: Accessible only to ADMIN */}
          {hasRole('ADMIN') && (
            <>
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Sistem
              </p>
              <button
                onClick={() => handleNav('/admin/pengaturan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentPath === '/admin/pengaturan'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Website</span>
              </button>
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <button
            onClick={() => handleNav('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website Publik</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
