import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import { useToast } from './Toast.tsx';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

// Helper to compress and optimize images before upload
const compressImageClient = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<{ base64: string; type: string }> => {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: reader.result as string, type: file.type });
      reader.onerror = () => resolve({ base64: '', type: file.type });
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve({ base64: reader.result as string, type: file.type });
        reader.readAsDataURL(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Try WebP compression for superior size
      try {
        const base64 = canvas.toDataURL('image/webp', quality);
        if (base64.startsWith('data:image/webp')) {
          return resolve({ base64, type: 'image/webp' });
        }
      } catch {
        // Fallback
      }

      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve({ base64, type: 'image/jpeg' });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: reader.result as string, type: file.type });
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Gambar / Foto',
  helperText = 'Format: JPG, JPEG, PNG, WEBP (Maksimal 10 MB, otomatis dioptimalkan)'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [inputUrl, setInputUrl] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Pilih file JPG, PNG, atau WEBP.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file melebihi 10 MB.');
      return;
    }

    try {
      setUploading(true);
      const { base64, type } = await compressImageClient(file);
      if (!base64) {
        throw new Error('Gagal memproses file gambar.');
      }

      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const uploadFilename = type === 'image/webp' ? `${cleanName}.webp` : file.name;
      const res = await api.uploadFile(uploadFilename, type, base64);
      onChange(res.url);
      setInputUrl(res.url);
      toast.success('Gambar berhasil diunggah');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    onChange(inputUrl.trim());
    toast.success('URL gambar diterapkan');
  };

  const handleClear = () => {
    onChange('');
    setInputUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tautan URL
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
            value ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-500 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-medium text-slate-700">
              {uploading ? 'Mengunggah gambar...' : 'Klik atau seret gambar ke sini untuk mengunggah'}
            </p>
            <p className="text-[11px] text-slate-400">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau URL gambar"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      )}

      {/* Preview box if value exists */}
      {value && (
        <div className="relative mt-2 p-2 bg-slate-100 rounded-xl flex items-center gap-3 border border-slate-200">
          <img
            src={value}
            alt="Preview"
            className="w-14 h-14 object-cover rounded-lg border border-slate-300 shrink-0"
            onError={e => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">Gambar Terpilih</p>
            <p className="text-[11px] text-slate-400 truncate">{value.startsWith('data:') ? 'File Unggahan Lokal' : value}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Hapus gambar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
