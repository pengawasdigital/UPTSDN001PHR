import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, BookOpen, X, Award } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { TeacherStaff } from '../../types.ts';
import { TeacherCard } from '../../components/common/Cards.tsx';
import { SearchBar } from '../../components/common/FormControls.tsx';
import { Loading, EmptyState } from '../../components/common/Feedback.tsx';
import { Modal } from '../../components/common/Modal.tsx';

export const GuruStafPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherStaff[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [activeTeacher, setActiveTeacher] = useState<TeacherStaff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeachers()
      .then(setTeachers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat dewan guru & staf..." />;

  const roles = [
    'Semua',
    'Kepala Sekolah',
    'Guru Kelas',
    'Guru Mata Pelajaran',
    'Guru PJOK',
    'Guru Pendidikan Agama',
    'Tenaga Administrasi',
    'Operator'
  ];

  const filteredTeachers = teachers.filter(t => {
    const matchRole = selectedRole === 'Semua' || t.jenisPTK === selectedRole;
    const matchSearch =
      !search ||
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.jabatan.toLowerCase().includes(search.toLowerCase()) ||
      (t.mataPelajaran && t.mataPelajaran.toLowerCase().includes(search.toLowerCase()));
    return matchRole && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Pendidik & Tenaga Kependidikan
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Direktori Guru & Staf (PTK)
        </h1>
        <p className="text-sm text-slate-600">
          Profil tenaga pendidik dan kependidikan berdedikasi tinggi, berintegritas, dan berkompeten di {teachers.length} bidang pengabdian.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === r
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari nama atau mata pelajaran..."
        />
      </div>

      {/* Grid */}
      {filteredTeachers.length === 0 ? (
        <EmptyState
          title="Data Tidak Ditemukan"
          description="Tidak ada guru atau staf yang cocok dengan kriteria pencarian Anda."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeachers.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onDetail={() => setActiveTeacher(teacher)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeTeacher && (
        <Modal
          isOpen={!!activeTeacher}
          onClose={() => setActiveTeacher(null)}
          title="Profil Guru / Tenaga Kependidikan"
          maxWidth="md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md ring-4 ring-emerald-50 shrink-0 bg-slate-100">
                <img
                  src={activeTeacher.foto}
                  alt={activeTeacher.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{activeTeacher.nama}</h3>
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                  {activeTeacher.jabatan}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Status: {activeTeacher.statusKepegawaian}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 bg-slate-50 p-4 rounded-2xl">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">NIP</span>
                <span className="font-semibold text-slate-800">{activeTeacher.nip || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">NUPTK</span>
                <span className="font-semibold text-slate-800">{activeTeacher.nuptk || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Pendidikan Terakhir</span>
                <span className="font-semibold text-slate-800">{activeTeacher.pendidikanTerakhir}</span>
              </div>
              {activeTeacher.mataPelajaran && activeTeacher.mataPelajaran !== '-' && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Mata Pelajaran</span>
                  <span className="font-semibold text-slate-800">{activeTeacher.mataPelajaran}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tahun Mulai Tugas</span>
                <span className="font-semibold text-slate-800">{activeTeacher.tahunMulai}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">{activeTeacher.email}</span>
              </div>
            </div>

            {activeTeacher.deskripsiSingkat && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Motto / Deskripsi:</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  "{activeTeacher.deskripsiSingkat}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
