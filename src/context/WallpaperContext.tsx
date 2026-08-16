import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Wallpaper, CustomCategory, FilterState, PreviewDevice } from '../types';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';
import confetti from 'canvas-confetti';

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  customCategories: CustomCategory[];
  favorites: string[];
  filters: FilterState;
  selectedWallpaper: Wallpaper | null;
  previewWallpaper: Wallpaper | null;
  previewDevice: PreviewDevice;
  isPreviewModalOpen: boolean;
  isAiModalOpen: boolean;
  isUploadModalOpen: boolean;
  isApkModalOpen: boolean;
  isCategoryModalOpen: boolean;
  isMobileSimulator: boolean;
  
  // Actions
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  createCustomCategory: (name: string, description: string, icon: string, color: string) => CustomCategory;
  deleteCustomCategory: (id: string) => void;
  toggleWallpaperInCustomCategory: (categoryId: string, wallpaperId: string) => void;
  addWallpaper: (wallpaper: Wallpaper) => void;
  recordDownload: (id: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setSelectedWallpaper: (wp: Wallpaper | null) => void;
  openPreviewModal: (wp: Wallpaper, device?: PreviewDevice) => void;
  closePreviewModal: () => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  setIsAiModalOpen: (open: boolean) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setIsApkModalOpen: (open: boolean) => void;
  setIsCategoryModalOpen: (open: boolean) => void;
  setIsMobileSimulator: (val: boolean | ((prev: boolean) => boolean)) => void;
  filteredWallpapers: Wallpaper[];
}

const STORAGE_KEY_WALLPAPERS = 'wallarthd_custom_wallpapers';
const STORAGE_KEY_FAVORITES = 'wallarthd_favorites';
const STORAGE_KEY_CATEGORIES = 'wallarthd_custom_categories';
const STORAGE_KEY_MOBILE_MODE = 'wallarthd_mobile_mode';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedCustomCategory: null,
  aspectRatio: 'all',
  format: 'all',
  colorFilter: null,
  sortBy: 'trending',
  onlyFavorites: false,
  onlyAi: false,
};

