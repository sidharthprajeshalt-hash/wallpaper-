import React, { useState, useEffect } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { PreviewDevice } from '../types';
import {
  X,
  Smartphone,
  Monitor,
  Heart,
  Download,
  Share2,
  Maximize2,
  Sun,
  Battery,
  Wifi,
  Signal,
  Camera,
  Flashlight,
  MessageSquare,
  Sparkles,
  Palette,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const DevicePreviewModal: React.FC = () => {
  const {
    previewWallpaper,
    isPreviewModalOpen,
    closePreviewModal,
    previewDevice,
    setPreviewDevice,
    isFavorite,
    toggleFavorite,
    recordDownload
  } = useWallpaper();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isPreviewModalOpen || !previewWallpaper) return null;

  const favorited = isFavorite(previewWallpaper.id);

  const formattedHours = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownload = async (resolution: string) => {
    setDownloading(true);
    recordDownload(previewWallpaper.id);

    try {
      const response = await fetch(previewWallpaper.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${previewWallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${resolution}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      window.open(previewWallpaper.imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="device-preview-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="device-preview-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{previewWallpaper.title}</span>
                  <span className="text-xs px-2 py-0.5 font-mono font-medium bg-slate-800 text-indigo-300 rounded-md border border-slate-700">
                    {previewWallpaper.resolution}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  By {previewWallpaper.author} • Interactive Device Mockup Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(previewWallpaper.id)}
                className={`p-2.5 rounded-xl border transition ${
                  favorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={favorited ? 'Favorited' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>

              <button
                id="close-preview-modal-btn"
                type="button"
                onClick={closePreviewModal}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body: Two Column Preview & Tools */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Left Column: Device Mockup Stage */}
            <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-slate-950/80 relative min-h-[440px]">
              {/* Device Mode Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 shadow-lg z-20">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('phone-lock')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewDevice === 'phone-lock'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Lock Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('phone-home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewDevice === 'phone-home'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Home Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewDevice === 'desktop'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop Monitor</span>
                </button>
              </div>

              {/* Realistic Mobile Device Frame */}
              {(previewDevice === 'phone-lock' || previewDevice === 'phone-home') && (
                <div className="relative w-[280px] sm:w-[310px] h-[580px] sm:h-[620px] rounded-[48px] p-3.5 bg-slate-900 border-[6px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                  {/* Outer phone metal rim shine */}
                  <div className="absolute inset-0 rounded-[42px] ring-1 ring-white/10 pointer-events-none" />

                  {/* Screen Content Container */}
                  <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-950 flex flex-col justify-between select-none">
                    {/* Wallpaper Background Image */}
                    <img
                      src={previewWallpaper.imageUrl}
                      alt={previewWallpaper.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Dark gradient for lock screen legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

                    {/* Dynamic Island / Notch */}
                    <div className="relative pt-3 flex justify-center z-20">
                      <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="relative px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-white/90 z-20">
                      <span>{formattedHours}</span>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3 h-3" />
                        <Battery className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Lock Screen UI */}
                    {previewDevice === 'phone-lock' && (
                      <>
                        {/* Clock & Date Widget */}
                        <div className="relative px-4 text-center mt-6 z-20">
                          <p className="text-xs font-medium text-slate-200 uppercase tracking-widest drop-shadow-md">
                            {formattedDate}
                          </p>
                          <h1 className="text-5xl sm:text-6xl font-light text-white tracking-tight drop-shadow-lg font-sans">
                            {formattedHours}
                          </h1>
                        </div>

                        {/* Lock Screen Notifications */}
                        <div className="relative px-3.5 space-y-2 z-20 my-auto">
                          <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-md bg-indigo-500 flex items-center justify-center text-[9px] font-bold">W</div>
                                <span className="text-[11px] font-semibold text-white/90">WallArt HD</span>
                              </div>
                              <span className="text-[10px] text-white/60">Now</span>
                            </div>
                            <p className="text-xs font-medium text-white/95">
                              ✨ 4K Wallpaper loaded: {previewWallpaper.title}
                            </p>
                          </div>

                          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/15 text-white/90 shadow">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
                              <span className="text-[11px] font-medium">Ready for your home setup!</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="relative px-6 pb-6 flex items-center justify-between z-20">
                          <button
                            type="button"
                            className="p-3 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-white/25 transition shadow-lg"
                          >
                            <Flashlight className="w-4 h-4" />
                          </button>

                          {/* Swipe to Unlock indicator */}
                          <div
                            onClick={() => setUnlocked(!unlocked)}
                            className="text-center cursor-pointer group"
                          >
                            <p className="text-[10px] uppercase font-bold tracking-wider text-white/70 group-hover:text-white transition">
                              Swipe to unlock
                            </p>
                            <div className="w-28 h-1 bg-white/60 group-hover:bg-white rounded-full mx-auto mt-1 transition-all" />
                          </div>

                          <button
                            type="button"
                            className="p-3 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-white/25 transition shadow-lg"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Home Screen UI with App Grid Overlay */}
                    {previewDevice === 'phone-home' && (
                      <div className="relative flex-1 flex flex-col justify-between p-4 z-20">
                        {/* Search & Weather Widget */}
                        <div className="mt-4 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-white">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">{formattedDate}</span>
                            <span className="text-amber-300 font-bold">☀️ 72°F Sunny</span>
                          </div>
                        </div>

                        {/* App Icon Grid */}
                        <div className="grid grid-cols-4 gap-3 my-auto py-2">
                          {[
                            { name: 'Photos', bg: 'bg-gradient-to-tr from-amber-400 to-rose-500', icon: Palette },
                            { name: 'Camera', bg: 'bg-gradient-to-tr from-slate-700 to-slate-900', icon: Camera },
                            { name: 'Messages', bg: 'bg-gradient-to-tr from-emerald-500 to-teal-600', icon: MessageSquare },
                            { name: 'WallArt', bg: 'bg-gradient-to-tr from-indigo-500 to-purple-600', icon: Layers },
                          ].map((app, i) => {
                            const AppIcon = app.icon;
                            return (
                              <div key={i} className="flex flex-col items-center gap-1">
                                <div className={`w-11 h-11 rounded-2xl ${app.bg} flex items-center justify-center text-white shadow-lg`}>
                                  <AppIcon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-medium text-white drop-shadow truncate">{app.name}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Blurred Dock */}
                        <div className="p-2.5 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/20 flex items-center justify-around mb-2 shadow-2xl">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="w-9 h-9 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Monitor Frame */}
              {previewDevice === 'desktop' && (
                <div className="w-full max-w-xl flex flex-col items-center">
                  <div className="w-full aspect-[16/10] rounded-2xl bg-slate-950 border-[8px] border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
                    {/* Top Browser / OS bar */}
                    <div className="h-6 bg-slate-900 px-3 flex items-center justify-between border-b border-slate-800 z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Desktop 4K Display (3840x2160)</span>
                      <div className="text-[10px] text-slate-400">{formattedHours}</div>
                    </div>

                    {/* Wallpaper Preview */}
                    <img
                      src={previewWallpaper.imageUrl}
                      alt={previewWallpaper.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Desktop Dock */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">W</div>
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">C</div>
                      <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white">M</div>
                    </div>
                  </div>

                  {/* Monitor Stand */}
                  <div className="w-16 h-8 bg-slate-800 rounded-b-lg -mt-1" />
                  <div className="w-36 h-2 bg-slate-700 rounded-full shadow-lg" />
                </div>
              )}
            </div>

            {/* Right Column: Wallpaper Metadata & Download Hub */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="space-y-6">
                {/* Details Card */}
                <div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {previewWallpaper.format} Resolution
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-2">
                    {previewWallpaper.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {previewWallpaper.description || `Ultra-crisp high dynamic range background photographed and mastered by ${previewWallpaper.author}.`}
                  </p>
                </div>

                {/* Extracted Color Palette */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-400" />
                      Extracted Dominant Color Palette
                    </span>
                    {copiedHex && (
                      <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copied {copiedHex}
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {previewWallpaper.colorPalette.map((hex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => copyColor(hex)}
                        className="group flex flex-col items-center gap-1 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500 transition"
                        title={`Click to copy ${hex}`}
                      >
                        <span
                          className="w-full h-8 rounded-lg shadow-inner border border-white/10 group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">
                          {hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallpaper Tags */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Tags & Classification
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {previewWallpaper.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Options Group */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select Download Quality:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    id="download-4k-btn"
                    type="button"
                    disabled={downloading}
                    onClick={() => handleDownload('4K-Original')}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50"
                  >
                    <span className="font-bold">4K Ultra-HD</span>
                    <span className="text-[10px] text-indigo-200">Original (3840p)</span>
                  </button>

                  <button
                    id="download-fhd-btn"
                    type="button"
                    disabled={downloading}
                    onClick={() => handleDownload('Mobile-1080p')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex flex-col items-center justify-center gap-1 border border-slate-700 transition active:scale-95 disabled:opacity-50"
                  >
                    <span className="font-bold">Mobile Fit</span>
                    <span className="text-[10px] text-slate-400">1080p FHD+</span>
                  </button>

                  <button
                    id="download-hd-btn"
                    type="button"
                    disabled={downloading}
                    onClick={() => handleDownload('Standard-720p')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex flex-col items-center justify-center gap-1 border border-slate-700 transition active:scale-95 disabled:opacity-50"
                  >
                    <span className="font-bold">Data Saver</span>
                    <span className="text-[10px] text-slate-400">720p Fast</span>
                  </button>
                </div>

                {downloadSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>Download started in ultra-high resolution!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
