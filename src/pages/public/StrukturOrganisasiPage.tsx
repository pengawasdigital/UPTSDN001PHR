import React, { useEffect, useState } from 'react';
import { Network, Users, Award, Shield } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { OrganizationMember } from '../../types.ts';
import { Loading } from '../../components/common/Feedback.tsx';

export const StrukturOrganisasiPage: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrganization()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat struktur organisasi..." />;

  const pimpinan = members.filter(m => m.kategori === 'Pimpinan');
  const komite = members.filter(m => m.kategori === 'Komite');
  const administrasi = members.filter(m => m.kategori === 'Administrasi');
  const guru = members.filter(m => m.kategori === 'Guru');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Tata Kelola Sekolah
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Struktur Organisasi Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Bagan susunan kepemimpinan, komite, tenaga pengajar, dan staf administrasi UPT SD Negeri 001 Perhentian Raja.
        </p>
      </div>

      {/* Visual Organizational Hierarchy Tree */}
      <div className="space-y-12">
        {/* Level 1: Kepala Sekolah & Komite */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
            Pimpinan Sekolah & Komite
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {pimpinan.slice(0, 1).map(member => (
              <div
                key={member.id}
                className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-lg text-center space-y-3 relative"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Top Leader
                </span>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-emerald-100 bg-slate-100">
                  <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{member.nama}</h4>
                  <p className="text-xs font-semibold text-emerald-700">{member.jabatan}</p>
                  {member.nip && member.nip !== '-' && (
                    <p className="text-[11px] text-slate-400 mt-0.5">NIP: {member.nip}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  {member.deskripsiTugas}
                </p>
              </div>
            ))}

            {komite.map(member => (
              <div
                key={member.id}
                className="w-full max-w-sm bg-white rounded-3xl p-6 border border-amber-300 shadow-md text-center space-y-3 relative"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Mitra Sekolah
                </span>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-amber-100 bg-slate-100">
                  <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{member.nama}</h4>
                  <p className="text-xs font-semibold text-amber-700">{member.jabatan}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  {member.deskripsiTugas}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2: Wakil Kepala & Koordinator */}
        {pimpinan.length > 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
              Wakil Kepala & Koordinator Bidang
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pimpinan.slice(1).map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs text-center space-y-3"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-4 ring-slate-100 bg-slate-100">
                    <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{member.nama}</h4>
                    <p className="text-xs font-semibold text-emerald-700">{member.jabatan}</p>
                    {member.nip && member.nip !== '-' && (
                      <p className="text-[11px] text-slate-400 mt-0.5">NIP: {member.nip}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5">
                    {member.deskripsiTugas}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level 3: Administrasi & Tata Usaha */}
        {administrasi.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
              Tata Usaha & Layanan Administrasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {administrasi.map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs text-center space-y-3"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-4 ring-slate-100 bg-slate-100">
                    <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{member.nama}</h4>
                    <p className="text-xs font-semibold text-sky-700">{member.jabatan}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5">
                    {member.deskripsiTugas}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
