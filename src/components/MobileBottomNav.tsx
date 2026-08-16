import React from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Heart,
  FolderHeart,
  Wand2,
  Download,
  Smartphone,
  Upload,
  User
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    filters,
    setFilters,
    favorites,
    customCategories,
    setIsAiModalOpen,
    setIsApkModalOpen,
    setIsCategoryModalOpen,
    setIsUploadModalOpen
  } = useWallpaper();
  const { user, openAuthModal } = useAuth();

  const isExploreActive =
    filters.selectedCategory === 'all' &&
    !filters.selectedCustomCategory &&
    !filters.onlyFavorites &&
    !filters.onlyAi &&
    !filters.searchQuery;

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 md:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 items-center justify-around gap-1 text-center">
        {/* Explore / Home */}
        <button
          id="mobile-nav-explore"
          type="button"
          onClick={() => {
            setFilters(prev => ({
              ...prev,
              selectedCategory: 'all',
              selectedCustomCategory: null,
              onlyFavorites: false,
              onlyAi: false,
              searchQuery: ''
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            isExploreActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${isExploreActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight">Explore</span>
        </button>

        {/* Favorites */}
        <button
          id="mobile-nav-favorites"
          type="button"
          onClick={() => {
            setFilters(prev => ({
              ...prev,
              onlyFavorites: !prev.onlyFavorites,
              selectedCustomCategory: null,
              onlyAi: false
            }));
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl relative transition-all ${
            filters.onlyFavorites ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 mb-0.5 ${filters.onlyFavorites ? 'fill-rose-500 text-rose-500 stroke-[2.5]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-rose-500 text-white rounded-full leading-none">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">Favorites</span>
        </button>

        {/* AI Studio / Create */}
        <button
          id="mobile-nav-ai"
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-300 hover:text-white"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 -mt-3 border-2 border-slate-950">
            <Wand2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 font-semibold text-slate-200">AI Studio</span>
        </button>

        {/* Custom Boards */}
        <button
          id="mobile-nav-boards"
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl relative transition-all ${
            filters.selectedCustomCategory ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FolderHeart className="w-5 h-5 mb-0.5" />
            {customCategories.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-purple-500 text-white rounded-full leading-none">
                {customCategories.length}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">Boards</span>
        </button>

        {/* APK / Install Hub */}
        <button
          id="mobile-nav-apk"
          type="button"
          onClick={() => setIsApkModalOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all"
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-medium">Get APK</span>
        </button>
      </div>
    </nav>
  );
};
