import React, { useState, useRef } from 'react';
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
  FolderPlus,
  Wand2,
  Eye,
  Columns,
  Layers,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audioFeedback';

const FILTER_PRESETS = [
  { name: 'Original', brightness: 100, contrast: 100, saturation: 100, hue: 0, sepia: 0 },
  { name: 'OLED Deep Black', brightness: 90, contrast: 130, saturation: 120, hue: 0, sepia: 0 },
  { name: 'Vibrant Pop', brightness: 105, contrast: 115, saturation: 145, hue: 0, sepia: 0 },
  { name: 'Cyberpunk', brightness: 100, contrast: 120, saturation: 140, hue: 270, sepia: 0 },
  { name: 'Emerald Pop', brightness: 100, contrast: 110, saturation: 130, hue: 90, sepia: 0 },
  { name: 'Vintage 35mm', brightness: 105, contrast: 90, saturation: 80, hue: 15, sepia: 30 },
  { name: 'Monochrome Noir', brightness: 100, contrast: 140, saturation: 0, hue: 0, sepia: 0 },
];

export const WallpaperDetailModal: React.FC = () => {
  const {
    selectedWallpaper,
    setSelectedWallpaper,
    openPreviewModal,
    isFavorite,
    toggleFavorite,
    recordDownload,
    customCategories,
    toggleWallpaperInCustomCategory,
    setFilters
  } = useWallpaper();

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('Original');

  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showSplitCompare, setShowSplitCompare] = useState(false);
  const [splitPos, setSplitPos] = useState(50);
  const [showBoards, setShowBoards] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!selectedWallpaper) return null;

  const favorited = isFavorite(selectedWallpaper.id);

  const applyPreset = (preset: typeof FILTER_PRESETS[0]) => {
    sounds.playTap();
    setSelectedPreset(preset.name);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setHueRotate(preset.hue);
    setSepia(preset.sepia);
    setBlur(0);
  };

  const resetFilters = () => {
    sounds.playTap();
    applyPreset(FILTER_PRESETS[0]);
  };

  const handleShare = () => {
    sounds.playTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedWallpaper.imageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownload = async () => {
    sounds.playTap();
    setDownloading(true);
    recordDownload(selectedWallpaper.id);

    try {
      // If adjustments are customized, render to canvas for download
      const hasCustomFilters =
        brightness !== 100 ||
        contrast !== 100 ||
        saturation !== 100 ||
        hueRotate !== 0 ||
        blur !== 0 ||
        sepia !== 0;

      if (hasCustomFilters) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedWallpaper.imageUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || selectedWallpaper.width;
        canvas.height = img.naturalHeight || selectedWallpaper.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%)`;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${selectedWallpaper.title.toLowerCase().replace(/\s+/g, '-')}-edited-4K.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
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
      }

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      window.open(selectedWallpaper.imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const cssFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%)`;

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
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedWallpaper.title}</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 font-mono font-medium bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
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
                onClick={() => {
                  sounds.playHeart(!favorited);
                  toggleFavorite(selectedWallpaper.id);
                }}
                className={`p-2.5 rounded-xl border transition active:scale-90 ${
                  favorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={favorited ? 'Favorited' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedWallpaper(null);
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Left: Interactive Image Canvas Preview with Split-View Support */}
            <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[460px]">
              <div
                className={`relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 max-h-[500px] select-none ${
                  selectedWallpaper.aspect === 'portrait'
                    ? 'aspect-[9/16] max-w-[280px] sm:max-w-[310px]'
                    : 'aspect-[16/10] max-w-full'
                }`}
              >
                {/* Base Original Image (visible in split comparison) */}
                <img
                  src={selectedWallpaper.imageUrl}
                  alt={selectedWallpaper.title}
                  onError={(e) => {
                    if (selectedWallpaper.fallbackUrl) {
                      (e.currentTarget as HTMLImageElement).src = selectedWallpaper.fallbackUrl;
                    }
                  }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Filtered Overlay Layer */}
                <img
                  src={selectedWallpaper.imageUrl}
                  alt="Custom Color Graded"
                  onError={(e) => {
                    if (selectedWallpaper.fallbackUrl) {
                      (e.currentTarget as HTMLImageElement).src = selectedWallpaper.fallbackUrl;
                    }
                  }}
                  style={{
                    filter: cssFilter,
                    clipPath: showSplitCompare ? `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` : undefined
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-150"
                  referrerPolicy="no-referrer"
                />

                {/* Split Slider Handle */}
                {showSplitCompare && (
                  <>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10"
                      style={{ left: `${splitPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-xl flex items-center justify-center text-[10px] text-slate-900 font-bold">
                        ↔
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white backdrop-blur z-20">
                      Graded
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white backdrop-blur z-20">
                      Original
                    </div>
                  </>
                )}
              </div>

              {/* Quick Image Canvas Tools Below */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setShowSplitCompare(!showSplitCompare);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    showSplitCompare
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split Compare: {showSplitCompare ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    openPreviewModal(selectedWallpaper, 'phone-lock');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open Live Phone OS</span>
                </button>
              </div>

              {/* Split Slider Bar when Split Compare is ON */}
              {showSplitCompare && (
                <div className="w-64 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-900 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Right: Wallpaper Details & Color Grading Studio */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    About this wallpaper
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedWallpaper.description ||
                      'Mastered in 4K resolution with high-fidelity color depth. Ideal for lock screens and OLED dark mode interfaces.'}
                  </p>
                </div>

                {/* Color Palette (Click to Copy or Filter) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Color Palette (Click to Filter / Copy)
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedWallpaper.colorPalette.map((hex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(hex);
                          sounds.playTap();
                          setCopiedHex(hex);
                          setTimeout(() => setCopiedHex(null), 2000);
                        }}
                        className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{copiedHex === hex ? 'Copied!' : hex}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Grading Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Color Grading Presets
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAdjustments(!showAdjustments)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{showAdjustments ? 'Hide Sliders' : 'Fine-Tune'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {FILTER_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition truncate ${
                          selectedPreset === preset.name
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fine Tune Sliders (Expandable) */}
                <AnimatePresence>
                  {showAdjustments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-800"
                    >
                      <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-800">
                        <span className="font-bold text-slate-300">Adjustment Sliders</span>
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <RotateCw className="w-3 h-3" /> Reset
                        </button>
                      </div>

                      {/* Brightness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>Brightness</span>
                          <span className="font-mono text-indigo-400">{brightness}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={brightness}
                          onChange={(e) => {
                            setSelectedPreset('Custom');
                            setBrightness(Number(e.target.value));
                          }}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>Contrast</span>
                          <span className="font-mono text-indigo-400">{contrast}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="160"
                          value={contrast}
                          onChange={(e) => {
                            setSelectedPreset('Custom');
                            setContrast(Number(e.target.value));
                          }}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>

                      {/* Saturation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>Vibrancy / Saturation</span>
                          <span className="font-mono text-indigo-400">{saturation}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={saturation}
                          onChange={(e) => {
                            setSelectedPreset('Custom');
                            setSaturation(Number(e.target.value));
                          }}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>

                      {/* Hue Shift */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>Hue Shift</span>
                          <span className="font-mono text-indigo-400">{hueRotate}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={hueRotate}
                          onChange={(e) => {
                            setSelectedPreset('Custom');
                            setHueRotate(Number(e.target.value));
                          }}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Keywords & Tags
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedWallpaper.tags.map((tag, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setFilters((prev) => ({ ...prev, searchQuery: tag }));
                          setSelectedWallpaper(null);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={handleDownload}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Processing...' : 'Download Master 4K'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-indigo-400" />
                        <span>Share Wallpaper</span>
                      </>
                    )}
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
