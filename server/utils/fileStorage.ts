import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root public uploads directory
export const publicUploadsDir = path.resolve(__dirname, '../../public/uploads');

// Ensure directory exists
export function ensureUploadsDirExists(): string {
  if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  }
  return publicUploadsDir;
}

// Map common MIME types to extensions
const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico'
};

/**
 * Saves a base64 encoded image string to disk in public/uploads
 * and returns the relative URL (e.g. /uploads/image-123456.jpg).
 * If the input is already a URL or path (not base64), it returns it as-is.
 */
export function saveBase64Image(dataUriOrBase64: string, prefix = 'upload', originalName?: string): string {
  if (!dataUriOrBase64 || typeof dataUriOrBase64 !== 'string') {
    return dataUriOrBase64;
  }

  // If it's already an HTTP URL or local /uploads/ URL, return as-is
  if (dataUriOrBase64.startsWith('http://') || dataUriOrBase64.startsWith('https://') || dataUriOrBase64.startsWith('/uploads/')) {
    return dataUriOrBase64;
  }

  // Check if it is a data URI
  const match = dataUriOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  let mimeType = 'image/jpeg';
  let base64Content = dataUriOrBase64;

  if (match) {
    mimeType = match[1];
    base64Content = match[2];
  } else if (!dataUriOrBase64.startsWith('data:') && dataUriOrBase64.length > 500) {
    // Raw base64 string without data URI scheme
    base64Content = dataUriOrBase64;
  } else {
    // Normal string/path, not base64
    return dataUriOrBase64;
  }

  try {
    ensureUploadsDirExists();
    const ext = EXT_MAP[mimeType.toLowerCase()] || '.jpg';
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 7);
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanOriginal = (originalName || '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/\.[^/.]+$/, '');

    const fileName = cleanOriginal
      ? `${cleanOriginal}-${timestamp}-${rand}${ext}`
      : `${cleanPrefix}-${timestamp}-${rand}${ext}`;

    const filePath = path.join(publicUploadsDir, fileName);
    const buffer = Buffer.from(base64Content, 'base64');
    fs.writeFileSync(filePath, buffer);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Failed to save base64 image to disk:', error);
    return dataUriOrBase64;
  }
}

/**
 * Scans an object recursively and saves any base64 data URIs to disk,
 * replacing the field value with the saved file path (/uploads/...).
 * This ensures Firestore documents never carry large base64 payloads.
 */
export function sanitizeEntityBase64<T>(obj: T, prefix = 'entity'): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, idx) => sanitizeEntityBase64(item, `${prefix}-${idx}`)) as unknown as T;
  }

  const result: Record<string, any> = { ...(obj as Record<string, any>) };

  for (const [key, val] of Object.entries(result)) {
    if (typeof val === 'string') {
      if (val.startsWith('data:image/') || (val.length > 1000 && /^[A-Za-z0-9+/=]+$/.test(val.slice(0, 100)))) {
        result[key] = saveBase64Image(val, `${prefix}-${key}`);
      }
    } else if (val && typeof val === 'object') {
      result[key] = sanitizeEntityBase64(val, `${prefix}-${key}`);
    }
  }

  return result as T;
}

/**
 * Checks if a Firestore document payload approaches the 1MB limit.
 * Firestore limit is 1,048,576 bytes. We use 850,000 bytes as defensive threshold.
 */
export function isPayloadOversized(data: unknown, maxBytes = 850_000): boolean {
  try {
    const size = Buffer.byteLength(JSON.stringify(data), 'utf8');
    return size > maxBytes;
  } catch {
    return false;
  }
}

/**
 * Ensures document data is completely safe for Firestore persistence:
 * 1. Converts any base64 images into disk files with /uploads/ URLs.
 * 2. Verifies size is well below 1,048,576 bytes.
 */
export function prepareSafeFirestoreDoc<T extends Record<string, any>>(data: T, prefix = 'doc'): T {
  const sanitized = sanitizeEntityBase64(data, prefix);

  if (isPayloadOversized(sanitized)) {
    console.warn(`[Firestore Defense] Document payload for ${prefix} is unusually large (${Buffer.byteLength(JSON.stringify(sanitized), 'utf8')} bytes).`);
  }

  return sanitized;
}
