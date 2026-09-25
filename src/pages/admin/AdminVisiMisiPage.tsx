import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Target } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { VisionMission } from '../../types.ts';
import { FormTextarea } from '../../components/common/FormControls.tsx';
import { Loading } from '../../components/common/Feedback.tsx';
import { useToast } from '../../components/common/Toast.tsx';

export const AdminVisiMisiPage: React.FC = () => {
  const [data, setData] = useState<VisionMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.getVisionMission()
      .then(setData)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      const updated = await api.updateVisionMission(data);
      setData(updated);
      toast.success('Visi, Misi & Tujuan berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  // Array item helpers
  const handleItemChange = (field: 'misi' | 'tujuan' | 'nilaiNilai' | 'programUnggulan', index: number, value: string) => {
    if (!data) return;
    const updated = [...data[field]];
    updated[index] = value;
    setData({ ...data, [field]: updated });
  };

  const handleAddItem = (field: 'misi' | 'tujuan' | 'nilaiNilai' | 'programUnggulan') => {
    if (!data) return;
    setData({ ...data, [field]: [...data[field], ''] });
  };

  const handleRemoveItem = (field: 'misi' | 'tujuan' | 'nilaiNilai' | 'programUnggulan', index: number) => {
    if (!data) return;
    const updated = data[field].filter((_, i) => i !== index);
    setData({ ...data, [field]: updated });
  };

  if (loading) return <Loading fullPage message="Memuat form visi & misi..." />;
  if (!data) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Visi, Misi & Tujuan</h2>
          <p className="text-xs text-slate-500">Edit pedoman visi, butir misi, sasaran tujuan, nilai budaya, dan program unggulan</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Visi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Visi Sekolah
        </h3>
        <FormTextarea
          label="Pernyataan Visi"
          rows={3}
          value={data.visi}
          onChange={e => setData({ ...data, visi: e.target.value })}
          required
        />
      </div>

      {/* Misi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Butir Misi Sekolah ({data.misi.length})
          </h3>
          <button
            type="button"
            onClick={() => handleAddItem('misi')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Misi</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.misi.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-2">
                {idx + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={e => handleItemChange('misi', idx, e.target.value)}
                placeholder="Tuliskan butir misi..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem('misi', idx)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tujuan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Tujuan Sekolah ({data.tujuan.length})
          </h3>
          <button
            type="button"
            onClick={() => handleAddItem('tujuan')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tujuan</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.tujuan.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-2">
                {idx + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={e => handleItemChange('tujuan', idx, e.target.value)}
                placeholder="Tuliskan tujuan sekolah..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem('tujuan', idx)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nilai Nilai & Program Unggulan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Nilai Budaya Sekolah
            </h3>
            <button
              type="button"
              onClick={() => handleAddItem('nilaiNilai')}
              className="text-xs font-semibold text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
          <div className="space-y-2">
            {data.nilaiNilai.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => handleItemChange('nilaiNilai', idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('nilaiNilai', idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Program Unggulan
            </h3>
            <button
              type="button"
              onClick={() => handleAddItem('programUnggulan')}
              className="text-xs font-semibold text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
          <div className="space-y-2">
            {data.programUnggulan.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => handleItemChange('programUnggulan', idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('programUnggulan', idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