const DEFAULT_CUSTOM_CATEGORIES: CustomCategory[] = [
  {
    id: 'cat-night-vibes',
    userId: 'default',
    name: 'Midnight Aesthetic',
    description: 'Moody, deep blacks and nocturnal neon highlights',
    icon: 'Moon',
    color: '#8b5cf6',
    wallpaperIds: ['w-1', 'w-2', 'w-8', 'w-13'],
    createdAt: '2026-03-01'
  },
  {
    id: 'cat-desk-setups',
    userId: 'default',
    name: 'Clean Battlestations',
    description: 'High-res desktop 4K backdrops for dual monitors',
    icon: 'Monitor',
    color: '#06b6d4',
    wallpaperIds: ['w-3', 'w-4', 'w-6', 'w-11', 'w-21'],
    createdAt: '2026-03-05'
  }
];

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WALLPAPERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_WALLPAPERS.filter(iw => !parsed.some((p: Wallpaper) => p.id === iw.id))];
      }
      return INITIAL_WALLPAPERS;
    } catch {
      return INITIAL_WALLPAPERS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['w-1', 'w-4', 'w-8', 'w-11'];
    } catch {
      return ['w-1', 'w-4', 'w-8', 'w-11'];
    }
  });

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOM_CATEGORIES;
    } catch {
      return DEFAULT_CUSTOM_CATEGORIES;
    }
  });

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('phone-lock');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOBILE_MODE);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOBILE_MODE, JSON.stringify(isMobileSimulator));
    } catch (e) {
      console.error(e);
    }
  }, [isMobileSimulator]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(customCategories));
    } catch (e) {
      console.error(e);
    }
  }, [customCategories]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter(fId => fId !== id) : [...prev, id];
      
      // Confetti effect on like
      if (!isAlready) {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#ec4899', '#f43f5e', '#a855f7']
        });
      }
      return updated;
    });

    setWallpapers(prev => prev.map(wp => {
      if (wp.id === id) {
        const isFav = favorites.includes(id);
        return { ...wp, likes: isFav ? Math.max(0, wp.likes - 1) : wp.likes + 1 };
      }
      return wp;
    }));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const createCustomCategory = (name: string, description: string, icon: string, color: string): CustomCategory => {
    const newCat: CustomCategory = {
      id: 'cat-' + Date.now(),
      userId: 'user',
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      wallpaperIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomCategories(prev => [newCat, ...prev]);
    return newCat;
  };

  const deleteCustomCategory = (id: string) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    if (filters.selectedCustomCategory === id) {
      setFilters(prev => ({ ...prev, selectedCustomCategory: null }));
    }
  };

  const toggleWallpaperInCustomCategory = (categoryId: string, wallpaperId: string) => {
    setCustomCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const has = cat.wallpaperIds.includes(wallpaperId);
        return {
          ...cat,
          wallpaperIds: has ? cat.wallpaperIds.filter(id => id !== wallpaperId) : [...cat.wallpaperIds, wallpaperId]
        };
      }
      return cat;
    }));
  };

  const addWallpaper = (newWallpaper: Wallpaper) => {
    setWallpapers(prev => {
      const updated = [newWallpaper, ...prev];
      try {
        const customOnly = updated.filter(w => w.isAIGenerated || w.userUploaded);
        localStorage.setItem(STORAGE_KEY_WALLPAPERS, JSON.stringify(customOnly));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const recordDownload = (id: string) => {
    setWallpapers(prev => prev.map(wp => wp.id === id ? { ...wp, downloads: wp.downloads + 1 } : wp));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const openPreviewModal = (wp: Wallpaper, device: PreviewDevice = 'phone-lock') => {
    setPreviewWallpaper(wp);
    setPreviewDevice(device);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  // Filtered and Sorted Wallpapers
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter(wp => {
      // Favorites filter
      if (filters.onlyFavorites && !favorites.includes(wp.id)) {
        return false;
      }

      // AI only filter
      if (filters.onlyAi && !wp.isAIGenerated) {
        return false;
      }

      // Custom Category filter
      if (filters.selectedCustomCategory) {
        const cat = customCategories.find(c => c.id === filters.selectedCustomCategory);
        if (!cat || !cat.wallpaperIds.includes(wp.id)) {
          return false;
        }
      }

      // Standard category filter
      if (filters.selectedCategory !== 'all' && wp.category !== filters.selectedCategory) {
        return false;
      }

      // Aspect ratio
      if (filters.aspectRatio !== 'all' && wp.aspect !== filters.aspectRatio) {
        return false;
      }

      // Format filter
      if (filters.format !== 'all' && wp.format !== filters.format) {
        return false;
      }

      // Color filter
      if (filters.colorFilter) {
        const hasColor = wp.colorPalette.some(c => 
          c.toLowerCase() === filters.colorFilter?.toLowerCase() ||
          wp.tags.some(t => t.toLowerCase().includes(filters.colorFilter || ''))
        );
        if (!hasColor) return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = wp.title.toLowerCase().includes(q);
        const matchesAuthor = wp.author.toLowerCase().includes(q);
        const matchesTags = wp.tags.some(t => t.toLowerCase().includes(q));
        const matchesCategory = wp.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'trending') return (b.likes * 2 + b.views) - (a.likes * 2 + a.views);
      if (filters.sortBy === 'popular') return b.likes - a.likes;
      if (filters.sortBy === 'downloads') return b.downloads - a.downloads;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [wallpapers, favorites, customCategories, filters]);

  return (
    <WallpaperContext.Provider
      value={{
        wallpapers,
        customCategories,
        favorites,
        filters,
        selectedWallpaper,
        previewWallpaper,
        previewDevice,
        isPreviewModalOpen,
        isAiModalOpen,
        isUploadModalOpen,
        isApkModalOpen,
        isCategoryModalOpen,
        isMobileSimulator,
        toggleFavorite,
        isFavorite,
        createCustomCategory,
        deleteCustomCategory,
        toggleWallpaperInCustomCategory,
        addWallpaper,
        recordDownload,
        setFilters,
        resetFilters,
        setSelectedWallpaper,
        openPreviewModal,
        closePreviewModal,
        setPreviewDevice,
        setIsAiModalOpen,
        setIsUploadModalOpen,
        setIsApkModalOpen,
        setIsCategoryModalOpen,
        setIsMobileSimulator,
        filteredWallpapers,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};
