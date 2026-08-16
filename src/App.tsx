import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { WallpaperProvider, useWallpaper } from './context/WallpaperContext';
import { Navbar } from './components/Navbar';
import { FiltersBar } from './components/FiltersBar';
import { WallpaperCard } from './components/WallpaperCard';
import { AuthModal } from './components/AuthModal';
import { DevicePreviewModal } from './components/DevicePreviewModal';
import { WallpaperDetailModal } from './components/WallpaperDetailModal';
import { CustomCategoryModal } from './components/CustomCategoryModal';
import { AiWallpaperModal } from './components/AiWallpaperModal';
import { UploadWallpaperModal } from './components/UploadWallpaperModal';
import { ApkGeneratorModal } from './components/ApkGeneratorModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Smartphone,
  Layers,
  Heart,
  Download,
  Search,
  RotateCcw,
  Zap,
  FolderHeart,
  TrendingUp,
  Wand2,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WallpaperGallery: React.FC = () => {
  const {
    filteredWallpapers,
    filters,
    resetFilters,
    openPreviewModal,
    wallpapers,
    setIsAiModalOpen,
    setIsApkModalOpen
  } = useWallpaper();

  const featuredWallpaper = wallpapers.find(w => w.featured) || wallpapers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Spotlight Featured Banner - shown when in 'all' mode without active query */}
        {filters.selectedCategory === 'all' &&
          !filters.selectedCustomCategory &&
          !filters.onlyFavorites &&
          !filters.onlyAi &&
          !filters.searchQuery &&
          featuredWallpaper && (
            <motion.div
              id="hero-spotlight-banner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-8 lg:p-10 min-h-[260px] sm:min-h-[320px] flex flex-col justify-end"
            >
              {/* Background cover image with gradient scrim */}
              <img
                src={featuredWallpaper.imageUrl}
                alt={featuredWallpaper.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

              <div className="relative z-10 max-w-2xl space-y-2.5 sm:space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Spotlight of the Day</span>
                </div>

                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {featuredWallpaper.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 drop-shadow">
                  {featuredWallpaper.description || 'Mastered in 4K Ultra-HD resolution with native color grading for OLED and mobile displays.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                  <button
                    id="hero-preview-btn"
                    type="button"
                    onClick={() => openPreviewModal(featuredWallpaper, 'phone-lock')}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Live Mockup</span>
                  </button>

                  <button
                    id="hero-ai-create-btn"
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-1.5 sm:gap-2 transition"
                  >
                    <Wand2 className="w-4 h-4 text-indigo-400" />
                    <span>AI Studio</span>
                  </button>

                  <button
                    id="hero-apk-get-btn"
                    type="button"
                    onClick={() => setIsApkModalOpen(true)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-1.5 sm:gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Get APK</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        {/* Filters & Categories Controller */}
        <FiltersBar />

        {/* Section Heading & Result Counter */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
              {filters.onlyFavorites ? (
                <>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Favorite Wallpapers</span>
                </>
              ) : filters.onlyAi ? (
                <>
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  <span>AI Studio Wallpapers</span>
                </>
              ) : filters.selectedCustomCategory ? (
                <>
                  <FolderHeart className="w-4 h-4 text-purple-400" />
                  <span>Custom Collection Board</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Explore Wallpapers</span>
                </>
              )}
            </h2>
            <span className="text-[11px] sm:text-xs px-2 py-0.5 font-mono bg-slate-900 border border-slate-800 text-slate-400 rounded-md">
              {filteredWallpapers.length} Wallpapers
            </span>
          </div>

          {filters.searchQuery && (
            <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-xs">
              Search: <strong className="text-slate-200 font-medium">"{filters.searchQuery}"</strong>
            </span>
          )}
        </div>

        {/* Wallpaper Masonry / Grid */}
        {filteredWallpapers.length > 0 ? (
          <div
            id="wallpapers-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredWallpapers.map(wp => (
                <WallpaperCard key={wp.id} wallpaper={wp} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div
            id="empty-results-box"
            className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4 max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">No matching wallpapers found</h3>
              <p className="text-xs text-slate-400">
                Try searching for different keywords or resetting your active filters.
              </p>
            </div>
            <button
              id="empty-reset-filters-btn"
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </main>

      {/* App Modals */}
      <AuthModal />
      <DevicePreviewModal />
      <WallpaperDetailModal />
      <CustomCategoryModal />
      <AiWallpaperModal />
      <UploadWallpaperModal />
      <ApkGeneratorModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 sm:py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">WallArt HD</span>
            <span>• 4K Ultra-HD Wallpapers & APK</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px] sm:text-xs">
            <span>AMOLED Optimized</span>
            <span>•</span>
            <span>Android APK Package</span>
            <span>•</span>
            <span>Custom Boards</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WallpaperProvider>
        <MobileFrameWrapper>
          <WallpaperGallery />
        </MobileFrameWrapper>
      </WallpaperProvider>
    </AuthProvider>
  );
}
