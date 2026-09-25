import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth.routes.ts';
import schoolRoutes from './server/routes/school.routes.ts';
import contentRoutes from './server/routes/content.routes.ts';
import academicRoutes from './server/routes/academic.routes.ts';
import contactRoutes from './server/routes/contact.routes.ts';
import uploadRoutes from './server/routes/upload.routes.ts';
import { db } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure public/uploads directory exists
const publicUploads = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads, { recursive: true });
}

// Basic security and parsing middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded static assets directly with caching headers
app.use('/uploads', express.static(publicUploads, { maxAge: '7d' }));
const rootUploads = path.resolve(__dirname, 'uploads');
if (fs.existsSync(rootUploads)) {
  app.use('/uploads', express.static(rootUploads, { maxAge: '7d' }));
}
const distUploads = path.resolve(__dirname, 'dist', 'uploads');
if (fs.existsSync(distUploads)) {
  app.use('/uploads', express.static(distUploads, { maxAge: '7d' }));
}

// Initialize Database & Default Accounts
db.init().then(() => {
  console.log('Database and default credentials initialized.');
}).catch(err => {
  console.error('Error during database initialization:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', schoolRoutes);
app.use('/api', contentRoutes);
app.use('/api', academicRoutes);
app.use('/api', contactRoutes);
app.use('/api', uploadRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// SEO: robots.txt
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: /sitemap.xml\n`);
});

// SEO: sitemap.xml
app.get('/sitemap.xml', async (_req, res) => {
  const profile = await db.getSchoolProfile();
  const news = await db.getNews({ status: 'published' });
  const baseUrl = process.env.APP_URL || 'https://sdn001perhentianraja.sch.id';

  const staticUrls = [
    '/',
    '/profil',
    '/visi-misi',
    '/sambutan-kepala-sekolah',
    '/struktur-organisasi',
    '/keunggulan',
    '/fasilitas',
    '/ekstrakurikuler',
    '/prestasi',
    '/berita',
    '/galeri',
    '/guru-staf',
    '/mata-pelajaran',
    '/siswa',
    '/kontak'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of staticUrls) {
    xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  }

  for (const item of news) {
    xml += `  <url>\n    <loc>${baseUrl}/berita/${item.slug}</loc>\n    <lastmod>${new Date(item.tanggal).toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

// Catch-all for undefined /api routes
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan' });
});

// Vite Middleware for Development or Static Files for Production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { maxAge: '1d' }));
    } else {
      console.warn(`[WARN] Direktori dist tidak ditemukan pada ${distPath}. Pastikan telah menjalankan "npm run build".`);
    }

    // SPA fallback: kirim index.html untuk semua client routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(503).send('Aplikasi sedang dalam proses kompilasi. Jalankan "npm run build" terlebih dahulu.');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });

  // Graceful shutdown handling for container platforms like Railway
  const handleShutdown = (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server gracefully`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
