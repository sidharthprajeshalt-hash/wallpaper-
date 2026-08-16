import React, { useState, useRef } from 'react';
import { Wallpaper } from '../types';
import { useWallpaper } from '../context/WallpaperContext';
import {
  Heart,
  Download,
  Smartphone,
  Wand2,
  FolderPlus,
  Check,
  Eye,
  Loader2,
  Sparkles,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audioFeedback';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper }) => {
  const {
    isFavorite,
    toggleFavorite,
    openPreviewModal,
    setSelectedWallpaper,
    recordDownload,
    customCategories,
    toggleWallpaperInCustomCategory,
    setFilters
  } = useWallpaper();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const favorited = isFavorite(wallpaper.id);

  // Handle double-tap / double-click to like
  const handleCardClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      e.stopPropagation();
      if (!favorited) {
        toggleFavorite(wallpaper.id);
      }
      sounds.playHeart(true);
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 900);
    } else {
      // Single tap - open detail
      setSelectedWallpaper(wallpaper);
      sounds.playTap();
    }
    lastTapRef.current = now;
  };

  // 3D Parallax Tilt Effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    recordDownload(wallpaper.id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);

    try {
      const response = await fetch(wallpaper.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${wallpaper.resolution.replace(/\s+/g, '')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(wallpaper.imageUrl, '_blank');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playHeart(!favorited);
    toggleFavorite(wallpaper.id);
    if (!favorited) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 900);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    openPreviewModal(wallpaper, wallpaper.aspect === 'portrait' ? 'phone-lock' : 'desktop');
  };

  const handleColorClick = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    sounds.playTap();
    setFilters(prev => ({
      ...prev,
      colorFilter: prev.colorFilter === hex ? null : hex
    }));
  };

  return (
    <motion.div
      ref={cardRef}
      id={`wallpaper-card-${wallpaper.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: tilt.y,
        rotateY: tilt.x,
        transformPerspective: 800
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer transition-all duration-300 flex flex-col select-none"
    >
      {/* Media Box */}
      <div
        className={`relative w-full overflow-hidden bg-slate-950 ${
          wallpaper.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-[16/10]'
        }`}
      >
        {/* Placeholder skeleton before load */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
          </div>
        )}

        <img
          src={wallpaper.thumbnail}
          alt={wallpaper.title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Double-tap burst heart animation */}
        <AnimatePresence>
          {heartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.4, 1] }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <div className="p-4 rounded-full bg-rose-500/30 backdrop-blur-md border border-rose-400/50 shadow-2xl">
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500 drop-shadow-lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30 rounded-md">
              {wallpaper.format}
            </span>
            {wallpaper.isAIGenerated && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-600/90 backdrop-blur-md text-white rounded-md flex items-center gap-1">
                <Wand2 className="w-2.5 h-2.5" /> AI
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            id={`fav-btn-${wallpaper.id}`}
            type="button"
            onClick={handleFavoriteClick}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              favorited
                ? 'bg-rose-500 text-white shadow-rose-500/40'
                : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950/90'
            }`}
            title={favorited ? 'Remove from favorites' : 'Double tap to favorite'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Action Overlay (Desktop Hover + Accessible on Mobile) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 z-20">
          <div className="flex items-center justify-between gap-2">
            {/* Live Mockup Preview Button */}
            <button
              id={`preview-btn-${wallpaper.id}`}
              type="button"
              onClick={handlePreviewClick}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition shadow-md active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive Mockup</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Add to Custom Board */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playTap();
                    setShowCategoryPicker(!showCategoryPicker);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
                  title="Add to Custom Board"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown Menu for Custom Categories */}
                <AnimatePresence>
                  {showCategoryPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-30 space-y-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                        Save to Custom Board
                      </div>
                      {customCategories.length === 0 ? (
                        <div className="px-2 py-2 text-xs text-slate-400">
                          No custom boards yet
                        </div>
                      ) : (
                        customCategories.map((cat) => {
                          const isInCat = cat.wallpaperIds.includes(wallpaper.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                toggleWallpaperInCustomCategory(cat.id, wallpaper.id);
                                sounds.playTap();
                              }}
                              className="w-full px-2 py-1.5 rounded-lg text-left text-xs flex items-center justify-between hover:bg-slate-800 text-slate-200 transition"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: cat.color }}
                                />
                                <span className="truncate">{cat.name}</span>
                              </div>
                              {isInCat && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Instant Download Button */}
              <button
                id={`download-btn-${wallpaper.id}`}
                type="button"
                onClick={handleDownload}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white transition active:scale-90"
                title="Download 4K file"
              >
                {downloadSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Information Footer */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2 bg-slate-900/95">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-bold text-xs sm:text-sm text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
              {wallpaper.title}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
              {wallpaper.resolution.split(' ')[0]}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            By {wallpaper.author}
          </p>
        </div>

        {/* Color Palette Dots with interactive filter click */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            {wallpaper.colorPalette.slice(0, 4).map((hex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleColorClick(e, hex)}
                className="w-3 h-3 rounded-full border border-slate-700/80 hover:scale-125 transition-transform shadow-sm"
                style={{ backgroundColor: hex }}
                title={`Filter by color ${hex}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              {(wallpaper.views / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3 text-slate-500" />
              {(wallpaper.downloads / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
