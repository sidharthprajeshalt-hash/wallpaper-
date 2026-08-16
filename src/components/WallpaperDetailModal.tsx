import React, { useState } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import {
  X,
  Smartphone,
  Download,
  Heart,
  Share2,
  Sliders,
  Sparkles,
  Palette,
  ExternalLink,
  Check,
  RotateCw,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const WallpaperDetailModal: React.FC = () => {
  const {
    selectedWallpaper,
    setSelectedWallpaper,
    openPreviewModal,
    isFavorite,
    toggleFavorite,
    recordDownload,
    customCategories,
    toggleWallpaperInCustomCategory
  } = useWallpaper();

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!selectedWallpaper) return null;

  const favorited = isFavorite(selectedWallpaper.id);

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setBlur(0);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedWallpaper.imageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    recordDownload(selectedWallpaper.id);

    try {
      const response = await fetch(selectedWallpaper.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${selectedWallpaper.title.toLowerCase().replace(/\s+/g, '-')}-4K.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      window.open(selectedWallpaper.imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="wallpaper-detail-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="wallpaper-detail-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedWallpaper.title}</span>
                <span className="text-xs px-2 py-0.5 font-mono font-medium bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  {selectedWallpaper.format}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Created by {selectedWallpaper.author} • Mastered in {selectedWallpaper.resolution}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(selectedWallpaper.id)}
                className={`p-2.5 rounded-xl border transition ${
                  favorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={favorited ? 'Favorited' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>

              <button
                id="close-detail-modal-btn"
                type="button"
                onClick={() => setSelectedWallpaper(null)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Image Canvas Container */}
            <div className="lg:col-span-8 p-6 flex flex-col items-center justify-center bg-slate-950/90 relative min-h-[380px]">
              <div className="relative max-h-[500px] w-auto max-w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src={selectedWallpaper.imageUrl}
                  alt={selectedWallpaper.title}
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                  }}
                  className="max-h-[480px] w-auto object-contain transition-all"
                  referrerPolicy="no-referrer"
                />

                {/* Floating adjustment controls button */}
                <button
                  type="button"
                  onClick={() => setShowAdjustments(!showAdjustments)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 shadow-lg"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Adjust Look</span>
                </button>
              </div>

              {/* Adjustments Panel Popover */}
              {showAdjustments && (
                <div className="w-full max-w-md mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Brightness ({brightness}%)</span>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-32 accent-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Contrast ({contrast}%)</span>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-32 accent-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Soft Blur ({blur}px)</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-32 accent-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" /> Reset adjustments
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">{selectedWallpaper.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedWallpaper.description || 'High fidelity, uncompressed master rendering with balanced gamma for OLED and HDR displays.'}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Format</span>
                    <span className="font-bold text-slate-200">{selectedWallpaper.format}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Resolution</span>
                    <span className="font-bold text-slate-200">{selectedWallpaper.resolution.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Dominant Palette */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    Color Harmony
                  </label>
                  <div className="flex items-center gap-1.5">
                    {selectedWallpaper.colorPalette.map((hex, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-lg border border-slate-700 shadow"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Boards button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowBoards(!showBoards)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-purple-300 hover:text-white flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <FolderPlus className="w-4 h-4 text-purple-400" />
                      Add to Custom Board
                    </span>
                    <span className="text-slate-500 text-[10px]">▼</span>
                  </button>

                  {showBoards && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      {customCategories.length === 0 ? (
                        <p className="text-xs text-slate-500 p-1">No custom boards yet</p>
                      ) : (
                        customCategories.map(cat => {
                          const inCat = cat.wallpaperIds.includes(selectedWallpaper.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleWallpaperInCustomCategory(cat.id, selectedWallpaper.id)}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between text-slate-300 hover:bg-slate-800 transition"
                            >
                              <span>{cat.name}</span>
                              {inCat && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                {/* Live Device Preview Button */}
                <button
                  id="modal-live-preview-btn"
                  type="button"
                  onClick={() => {
                    const wp = selectedWallpaper;
                    setSelectedWallpaper(null);
                    openPreviewModal(wp, wp.aspect === 'portrait' ? 'phone-lock' : 'desktop');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Preview on Phone Lock Screen</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="modal-download-btn"
                    type="button"
                    disabled={downloading}
                    onClick={handleDownload}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download 4K</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
