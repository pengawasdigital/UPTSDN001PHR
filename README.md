# Website Sekolah Digital - UPT SD Negeri 001 Perhentian Raja

Aplikasi Website Resmi Sekolah Modern dan Sistem Informasi Manajemen Sekolah Terpadu dengan Portal Publik Responsif dan Dashboard Admin Profesional untuk pengelolaan seluruh modul data tanpa perlu mengubah kode program.

---

## 1. Teknologi yang Digunakan

* **Frontend**: React 19 + TypeScript, Tailwind CSS, Lucide React
* **Backend**: Node.js + Express
* **Database**: Firebase Firestore (`firebase-applet-config.json` & `firestore.rules`) dengan auto-sync data awal dan penyimpanan cloud persisten. Tidak lagi memerlukan konfigurasi `DATABASE_URL`!
* **Authentication**: Firebase Authentication & Secure Session Token (Password Hashing `bcryptjs`, RBAC: `ADMIN` & `OPERATOR`). Tidak memerlukan `JWT_SECRET` manual karena secret di-generate dan diamankan secara server-side!
* **Import & Export**: Excel / CSV Engine (`xlsx`) dengan validasi baris & kolom otomatis
* **Media Upload**: File validator (JPG, JPEG, PNG, WEBP dengan limit 5 MB)

---

## 2. Struktur Folder Project

```
├── .env.example                       # Contoh environment variables
├── index.html                         # Entry point HTML & SEO meta
├── metadata.json                      # Metadata aplikasi
├── package.json                       # Dependencies & scripts
├── prisma/
│   └── schema.prisma                  # PostgreSQL database schema untuk Prisma
├── railway.json                       # Konfigurasi deployment Railway
├── server.ts                          # Full-stack server entry point (Express + Vite)
├── server/
│   ├── auth.ts                        # JWT verification & RBAC middleware
│   ├── db.ts                          # Database store & repository layer
│   ├── seedData.ts                    # Data awal sekolah realistis
│   └── routes/
│       ├── auth.routes.ts             # Route login, session me, logout
│       ├── school.routes.ts           # Route profil, visi-misi, sambutan, settings, statistik
│       ├── content.routes.ts          # Route berita, prestasi, galeri, ekskul, fasilitas, organisasi
│       ├── academic.routes.ts         # Route PTK, mata pelajaran, siswa (import/export)
│       ├── contact.routes.ts          # Route form kontak publik & pesan admin
│       └── upload.routes.ts           # Route upload foto & validasi media
└── src/
    ├── App.tsx                        # Router utama & view dispatcher
    ├── main.tsx                       # React DOM render
    ├── index.css                      # Tailwind CSS entry point
    ├── types.ts                       # TypeScript interfaces untuk seluruh modul
    ├── context/
    │   └── AuthContext.tsx            # Context otentikasi & hak akses pengguna
    ├── services/
    │   └── api.ts                     # HTTP client & local token storage
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx             # Navigasi publik responsif + drawer mobile
    │   │   ├── Footer.tsx             # Footer resmi sekolah
    │   │   ├── Cards.tsx              # NewsCard, AchievementCard, GalleryCard, dll.
    │   │   ├── DataTable.tsx          # Tabel data interaktif + pencarian + pagination
    │   │   ├── FormControls.tsx       # FormInput, FormSelect, SearchBar, Pagination, Badge
    │   │   ├── ImageUploader.tsx      # Upload media lokal & tautan URL
    │   │   ├── Modal.tsx              # Dialog modal & konfirmasi hapus
    │   │   ├── Feedback.tsx           # Loading, EmptyState, ErrorState
    │   │   └── Toast.tsx              # Notifikasi popup real-time
    │   └── admin/
    │       ├── AdminSidebar.tsx       # Sidebar dashboard + role badge + counter pesan
    │       └── AdminHeader.tsx        # Top bar admin + breadcrumbs
    └── pages/
        ├── public/                    # 15 Halaman Portal Publik
        └── admin/                     # 17 Modul Dashboard Admin
```

---

## 3. Daftar Route Aplikasi

