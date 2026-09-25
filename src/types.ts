export type Role = 'ADMIN' | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  npsn: string;
  nss: string;
  status: 'Negeri' | 'Swasta';
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  akreditasi: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  tahunBerdiri: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  email: string;
  telepon: string;
  whatsapp: string;
  website: string;
  kepalaSekolah: string;
  logo: string;
  fotoSekolah: string;
  deskripsi: string;
  sejarah: string;
}

export interface VisionMission {
  id: string;
  visi: string;
  misi: string[];
  tujuan: string[];
  nilaiNilai: string[];
  programUnggulan: string[];
}

export interface PrincipalMessage {
  id: string;
  nama: string;
  foto: string;
  jabatan: string;
  isiSambutan: string;
  periode: string;
}

export interface OrganizationMember {
  id: string;
  jabatan: string;
  nama: string;
  nip?: string;
  nuptk?: string;
  foto?: string;
  urutan: number;
  deskripsiTugas: string;
  kategori: 'Pimpinan' | 'Komite' | 'Guru' | 'Administrasi';
}

export interface Advantage {
  id: string;
  judul: string;
  icon: string;
  deskripsi: string;
  foto?: string;
  urutan: number;
  statusAktif: boolean;
}

export interface Facility {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  kondisi: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perbaikan';
  foto: string;
}

export interface Extracurricular {
  id: string;
  nama: string;
  pembina: string;
  deskripsi: string;
  jadwal: string;
  tempat: string;
  foto: string;
  prestasi: string;
  statusAktif: boolean;
}

export interface NewsCategory {
  id: string;
  nama: string;
  slug: string;
}

export interface News {
  id: string;
  judul: string;
  slug: string;
  isi: string;
  ringkasan: string;
  thumbnail: string;
  penulis: string;
  kategori: string;
  kategoriId?: string;
  tanggal: string;
  status: 'published' | 'draft';
  views: number;
  featured: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  nama: string;
  namaSiswa: string;
  tingkat: 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  cabang: string;
  juara: string;
  tahun: string;
  tanggal: string;
  pembina: string;
  deskripsi: string;
  foto: string;
}

export interface GalleryCategory {
  id: string;
  nama: string;
}

export interface Gallery {
  id: string;
  judul: string;
  kategori: string;
  tipe: 'foto' | 'video';
  mediaUrl: string;
  deskripsi: string;
  tanggal: string;
  isPublished: boolean;
}

export interface TeacherStaff {
  id: string;
  nama: string;
  nip: string;
  nuptk: string;
  jenisPTK: 'Kepala Sekolah' | 'Guru Kelas' | 'Guru Mata Pelajaran' | 'Guru PJOK' | 'Guru Pendidikan Agama' | 'Tenaga Administrasi' | 'Operator' | 'Pustakawan' | 'Tenaga Kependidikan lainnya';
  jabatan: string;
  mataPelajaran?: string;
  pendidikanTerakhir: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTT' | 'Honorer';
  foto: string;
  email: string;
  telepon?: string;
  tahunMulai: string;
  deskripsiSingkat: string;
}

export interface Subject {
  id: string;
  nama: string;
  kode: string;
  jenjang: string;
  kelas: string;
  guruPengampu: string;
  jumlahJP: number;
  deskripsi: string;
  statusAktif: boolean;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  kelas: string;
  rombel: string;
  tahunMasuk: string;
  status: 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar';
  foto?: string;
  namaOrangTua?: string;
  teleponOrangTua?: string;
  alamat?: string;
}

export interface ContactMessage {
  id: string;
  nama: string;
  email: string;
  telepon?: string;
  subjek: string;
  pesan: string;
  tanggal: string;
  status: 'belum_dibaca' | 'sudah_dibaca' | 'dibalas';
}

export interface WebSettings {
  id: string;
  namaSekolah: string;
  slogan: string;
  logo: string;
  favicon: string;
  alamat: string;
  telepon: string;
  email: string;
  whatsapp: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  website: string;
  heroBanner: string;
  warnaUtama: string;
  copyright: string;
}

export interface DashboardStats {
  totalSiswa: number;
  totalPTK: number;
  totalBerita: number;
  totalPrestasi: number;
  totalGaleri: number;
  totalEkstrakurikuler: number;
  totalFasilitas: number;
  pesanMasuk: number;
  siswaPerKelas: { kelas: string; count: number }[];
  prestasiPerTahun: { tahun: string; count: number }[];
  ptkPerJenis: { jenis: string; count: number }[];
  beritaPerBulan: { bulan: string; count: number }[];
}
