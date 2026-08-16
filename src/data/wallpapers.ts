import { Category, Wallpaper } from '../types';

// Import the 12 user wallpapers
import imgAlpine from '../assets/images/alpine_green_summit_1786903818532.jpg';
import imgKitten from '../assets/images/sea_breeze_kitten_1786903847808.jpg';
import imgPinkVinyl from '../assets/images/pink_vinyl_turntable_1786903867397.jpg';
import imgOceanSparkles from '../assets/images/sunlit_ocean_sparkles_1786903888074.jpg';
import imgSkyBlossoms from '../assets/images/summer_sky_blossoms_1786903908205.jpg';
import imgBlueFlora from '../assets/images/translucent_blue_flora_1786903930966.jpg';
import imgPurpleBloom from '../assets/images/midnight_purple_bloom_1786903949825.jpg';
import imgChefMeme from '../assets/images/chef_thumbs_up_1786903972011.jpg';
import imgMessiMeme from '../assets/images/mini_footballer_meme_1786904085553.jpg';
import imgCr7 from '../assets/images/young_cr7_mindset_1786904014903.jpg';
import imgNeymar from '../assets/images/retro_football_point_1786904064973.jpg';
import imgChromeSpace from '../assets/images/chrome_cosmic_space_1786904036139.jpg';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'sports',
    name: 'Football & Legends',
    slug: 'sports',
    description: 'Iconic football stars, young legends, and classic athletic moments',
    iconName: 'Flame',
    bannerUrl: imgCr7,
    count: 3,
    gradient: 'from-blue-950 via-indigo-900 to-slate-950'
  },
  {
    id: 'nature',
    name: 'Nature & Scenery',
    slug: 'nature',
    description: 'Misty green alpine summits, summer skies, kitten by the sea, and sparkling oceans',
    iconName: 'Trees',
    bannerUrl: imgAlpine,
    count: 4,
    gradient: 'from-emerald-900 via-teal-900 to-slate-950'
  },
  {
    id: 'minimalist',
    name: 'Aesthetic & Minimal',
    slug: 'minimalist',
    description: 'Dusty rose vinyl turntable records and delicate translucent botanicals',
    iconName: 'Layers',
    bannerUrl: imgPinkVinyl,
    count: 2,
    gradient: 'from-rose-950 via-pink-950 to-slate-950'
  },
  {
    id: 'amoled',
    name: 'AMOLED & Dark',
    slug: 'amoled',
    description: 'Deep OLED blacks, luminescent midnight violet petals, and cosmic voyagers',
    iconName: 'Moon',
    bannerUrl: imgPurpleBloom,
    count: 2,
    gradient: 'from-purple-950 via-zinc-950 to-slate-950'
  },
  {
    id: 'memes',
    name: 'Memes & Viral',
    slug: 'memes',
    description: 'Humorous viral moments, pocket Lionel Messi, and kitchen chef thumbs up',
    iconName: 'Smile',
    bannerUrl: imgMessiMeme,
    count: 2,
    gradient: 'from-amber-950 via-red-950 to-slate-950'
  },
  {
    id: 'space',
    name: 'Space & Cosmos',
    slug: 'space',
    description: 'Chrome metallic cosmic voyager drifting in starry void',
    iconName: 'Sparkles',
    bannerUrl: imgChromeSpace,
    count: 1,
    gradient: 'from-slate-950 via-indigo-950 to-black'
  }
];

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  // 1. Alpine Misty Summit
  {
    id: 'wp-alpine-summit',
    title: 'Alpine Misty Summit',
    author: 'Mountain Explorer',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '2160 x 3840 (4K UHD)',
    width: 2160,
    height: 3840,
    aspect: 'portrait',
    format: '4K UHD',
    tags: ['Alpine', 'Mountains', 'Fog', 'Emerald Ridge', 'Nature', '4K'],
    colorPalette: ['#3f6212', '#15803d', '#cbd5e1', '#1e293b', '#f8fafc'],
    imageUrl: imgAlpine,
    thumbnail: imgAlpine,
    likes: 4820,
    views: 29400,
    downloads: 14200,
    featured: true,
    createdAt: '2026-08-16',
    description: 'Steep emerald mountain ridge crest shrouded in dramatic morning fog and alpine mist.'
  },

  // 2. Sea Breeze Kitten & Butterflies
  {
    id: 'wp-sea-breeze-kitten',
    title: 'Sea Breeze Kitten & Butterflies',
    author: 'Ocean Sanctuary',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Kitten', 'Cat', 'Ocean', 'Butterflies', 'Sea Breeze', 'Aesthetic'],
    colorPalette: ['#0284c7', '#38bdf8', '#0f172a', '#bae6fd', '#1e293b'],
    imageUrl: imgKitten,
    thumbnail: imgKitten,
    likes: 7120,
    views: 45800,
    downloads: 21900,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Curious black kitten gazing over a sparkling sunlit ocean with butterflies fluttering across the water.'
  },

  // 3. Pink Vinyl Serenade
  {
    id: 'wp-pink-vinyl',
    title: 'Pink Vinyl Serenade',
    author: 'Vintage Audio Studio',
    authorUrl: 'https://unsplash.com',
    category: 'minimalist',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Vinyl', 'Turntable', 'Music', 'Dusty Pink', 'Vintage', 'Lo-Fi'],
    colorPalette: ['#f43f5e', '#fda4af', '#e2e8f0', '#475569', '#94a3b8'],
    imageUrl: imgPinkVinyl,
    thumbnail: imgPinkVinyl,
    likes: 3950,
    views: 22100,
    downloads: 11400,
    featured: false,
    createdAt: '2026-08-16',
    description: "Vintage brushed aluminum turntable spinning a retro rose-pink vinyl record titled 'All of a Sudden'."
  },

  // 4. Sunlit Deep Ocean Ripples
  {
    id: 'wp-sunlit-ocean',
    title: 'Sunlit Deep Ocean Ripples',
    author: 'Aqua Marine Lens',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '1440 x 2560 (QHD)',
    width: 1440,
    height: 2560,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['Ocean', 'Water', 'Sparkles', 'Deep Navy', 'Sunlight', 'Calm'],
    colorPalette: ['#082f49', '#0284c7', '#fef08a', '#0c4a6e', '#030712'],
    imageUrl: imgOceanSparkles,
    thumbnail: imgOceanSparkles,
    likes: 5640,
    views: 34100,
    downloads: 18300,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Golden sunbeams and diamond-like sparkling reflections dancing over dark deep blue ocean waves.'
  },

  // 5. Cerulean Sky & Summer Blossoms
  {
    id: 'wp-sky-blossoms',
    title: 'Cerulean Sky & Summer Blossoms',
    author: 'Botanical Bloom',
    authorUrl: 'https://unsplash.com',
    category: 'nature',
    resolution: '1080 x 2400 (FHD+)',
    width: 1080,
    height: 2400,
    aspect: 'portrait',
    format: '4K UHD',
    tags: ['Flowers', 'Sky', 'Blue Sky', 'Blossoms', 'Summer', 'Vibrant'],
    colorPalette: ['#2563eb', '#ec4899', '#16a34a', '#60a5fa', '#ffffff'],
    imageUrl: imgSkyBlossoms,
    thumbnail: imgSkyBlossoms,
    likes: 4210,
    views: 26900,
    downloads: 13700,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Vibrant magenta blossoms reaching upward into a clear cerulean blue sky filled with wispy clouds.'
  },

  // 6. Translucent Blue X-Ray Florals
  {
    id: 'wp-blue-flora-xray',
    title: 'Translucent Blue X-Ray Florals',
    author: 'Studio Minimal',
    authorUrl: 'https://unsplash.com',
    category: 'minimalist',
    resolution: '1440 x 3120 (QHD+)',
    width: 1440,
    height: 3120,
    aspect: 'portrait',
    format: 'Minimal',
    tags: ['X-Ray', 'Botanical', 'Transparent', 'Blue Petals', 'Minimalist', 'Art'],
    colorPalette: ['#ffffff', '#3b82f6', '#1e3a8a', '#93c5fd', '#f1f5f9'],
    imageUrl: imgBlueFlora,
    thumbnail: imgBlueFlora,
    likes: 6280,
    views: 39400,
    downloads: 19800,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Minimalist fine art translucent layered blue floral petals with delicate vein structures on a white canvas.'
  },

  // 7. Midnight Violet Petunias
  {
    id: 'wp-midnight-petunias',
    title: 'Midnight Violet Petunias',
    author: 'OLED Lumens',
    authorUrl: 'https://unsplash.com',
    category: 'amoled',
    resolution: '1080 x 2340 (FHD+)',
    width: 1080,
    height: 2340,
    aspect: 'portrait',
    format: 'AMOLED',
    tags: ['AMOLED', 'Purple', 'Violet', 'Dark Flora', 'Luminescent', 'OLED'],
    colorPalette: ['#000000', '#7c3aed', '#c084fc', '#4c1d95', '#18181b'],
    imageUrl: imgPurpleBloom,
    thumbnail: imgPurpleBloom,
    likes: 8430,
    views: 52000,
    downloads: 27100,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Luminescent velvet violet petunias glowing softly against an ultra-pure black OLED background.'
  },

  // 8. Chef Lionel KFC Double Thumbs
  {
    id: 'wp-chef-lionel-meme',
    title: 'Chef Lionel KFC Double Thumbs',
    author: 'Viral Meme Vault',
    authorUrl: 'https://unsplash.com',
    category: 'memes',
    resolution: '1080 x 1440 (HD)',
    width: 1080,
    height: 1440,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Meme', 'Chef', 'Thumbs Up', 'Funny', 'Viral', 'Kitchen'],
    colorPalette: ['#dc2626', '#ffffff', '#475569', '#1e293b', '#f8fafc'],
    imageUrl: imgChefMeme,
    thumbnail: imgChefMeme,
    likes: 9150,
    views: 64200,
    downloads: 31000,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Iconic funny viral meme of the restaurant chef lookalike giving two enthusiastic thumbs up in the kitchen.'
  },

  // 9. Pocket Lionel Messi #10
  {
    id: 'wp-pocket-messi',
    title: 'Pocket Lionel Messi #10',
    author: 'Albiceleste Vault',
    authorUrl: 'https://unsplash.com',
    category: 'sports',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: 'HDR',
    tags: ['Messi', 'Argentina', 'GOAT', 'Meme', 'Football', 'Funny'],
    colorPalette: ['#38bdf8', '#ffffff', '#1e293b', '#0284c7', '#f59e0b'],
    imageUrl: imgMessiMeme,
    thumbnail: imgMessiMeme,
    likes: 12400,
    views: 89000,
    downloads: 48900,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Legendary humorous mini Lionel Messi mirror selfie meme wearing the iconic Argentina #10 jersey.'
  },

  // 10. Young Cristiano Ronaldo CR7
  {
    id: 'wp-young-ronaldo-cr7',
    title: 'Young Cristiano Ronaldo CR7',
    author: 'Red Devils Archives',
    authorUrl: 'https://unsplash.com',
    category: 'sports',
    resolution: '1080 x 1920 (FHD)',
    width: 1080,
    height: 1920,
    aspect: 'portrait',
    format: '4K UHD',
    tags: ['Cristiano Ronaldo', 'CR7', 'Man United', 'Football', 'Legend', 'Mindset'],
    colorPalette: ['#1e1b4b', '#312e81', '#64748b', '#f8fafc', '#0f172a'],
    imageUrl: imgCr7,
    thumbnail: imgCr7,
    likes: 11200,
    views: 78500,
    downloads: 41200,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Young Cristiano Ronaldo with iconic curly hair in Manchester United training kit pointing to his temple.'
  },

  // 11. Young Neymar Jr Santos Flash
  {
    id: 'wp-young-neymar-santos',
    title: 'Young Neymar Jr Santos Flash',
    author: 'Santos Nostalgia',
    authorUrl: 'https://unsplash.com',
    category: 'sports',
    resolution: '1920 x 1080 (FHD)',
    width: 1920,
    height: 1080,
    aspect: 'landscape',
    format: '4K UHD',
    tags: ['Neymar', 'Santos FC', 'Brazil', 'Vintage Football', 'Monochrome', 'Legend'],
    colorPalette: ['#000000', '#ffffff', '#71717a', '#27272a', '#d4d4d8'],
    imageUrl: imgNeymar,
    thumbnail: imgNeymar,
    likes: 10800,
    views: 74200,
    downloads: 38600,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Iconic vintage monochrome black and white portrait of young Neymar Jr in Santos kit pointing forward.'
  },

  // 12. Chrome Silver Cosmic Voyager
  {
    id: 'wp-chrome-cosmic-voyager',
    title: 'Chrome Silver Cosmic Voyager',
    author: 'Starlight Odyssey',
    authorUrl: 'https://unsplash.com',
    category: 'space',
    resolution: '3840 x 2160 (4K UHD)',
    width: 3840,
    height: 2160,
    aspect: 'landscape',
    format: 'AMOLED',
    tags: ['Silver Surfer', 'Chrome', 'Space', 'Cosmos', 'Monochrome', 'Stars'],
    colorPalette: ['#000000', '#e2e8f0', '#94a3b8', '#1e293b', '#ffffff'],
    imageUrl: imgChromeSpace,
    thumbnail: imgChromeSpace,
    likes: 9540,
    views: 61000,
    downloads: 33400,
    featured: false,
    createdAt: '2026-08-16',
    description: 'Liquid chrome metallic silver celestial figure floating in deep space among glittering star constellations.'
  }
];

export const POPULAR_COLOR_PALETTES = [
  { name: 'OLED Pure Black', hex: '#000000' },
  { name: 'Emerald Green', hex: '#15803d' },
  { name: 'Ocean Cyan', hex: '#0284c7' },
  { name: 'Dusty Rose Pink', hex: '#f43f5e' },
  { name: 'Electric Violet', hex: '#7c3aed' },
  { name: 'Sky Cerulean', hex: '#2563eb' },
  { name: 'Chrome Silver', hex: '#94a3b8' },
  { name: 'KFC Crimson Red', hex: '#dc2626' },
  { name: 'Starlight White', hex: '#ffffff' },
];
