import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

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
    toggleWallpaperInCustomCategory
  } = useWallpaper();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const favorited = isFavorite(wallpaper.id);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    toggleFavorite(wallpaper.id);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPreviewModal(wallpaper, wallpaper.aspect === 'portrait' ? 'phone-lock' : 'desktop');
  };

  return (
    <motion.div
      id={`wallpaper-card-${wallpaper.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={() => setSelectedWallpaper(wallpaper)}
      className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 flex flex-col"
    >
      {/* Media Box */}
      <div className={`relative w-full overflow-hidden bg-slate-950 ${
        wallpaper.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-[16/10]'
      }`}>
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
                ? 'bg-rose-500 text-white'
                : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950/90'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Action Overlay (Desktop Hover + Accessible on Mobile) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 z-20">
          <div className="flex items-center justify-between gap-2">
            {/* Live Mockup Preview Button */}
            <button
              id={`preview-btn-${wallpaper.id}`}
              type="button"
              onClick={handlePreviewClick}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition shadow-md"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Mockup</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Add to Board / Custom Category */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCategoryPicker(!showCategoryPicker);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-purple-300 transition backdrop-blur-md"
                  title="Add to Custom Board"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown list of custom categories */}
                {showCategoryPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl z-30 space-y-1"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Add to Board:</p>
                    {customCategories.length === 0 ? (
                      <p className="text-xs text-slate-500 px-2 py-1">No custom boards yet</p>
                    ) : (
                      customCategories.map(cat => {
                        const inCat = cat.wallpaperIds.includes(wallpaper.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleWallpaperInCustomCategory(cat.id, wallpaper.id)}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between text-slate-300 hover:bg-slate-800 transition"
                          >
                            <span className="truncate">{cat.name}</span>
                            {inCat && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Direct Download Button */}
              <button
                id={`download-btn-${wallpaper.id}`}
                type="button"
                onClick={handleDownload}
                className={`p-1.5 sm:p-2 rounded-xl border backdrop-blur-md transition shadow-md ${
                  downloadSuccess
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white'
                }`}
                title="Instant 4K Download"
              >
                {downloadSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-slate-900">
        <div className="mb-2">
          <h3 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {wallpaper.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            by {wallpaper.author}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 text-[10px]">
            {wallpaper.resolution.split(' ')[0]}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3 h-3 text-rose-500/80" />
              {wallpaper.likes}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Download className="w-3 h-3 text-slate-400" />
              {wallpaper.downloads}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
