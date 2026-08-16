import React, { useState, useRef } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { Wallpaper } from '../types';
import {
  Upload,
  X,
  Image as ImageIcon,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const UploadWallpaperModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addWallpaper } = useWallpaper();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('minimalist');
  const [format, setFormat] = useState<'4K UHD' | 'AMOLED' | 'HDR' | 'Minimal'>('4K UHD');
  const [tags, setTags] = useState('custom, 4k, mobile');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resolution, setResolution] = useState('3840 x 2160 (4K)');
  const [aspect, setAspect] = useState<'portrait' | 'landscape'>('portrait');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setError(null);

      // Detect resolution & aspect
      const img = new Image();
      img.onload = () => {
        setResolution(`${img.width} x ${img.height}`);
        setAspect(img.width >= img.height ? 'landscape' : 'portrait');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Please select or drag an image first');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    const newWallpaper: Wallpaper = {
      id: 'upload-wp-' + Date.now(),
      title: title.trim(),
      author: 'You (Uploaded)',
      category,
      resolution,
      width: aspect === 'portrait' ? 1440 : 3840,
      height: aspect === 'portrait' ? 3200 : 2160,
      aspect,
      format,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      colorPalette: ['#0f172a', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
      imageUrl: imagePreview,
      thumbnail: imagePreview,
      likes: 1,
      views: 1,
      downloads: 0,
      userUploaded: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addWallpaper(newWallpaper);
    setIsUploadModalOpen(false);
    setImagePreview(null);
    setTitle('');

    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.7 }
    });
  };

  return (
    <AnimatePresence>
      <div
        id="upload-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="upload-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Upload Wallpaper</h2>
                <p className="text-xs text-slate-400">
                  Publish high-resolution artwork to your local personal gallery
                </p>
              </div>
            </div>

            <button
              id="close-upload-modal-btn"
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="my-6 space-y-4 overflow-y-auto pr-1">
            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
                imagePreview
                  ? 'border-indigo-500 bg-indigo-500/5'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full max-h-48 flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 rounded-xl object-contain shadow-lg"
                  />
                  <p className="text-xs text-indigo-400 font-semibold mt-2">
                    Click to change image ({resolution})
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-500" />
                  <p className="text-sm font-semibold text-slate-200">
                    Drag and drop your high-resolution wallpaper here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports PNG, JPG, WebP (up to 4K / 8K resolution)
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Wallpaper Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Celestial Nebula Core"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="amoled">AMOLED & Dark</option>
                  <option value="nature">Nature & Landscape</option>
                  <option value="cyberpunk">Cyberpunk & Sci-Fi</option>
                  <option value="space">Space & Cosmos</option>
                  <option value="minimalist">Minimalist & 3D</option>
                  <option value="anime">Anime & Illustration</option>
                  <option value="architecture">Urban & Architecture</option>
                  <option value="supercars">Cars & Supercars</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="4k, amoled, dark, desktop"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              id="submit-upload-btn"
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
            >
              Add to Wallpaper Gallery
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