### Halaman Publik (Tanpa Login)
* `/` : Beranda (Hero Banner, Sambutan, Profil Singkat, Statistik, Keunggulan, Berita, Prestasi, Ekskul, Fasilitas, Galeri, CTA)
* `/profil` : Profil Lengkap, NPSN, NSS, Akreditasi, Status, Sejarah
* `/visi-misi` : Visi, Misi, Tujuan, Nilai Budaya, Program Unggulan
* `/sambutan-kepala-sekolah` : Sambutan resmi Kepala Sekolah
* `/struktur-organisasi` : Bagan visual hierarki organisasi sekolah
* `/keunggulan` : Daftar keunggulan dan daya tarik pendidikan
* `/fasilitas` : Sarana & fasilitas sekolah beserta kondisi
* `/ekstrakurikuler` : Kegiatan pembinaan minat & bakat
* `/prestasi` : Prestasi siswa dengan filter tingkat dan tahun
* `/berita` : Portal berita & pengumuman dengan kategori & pencarian
* `/berita/:slug` : Halaman artikel berita lengkap & berita terkait
* `/galeri` : Galeri foto & video dengan filter kategori dan lightbox
* `/guru-staf` : Direktori guru & staf (PTK) dengan detail profil
* `/mata-pelajaran` : Kurikulum dan struktur mata pelajaran & JP
* `/siswa` : Direktori siswa publik (aman: tanpa nomor telepon/alamat orang tua)
* `/kontak` : Informasi kontak, jam operasional, peta, dan form kirim pesan

### Halaman Dashboard Admin & Operator
* `/admin/login` : Halaman login autentikasi aman
* `/admin` : Ringkasan dashboard, 8 metrik utama, dan 4 grafik analitik
* `/admin/profil` : Kelola profil dan sejarah sekolah
* `/admin/sambutan` : Kelola sambutan kepala sekolah
* `/admin/visi-misi` : Kelola visi, misi, dan tujuan
* `/admin/struktur-organisasi` : CRUD bagan struktur organisasi
* `/admin/keunggulan` : CRUD keunggulan sekolah
* `/admin/berita` : CRUD berita & artikel informasi
* `/admin/prestasi` : CRUD data prestasi siswa
* `/admin/galeri` : CRUD galeri media & upload gambar
* `/admin/ekstrakurikuler` : CRUD data ekstrakurikuler
* `/admin/fasilitas` : CRUD sarana & fasilitas sekolah
* `/admin/guru-staf` : CRUD PTK + Import CSV/Excel + Export CSV
* `/admin/mata-pelajaran` : CRUD mata pelajaran
* `/admin/siswa` : CRUD buku induk siswa + Import CSV/Excel + Export CSV
* `/admin/pesan` : Manajemen kotak masuk pesan pengunjung
* `/admin/pengaturan` : Pengaturan website (khusus Role `ADMIN`)

---

## 4. Daftar REST API Endpoints

### Otentikasi
* `POST /api/auth/login` - Login pengguna (mengembalikan JWT token)
* `GET /api/auth/me` - Ambil profil pengguna yang sedang login
* `POST /api/auth/logout` - Logout pengguna

### Profil & Informasi Lembaga
* `GET /api/school-profile` - Ambil profil sekolah
* `PUT /api/school-profile` - Update profil sekolah *(Auth)*
* `GET /api/vision-mission` - Ambil visi dan misi
* `PUT /api/vision-mission` - Update visi dan misi *(Auth)*
* `GET /api/principal-message` - Ambil sambutan kepala sekolah
* `PUT /api/principal-message` - Update sambutan *(Auth)*
* `GET /api/settings` - Ambil konfigurasi website
* `PUT /api/settings` - Update konfigurasi website *(Auth: ADMIN only)*
* `GET /api/dashboard/stats` - Statistik metrik dan grafik dashboard *(Auth)*

### Konten & Publikasi
* `GET /api/news` - Daftar artikel berita (filter kategori & status)
* `GET /api/news/:idOrSlug` - Detail berita berdasarkan slug/ID
* `POST /api/news` - Tambah berita *(Auth)*
* `PUT /api/news/:id` - Update berita *(Auth)*
* `DELETE /api/news/:id` - Hapus berita *(Auth)*
* `GET /api/achievements` - Daftar prestasi
* `POST /api/achievements` - Tambah prestasi *(Auth)*
* `PUT /api/achievements/:id` - Update prestasi *(Auth)*
* `DELETE /api/achievements/:id` - Hapus prestasi *(Auth)*
* `GET /api/galleries` - Daftar media galeri
* `POST /api/galleries` - Tambah foto/video galeri *(Auth)*
* `PUT /api/galleries/:id` - Update galeri *(Auth)*
* `DELETE /api/galleries/:id` - Hapus galeri *(Auth)*
* `GET /api/extracurriculars` - Daftar ekstrakurikuler
* `POST /api/extracurriculars` - Tambah ekstrakurikuler *(Auth)*
* `PUT /api/extracurriculars/:id` - Update ekstrakurikuler *(Auth)*
* `DELETE /api/extracurriculars/:id` - Hapus ekstrakurikuler *(Auth)*
* `GET /api/facilities` - Daftar fasilitas
* `POST /api/facilities` - Tambah fasilitas *(Auth)*
* `PUT /api/facilities/:id` - Update fasilitas *(Auth)*
* `DELETE /api/facilities/:id` - Hapus fasilitas *(Auth)*
* `GET /api/organization` - Daftar anggota organisasi
* `POST /api/organization` - Tambah anggota organisasi *(Auth)*
* `PUT /api/organization/:id` - Update anggota organisasi *(Auth)*
* `DELETE /api/organization/:id` - Hapus anggota organisasi *(Auth)*

