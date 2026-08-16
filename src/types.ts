export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  isGuest?: boolean;
}

export type AspectRatio = 'all' | 'portrait' | 'landscape' | 'square';
export type SortOption = 'trending' | 'popular' | 'newest' | 'downloads';

export interface Wallpaper {
  id: string;
  title: string;
  author: string;
  authorUrl?: string;
  category: string;
  subCategory?: string;
  resolution: string; // e.g. "3840 x 2160 (4K)"
  width: number;
  height: number;
  aspect: 'portrait' | 'landscape' | 'square';
  format: '4K UHD' | 'AMOLED' | 'HDR' | 'AI Art' | 'Minimal';
  tags: string[];
  colorPalette: string[];
  imageUrl: string;
  thumbnail: string;
  fallbackUrl?: string;
  likes: number;
  views: number;
  downloads: number;
  featured?: boolean;
  isAIGenerated?: boolean;
  userUploaded?: boolean;
  createdAt: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  bannerUrl: string;
  count: number;
  gradient: string;
}

export interface CustomCategory {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  wallpaperIds: string[];
  createdAt: string;
}

export type PreviewDevice = 'phone-lock' | 'phone-home' | 'desktop' | 'tablet';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'all' or specific slug
  selectedCustomCategory: string | null; // id of custom category or null
  aspectRatio: AspectRatio;
  format: string; // 'all' or specific format
  colorFilter: string | null; // hex code or null
  sortBy: SortOption;
  onlyFavorites: boolean;
  onlyAi: boolean;
}
