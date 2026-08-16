import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallpaper } from '../context/WallpaperContext';
import {
  Image as ImageIcon,
  Heart,
  FolderHeart,
  Upload,
  Smartphone,
  LogOut,
  User,
  Monitor,
  Search,
  X,
  Wand2,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const {
    favorites,
    customCategories,
    filters,
    setFilters,
    setIsAiModalOpen,
    setIsUploadModalOpen,
    setIsApkModalOpen,
    setIsCategoryModalOpen,
    isMobileSimulator,
    setIsMobileSimulator
  } = useWallpaper();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo - clean wallpaper icon, no Gemini branding */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          <div
            id="brand-logo"
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
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 p-0.5 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight font-sans">
                  WallArt<span className="text-indigo-400">HD</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  4K
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">Ultra-Res Studio & APK</p>
            </div>
          </div>
        </div>

        {/* Global Search Bar - Responsive */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className={`relative transition-all rounded-xl ${
            isSearchFocused ? 'ring-2 ring-indigo-500/50 bg-slate-900' : 'bg-slate-900/70 hover:bg-slate-900'
          } border border-slate-800`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              ref={searchInputRef}
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search 4K, AMOLED, Nature, Anime..."
              className="w-full pl-10 pr-16 py-2 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none"
            />
            {filters.searchQuery ? (
              <button
                id="clear-search-btn"
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Favorites Button (Desktop / Tablet) */}
          <button
            id="nav-favorites-btn"
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, onlyFavorites: !prev.onlyFavorites, selectedCustomCategory: null }))}
            className={`hidden md:flex relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 border transition ${
              filters.onlyFavorites
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
            }`}
            title="View Favorites"
          >
            <Heart className={`w-4 h-4 ${filters.onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Custom Categories Button (Desktop / Tablet) */}
          <button
            id="nav-categories-btn"
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="hidden md:flex p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition"
            title="Custom Albums & Boards"
          >
            <FolderHeart className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">My Boards</span>
            {customCategories.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                {customCategories.length}
              </span>
            )}
          </button>

          {/* AI Generator Studio Button */}
          <button
            id="nav-ai-studio-btn"
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 bg-slate-900/90 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 transition shadow-sm"
          >
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>AI Studio</span>
          </button>

          {/* Upload Button */}
          <button
            id="nav-upload-btn"
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition"
            title="Upload Custom Wallpaper"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Upload</span>
          </button>

          {/* Mobile APK Hub Button */}
          <button
            id="nav-apk-hub-btn"
            type="button"
            onClick={() => setIsApkModalOpen(true)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition active:scale-[0.98]"
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Get APK</span>
          </button>

          {/* Mobile Simulator Toggle (Desktop only) */}
          <button
            id="nav-simulator-toggle-btn"
            type="button"
            onClick={() => setIsMobileSimulator(prev => !prev)}
            className={`hidden lg:flex p-2 rounded-xl border transition ${
              isMobileSimulator
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isMobileSimulator ? 'Switch to Desktop Layout' : 'Preview in Phone Frame'}
          >
            {isMobileSimulator ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative" ref={profileRef}>
            {user ? (
              <button
                id="user-profile-menu-btn"
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-1 pl-1 pr-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-indigo-500/50"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                id="nav-signin-btn"
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md"
              >
                Sign In
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileOpen && user && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="p-2 border-b border-slate-800/80 mb-2 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    {user.isGuest && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                        Guest Session
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setFilters(prev => ({ ...prev, onlyFavorites: true, selectedCustomCategory: null }));
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      Favorite Wallpapers
                    </span>
                    <span className="text-slate-400">{favorites.length}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsCategoryModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <FolderHeart className="w-3.5 h-3.5 text-purple-400" />
                      Custom Boards
                    </span>
                    <span className="text-slate-400">{customCategories.length}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    Upload Wallpaper
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsApkModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Download Mobile APK
                  </button>
                </div>

                <div className="border-t border-slate-800/80 mt-2 pt-2">
                  <button
                    id="profile-logout-btn"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Switch User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search input - visible on small screens */}
      <div className="mt-2.5 sm:hidden">
        <div className="relative bg-slate-900 border border-slate-800 rounded-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search 4K, AMOLED, anime, nature..."
            className="w-full pl-9 pr-8 py-2 bg-transparent text-xs text-slate-100 placeholder-slate-400 outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