### Akademik & Kesiswaan
* `GET /api/teachers` - Daftar guru & staf
* `POST /api/teachers` - Tambah PTK *(Auth)*
* `PUT /api/teachers/:id` - Update PTK *(Auth)*
* `DELETE /api/teachers/:id` - Hapus PTK *(Auth)*
* `POST /api/teachers/import` - Import data PTK via CSV *(Auth)*
* `GET /api/teachers/export` - Export data PTK ke file CSV *(Auth)*
* `GET /api/subjects` - Daftar mata pelajaran
* `POST /api/subjects` - Tambah mata pelajaran *(Auth)*
* `PUT /api/subjects/:id` - Update mata pelajaran *(Auth)*
* `DELETE /api/subjects/:id` - Hapus mata pelajaran *(Auth)*
* `GET /api/students/public` - Direktori siswa publik (aman)
* `GET /api/students` - Direktori siswa lengkap *(Auth)*
* `POST /api/students` - Tambah siswa *(Auth)*
* `PUT /api/students/:id` - Update siswa *(Auth)*
* `DELETE /api/students/:id` - Hapus siswa *(Auth)*
* `POST /api/students/import` - Import data siswa via CSV *(Auth)*
* `GET /api/students/export` - Export data siswa ke file CSV *(Auth)*

### Kontak & Upload
* `POST /api/contact` - Kirim pesan dari form kontak publik
* `GET /api/contact` - Daftar pesan masuk *(Auth)*
* `PUT /api/contact/:id/status` - Ubah status pesan *(Auth)*
* `DELETE /api/contact/:id` - Hapus pesan *(Auth)*
* `POST /api/upload` - Upload gambar (JPG, PNG, WEBP <= 5 MB) *(Auth)*

---

## 5. Environment Variables

Database Firestore dan autentikasi telah terintegrasi secara otomatis via `firebase-applet-config.json`. Anda **TIDAK PERLU** lagi mengisi `DATABASE_URL` ataupun `JWT_SECRET`.

Contoh file `.env`:

```env
PORT=3000

# Akun Login (Default siap pakai)
ADMIN_EMAIL="digitalpengawas@gmail.com"
ADMIN_PASSWORD="Asyiella01@"

OPERATOR_EMAIL="basoekyphr25@gmail.com"
OPERATOR_PASSWORD="Asyiella01@"
```

---

## 6. Akun Default untuk Pengujian & Akses Admin

Tersedia 2 akun resmi yang telah dikonfigurasi dan aktif:

| Role | Email | Password | Hak Akses |
|---|---|---|---|
| **ADMIN** | `digitalpengawas@gmail.com` | `Asyiella01@` | Akses penuh ke seluruh modul & Pengaturan Sistem Website |
| **OPERATOR** | `basoekyphr25@gmail.com` | `Asyiella01@` | Akses manajemen konten, akademik, kesiswaan & kotak masuk pesan |

---

## 7. Cara Menjalankan Secara Lokal

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan aplikasi (Development)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada `http://localhost:3000`.

3. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

4. **Jalankan Produksi**:
   ```bash
   npm run start
   ```

---

## 8. Cara Deploy ke Railway

Aplikasi ini telah dikonfigurasi penuh dan siap dideploy ke **Railway**:

1. Buat project baru di [Railway.app](https://railway.app).
2. Tambahkan database **PostgreSQL** dari menu *Add Service -> Database -> PostgreSQL*.
3. Hubungkan repositori GitHub aplikasi ke Railway service.
4. Pada tab **Variables** di Railway service aplikasi:
   * Masukkan variable `DATABASE_URL` dengan reference `${{Postgres.DATABASE_URL}}`.
   * Atur `JWT_SECRET`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD`.
5. Railway akan mendeteksi `railway.json` secara otomatis, mengeksekusi `npm run build`, dan menjalankan server via `npm run start` pada `0.0.0.0:${PORT}`.
