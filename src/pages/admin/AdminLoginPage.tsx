import React, { useState } from 'react';
import { LogIn, Lock, Mail, GraduationCap, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../components/common/Toast.tsx';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Login berhasil! Selamat datang di Dashboard Admin.');
      onLoginSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Login gagal. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultAdmin = () => {
    setEmail('digitalpengawas@gmail.com');
    setPassword('Asyiella01@');
  };

  const fillDefaultOperator = () => {
    setEmail('basoekyphr25@gmail.com');
    setPassword('Asyiella01@');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div
          onClick={onBackToHome}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-900/40 cursor-pointer mb-4 hover:scale-105 transition-transform"
        >
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Portal Masuk Dashboard
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sistem Informasi Manajemen Sekolah Terpadu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Development Quick Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Akun Uji Coba Default (Development):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={fillDefaultAdmin}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer group"
              >
                <p className="font-bold text-emerald-400 group-hover:text-emerald-300">
                  Role Administrator
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">digitalpengawas@gmail.com</p>
                <span className="text-[9px] text-slate-500 block mt-1">Akses Penuh Semua Menu</span>
              </button>

              <button
                type="button"
                onClick={fillDefaultOperator}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer group"
              >
                <p className="font-bold text-sky-400 group-hover:text-sky-300">
                  Role Operator
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">basoekyphr25@gmail.com</p>
                <span className="text-[9px] text-slate-500 block mt-1">Kelola Konten & Data</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Kembali ke Beranda Sekolah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
