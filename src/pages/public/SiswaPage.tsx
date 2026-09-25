import React, { useEffect, useState, useMemo } from 'react';
import { GraduationCap, Search, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { SearchBar, Pagination, Badge } from '../../components/common/FormControls.tsx';
import { Loading, EmptyState } from '../../components/common/Feedback.tsx';

export const SiswaPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.getStudentsPublic()
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullPage message="Memuat direktori peserta didik..." />;

  const kelasOptions = ['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

  const filteredStudents = students.filter(s => {
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchSearch =
      !search ||
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search);
    return matchKelas && matchSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Peserta Didik
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Direktori Peserta Didik
        </h1>
        <p className="text-sm text-slate-600">
          Informasi publik data rombongan belajar peserta didik UPT SD Negeri 001 Perhentian Raja.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p>
          <strong>Kebijakan Privasi Peserta Didik:</strong> Sesuai undang-undang perlindungan data pribadi anak, data kontak orang tua dan alamat rumah hanya dapat diakses melalui Dashboard Admin resmi oleh operator sekolah berwenang.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {kelasOptions.map(k => (
            <button
              key={k}
              onClick={() => {
                setSelectedKelas(k);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedKelas === k
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={val => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Cari nama atau NIS siswa..."
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {paginatedStudents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Siswa Tidak Ditemukan"
              description="Tidak ada data siswa yang cocok dengan filter atau kata kunci."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">NIS</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">L/P</th>
                  <th className="py-3.5 px-4">Kelas</th>
                  <th className="py-3.5 px-4">Rombel</th>
                  <th className="py-3.5 px-4">Tahun Masuk</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedStudents.map((student, idx) => {
                  const itemIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {itemIndex}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {student.nis}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {student.nama}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {student.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {student.kelas}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-emerald-700">
                        {student.rombel}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {student.tahunMasuk}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={student.status === 'Aktif' ? 'emerald' : 'slate'}>
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredStudents.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
