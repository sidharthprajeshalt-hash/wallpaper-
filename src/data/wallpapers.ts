import { Category, Wallpaper } from '../types';

// Static public wallpaper image URLs (served directly from /public/wallpapers/)
const imgNike = '/wallpapers/nike_green_flow_1786905085673.jpg';
const imgWave = '/wallpapers/great_ocean_wave_1786905480987.jpg';
const imgSunnyHill = '/wallpapers/retro_sunny_hill_1786905496091.jpg';
const imgPurpleFlowers = '/wallpapers/midnight_purple_bloom_1786903949825.jpg';
const imgBlueFlowers = '/wallpapers/translucent_blue_flora_1786903930966.jpg';
const imgSparklingOcean = '/wallpapers/sunlit_ocean_sparkles_1786903888074.jpg';
const imgPinkVinyl = '/wallpapers/pink_vinyl_turntable_1786903867397.jpg';
const imgCatBySea = '/wallpapers/sea_breeze_kitten_1786903847808.jpg';
const imgMountainPeak = '/wallpapers/alpine_green_summit_1786903818532.jpg';
const imgChromeSpace = '/wallpapers/chrome_cosmic_space_1786904036139.jpg';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'nature',
    name: 'Nature & Scenery',
    slug: 'nature',
    description: 'Mountain peaks, sparkling ocean waters, and cat by the sea',
    iconName: 'Trees',
    bannerUrl: imgMountainPeak,
    count: 3,
    gradient: 'from-emerald-900 via-teal-900 to-slate-950'
  },
  {
    id: 'amoled',
    name: 'AMOLED & Dark',
    slug: 'amoled',
    description: 'Dark purple flowers, ocean wave at night, and chrome in space',
    iconName: 'Moon',
    bannerUrl: imgPurpleFlowers,
    count: 3,
    gradient: 'from-purple-950 via-zinc-950 to-slate-950'
  },
  {
    id: 'minimalist',
    name: 'Aesthetic & Minimal',
    slug: 'minimalist',
    description: 'Green Nike wave, pink vinyl record, and blue transparent flowers',
    iconName: 'Layers',
    bannerUrl: imgNike,
    count: 3,
    gradient: 'from-rose-950 via-pink-950 to-slate-950'
  },
  {
    id: 'art',
    name: 'Art & Vintage',
    slug: 'art',
    description: 'Ocean wave painting and retro sun over green hills',
    iconName: 'Palette',
    bannerUrl: imgSunnyHill,
    count: 2,
    gradient: 'from-amber-950 via-sky-950 to-slate-950'
  },
  {
    id: 'space',
    name: 'Space & Cosmos',
    slug: 'space',
    description: 'Chrome figure drifting among stars in outer space',
    iconName: 'Sparkles',
    bannerUrl: imgChromeSpace,
    count: 1,
    gradient: 'from-slate-950 via-indigo-950 to-black'
  }
];

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  // 1. Green Nike
  {
    id: 'wp-green-nike',
    title: 'Green Nike',
    author: 'Studio Minimal',
    authorUrl: 'https://unsplash.com',
    category: 'minimalist',
    resolution: '1080 x 2400 (FHD+)',
    width: 1080,
    height: 2400,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['Nike', 'Green', 'Swoosh', 'Minimal', 'Black'],
    colorPalette: ['#16a34a', '#22c55e', '#000000', '#4ade80', '#14532d'],
    imageUrl: imgNike,
    thumbnail: imgNike,
    fallbackUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    likes: 8940,
    views: 54100,
    downloads: 28300,
    featured: true,
    createdAt: '2026-08-16',
    description: 'Smooth green wave with white Nike logo on dark background.'
  },

  // 2. Ocean Wave
  {
    id: 'wp-ocean-wave',
    title: 'Ocean Wave',
    author: 'Ocean Art',
    authorUrl: 'https://unsplash.com',
    category: 'art',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['Wave', 'Ocean', 'Water', 'Art', 'Night Sky', 'Black'],
    colorPalette: ['#000000', '#1d4ed8', '#38bdf8', '#ffffff', '#1e293b'],
    imageUrl: imgWave,
    thumbnail: imgWave,
    fallbackUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85',
    likes: 11200,
    views: 76500,
    downloads: 41800,
    featured: true,
    createdAt: '2026-08-16',
    description: 'Blue ocean wave crashing against a starry black sky.'
  },

  // 3. Sun & Clouds
  {
    id: 'wp-sun-clouds',
    title: 'Sun & Clouds',
    author: 'Retro Studio',
    authorUrl: 'https://unsplash.com',
    category: 'art',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Sun', 'Clouds', 'Sky', 'Hill', 'Grass', 'Retro', 'Vintage'],
    colorPalette: ['#38bdf8', '#facc15', '#65a30d', '#ffffff', '#1e3a8a'],
    imageUrl: imgSunnyHill,
    thumbnail: imgSunnyHill,
    fallbackUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    likes: 9400,
    views: 62300,
    downloads: 33700,
    featured: true,
    createdAt: '2026-08-16',
    description: 'Yellow sun in a blue sky with white clouds over a green hill.'
  },

  // 4. Purple Flowers
  {
    id: 'wp-purple-flowers',
    title: 'Purple Flowers',
    author: 'Dark Flora',
    authorUrl: 'https://unsplash.com',
    category: 'amoled',
    resolution: '1080 x 2340 (FHD+)',
    width: 1080,
    height: 2340,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['Purple', 'Flowers', 'Violet', 'Dark', 'AMOLED', 'Black'],
    colorPalette: ['#000000', '#7c3aed', '#c084fc', '#4c1d95', '#18181b'],
    imageUrl: imgPurpleFlowers,
    thumbnail: imgPurpleFlowers,
    fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
    likes: 8430,
    views: 52000,
    downloads: 27100,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Glowing purple flowers on pure black background.'
  },

  // 5. Blue Flowers
  {
    id: 'wp-blue-flowers',
    title: 'Blue Flowers',
    author: 'Studio Minimal',
    authorUrl: 'https://unsplash.com',
    category: 'minimalist',
    resolution: '1440 x 3120 (QHD+)',
    width: 1440,
    height: 3120,
    aspect: 'portrait',
    format: 'Minimal',
    tags: ['Blue', 'Flowers', 'Petals', 'Minimal', 'White', 'Clean'],
    colorPalette: ['#ffffff', '#3b82f6', '#1e3a8a', '#93c5fd', '#f1f5f9'],
    imageUrl: imgBlueFlowers,
    thumbnail: imgBlueFlowers,
    fallbackUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
    likes: 6280,
    views: 39400,
    downloads: 19800,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Transparent blue floral petals on a clean white background.'
  },

  // 6. Sparkling Ocean
  {
    id: 'wp-sparkling-ocean',
    title: 'Sparkling Ocean',
    author: 'Sea Studio',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '1440 x 2560 (QHD)',
    width: 1440,
    height: 2560,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['Ocean', 'Water', 'Sparkles', 'Sunlight', 'Blue', 'Deep Sea'],
    colorPalette: ['#082f49', '#0284c7', '#fef08a', '#0c4a6e', '#030712'],
    imageUrl: imgSparklingOcean,
    thumbnail: imgSparklingOcean,
    fallbackUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    likes: 5640,
    views: 34100,
    downloads: 18300,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Dark blue ocean surface with sparkling sunlight highlights.'
  },

  // 7. Pink Vinyl
  {
    id: 'wp-pink-vinyl',
    title: 'Pink Vinyl',
    author: 'Retro Audio',
    authorUrl: 'https://unsplash.com',
    category: 'minimalist',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Vinyl', 'Music', 'Pink', 'Turntable', 'Record', 'Retro'],
    colorPalette: ['#f43f5e', '#fda4af', '#e2e8f0', '#475569', '#94a3b8'],
    imageUrl: imgPinkVinyl,
    thumbnail: imgPinkVinyl,
    fallbackUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=85',
    likes: 3950,
    views: 22100,
    downloads: 11400,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Pink vinyl record playing on a vintage silver turntable.'
  },

  // 8. Cat by the Sea
  {
    id: 'wp-cat-sea',
    title: 'Cat by the Sea',
    author: 'Pet Gallery',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Cat', 'Kitten', 'Ocean', 'Butterflies', 'Sea', 'Blue'],
    colorPalette: ['#0284c7', '#38bdf8', '#0f172a', '#bae6fd', '#1e293b'],
    imageUrl: imgCatBySea,
    thumbnail: imgCatBySea,
    fallbackUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85',
    likes: 7120,
    views: 45800,
    downloads: 21900,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Black cat looking out at the blue ocean with butterflies.'
  },

  // 9. Mountain Peak
  {
    id: 'wp-mountain-peak',
    title: 'Mountain Peak',
    author: 'Mountain Lens',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '2160 x 3840 (4K UHD)',
    width: 2160,
    height: 3840,
    aspect: 'portrait',
    format: '4K UHD',
    tags: ['Mountain', 'Green', 'Fog', 'Mist', 'Peak', 'Nature'],
    colorPalette: ['#3f6212', '#15803d', '#cbd5e1', '#1e293b', '#f8fafc'],
    imageUrl: imgMountainPeak,
    thumbnail: imgMountainPeak,
    fallbackUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    likes: 4820,
    views: 29400,
    downloads: 14200,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Green mountain ridge covered in soft morning mist.'
  },

  // 10. Chrome in Space
  {
    id: 'wp-chrome-space',
    title: 'Chrome in Space',
    author: 'Space Arts',
    authorUrl: 'https://unsplash.com',
    category: 'space',
    resolution: '3840 x 2160 (4K UHD)',
    width: 3840,
    height: 2160,
    aspect: 'landscape',
    format: 'AMOLED',
    tags: ['Chrome', 'Space', 'Stars', 'Silver', 'Black', 'Cosmos'],
    colorPalette: ['#000000', '#e2e8f0', '#94a3b8', '#1e293b', '#ffffff'],
    imageUrl: imgChromeSpace,
    thumbnail: imgChromeSpace,
    fallbackUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    likes: 9540,
    views: 61000,
    downloads: 33400,
    featured: true,
    createdAt: '2026-08-16',
    description: 'Shiny silver chrome figure floating in black starry space.'
  }
];

export const POPULAR_COLOR_PALETTES = [
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Emerald Green', hex: '#16a34a' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Ocean Blue', hex: '#1d4ed8' },
  { name: 'Yellow Sun', hex: '#facc15' },
  { name: 'Pink', hex: '#f43f5e' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Silver', hex: '#94a3b8' },
  { name: 'White', hex: '#ffffff' },
];
