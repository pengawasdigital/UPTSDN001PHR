import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { SchoolProfile } from '../../types.ts';
import { useToast } from '../../components/common/Toast.tsx';
import { FormInput, FormTextarea } from '../../components/common/FormControls.tsx';

interface KontakPageProps {
  profile: SchoolProfile | null;
}

export const KontakPage: React.FC<KontakPageProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    subjek: '',
    pesan: ''
  });
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.subjek || !formData.pesan) {
      toast.error('Mohon lengkapi seluruh kolom yang wajib diisi.');
      return;
    }

    try {
      setSending(true);
      await api.sendContactMessage(formData);
      toast.success('Pesan Anda berhasil dikirim! Pihak sekolah akan segera merespons.');
      setFormData({
        nama: '',
        email: '',
        telepon: '',
        subjek: '',
        pesan: ''
      });
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  const schoolName = profile?.name || 'UPT SD Negeri 001 Perhentian Raja';
  const schoolAddress = profile?.alamat || 'Jl. Raya Pekanbaru - Taluk Kuantan KM 21, Desa Pantai Raja, Kec. Perhentian Raja, Kab. Kampar, Riau 28462';
  const schoolPhone = profile?.telepon || '(0761) 852109';
  const schoolWA = profile?.whatsapp || '081268901234';
  const schoolEmail = profile?.email || 'sdn001perhentianraja@gmail.com';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Layanan Komunikasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Hubungi Kami & Lokasi
        </h1>
        <p className="text-sm text-slate-600">
          Punya pertanyaan seputar PPDB, kegiatan belajar, atau ingin berkunjung ke sekolah? Silakan hubungi kami melalui formulir atau kontak resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Info & Operational Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Informasi Kontak Resmi
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alamat Sekolah</h4>
                  <p className="leading-relaxed mt-0.5">{schoolAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Telepon & WhatsApp</h4>
                  <p className="mt-0.5">{schoolPhone} / {schoolWA}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alamat Email</h4>
                  <p className="mt-0.5">{schoolEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Jam Pelayanan Kantor</h4>
                  <p className="mt-0.5">Senin - Kamis: 07.15 - 14.00 WIB</p>
                  <p>Jumat: 07.15 - 11.30 WIB</p>
                  <p>Sabtu: 07.15 - 13.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map Representation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Peta Lokasi Sekolah</span>
            </h4>
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 relative flex items-center justify-center text-center p-4">
              <iframe
                title="Peta Lokasi Sekolah"
                src="https://maps.google.com/maps?q=Pantai+Raja+Perhentian+Raja+Kampar+Riau&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim Pesan</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Formulir Kontak Pengunjung
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sampaikan kritik, saran, atau permohonan informasi. Pesan Anda akan langsung masuk ke Dashboard Operator Sekolah.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nama Lengkap"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
                <FormInput
                  label="Alamat Email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nomor WhatsApp / HP"
                  value={formData.telepon}
                  onChange={e => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="0812xxxxxxxx (Opsional)"
                />
                <FormInput
                  label="Subjek Pesan"
                  value={formData.subjek}
                  onChange={e => setFormData({ ...formData, subjek: e.target.value })}
                  placeholder="Contoh: Info Pendaftaran PPDB"
                  required
                />
              </div>

              <FormTextarea
                label="Isi Pesan"
                rows={5}
                value={formData.pesan}
                onChange={e => setFormData({ ...formData, pesan: e.target.value })}
                placeholder="Tuliskan pesan, pertanyaan, atau saran Anda secara rinci..."
                required
              />

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirimkan Pesan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Sekarang</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
