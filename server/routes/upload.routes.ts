import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../auth.ts';
import { saveBase64Image } from '../utils/fileStorage.ts';

const router = Router();

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// POST /api/upload
// Handles image upload and saves directly to disk in public/uploads/
router.post('/upload', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { filename, filetype, data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data file yang diterima.'
      });
    }

    // Check mime type
    if (filetype && !ALLOWED_MIME_TYPES.includes(filetype.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Tipe file tidak didukung. Harap unggah file berformat JPG, JPEG, PNG, WEBP, atau SVG.'
      });
    }

    // Check size approximately
    const estimatedSize = (data.length * 3) / 4;
    if (estimatedSize > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file melebihi batas maksimum 10 MB.'
      });
    }

    // Format safe data URI if needed
    const dataUri = data.startsWith('data:')
      ? data
      : `data:${filetype || 'image/jpeg'};base64,${data}`;

    // Save image to disk and obtain web-accessible URL
    const fileUrl = saveBase64Image(dataUri, 'upload', filename);

    return res.json({
      success: true,
      message: 'File berhasil diunggah dan disimpan ke server.',
      url: fileUrl,
      filename: fileUrl.split('/').pop() || filename || 'upload.jpg'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal memproses unggahan file'
    });
  }
});

export default router;
