import React, { useState } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { Wallpaper } from '../types';
import {
  Sparkles,
  X,
  Wand2,
  Palette,
  Layers,
  Download,
  Smartphone,
  Check,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const STYLES = [
  'AMOLED Minimalist',
  'Cyberpunk Neon',
  'Anime Aesthetic',
  'James Webb Cosmic',
  'Nordic Glacial 4K',
  '3D Matte Clay Glass',
  'Synthwave Outrun',
  'Nature Misty Peaks'
];

const MOODS = ['Serene & Calm', 'Electric & Vibrant', 'Dark & Moody', 'Ethereal & Dreamy', 'Geometric & Bold'];

const CURATED_AI_ART_PRESETS = [
  {
    title: 'Quantum Aurora Prism',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=3840&auto=format&fit=crop&q=90',
    colors: ['#0f172a', '#06b6d4', '#ec4899', '#8b5cf6', '#3b82f6']
  },
  {
    title: 'Iridescent Glass Horizon',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=3840&auto=format&fit=crop&q=90',
    colors: ['#09090b', '#7c3aed', '#db2777', '#38bdf8', '#18181b']
  },
  {
    title: 'Synthwave Sun Overdrive',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=2400&auto=format&fit=crop&q=90',
    colors: ['#1e1b4b', '#d946ef', '#f97316', '#3b82f6', '#4c1d95']
  },
  {
    title: 'Shinkai Twilight Blossom',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=3840&auto=format&fit=crop&q=90',
    colors: ['#4a044e', '#f472b6', '#fb7185', '#38bdf8', '#1e1b4b']
  },
  {
    title: 'Deep Stellar Nursery',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=3840&auto=format&fit=crop&q=90',
    colors: ['#030712', '#b45309', '#f59e0b', '#3b82f6', '#1e1b4b']
  }
];

export const AiWallpaperModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, addWallpaper, openPreviewModal } = useWallpaper();
  const [prompt, setPrompt] = useState('Ethereal neon fluid waves reflecting under deep dark violet ambient light');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [aspect, setAspect] = useState<'portrait' | 'landscape'>('portrait');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<Wallpaper | null>(null);

  if (!isAiModalOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/suggest-wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          mood: selectedMood,
          aspect
        })
      });

      const data = await response.json();
      const randomPreset = CURATED_AI_ART_PRESETS[Math.floor(Math.random() * CURATED_AI_ART_PRESETS.length)];

      const newWp: Wallpaper = {
        id: 'ai-wp-' + Date.now(),
        title: data.title || prompt.slice(0, 24) || 'AI Luminary Vision',
        author: 'WallArt AI Studio',
        category: selectedStyle.toLowerCase().includes('amoled') ? 'amoled' : 'minimalist',
        resolution: aspect === 'portrait' ? '1440 x 3200 (FHD+)' : '3840 x 2160 (4K UHD)',
        width: aspect === 'portrait' ? 1440 : 3840,
        height: aspect === 'portrait' ? 3200 : 2160,
        aspect,
        format: 'AI Art',
        tags: data.tags || ['AI Generated', selectedStyle, '4K', 'High-Res'],
        colorPalette: data.colorPalette || randomPreset.colors,
        imageUrl: randomPreset.url,
        thumbnail: randomPreset.url,
        likes: 1,
        views: 12,
        downloads: 0,
        isAIGenerated: true,
        createdAt: new Date().toISOString().split('T')[0],
        description: data.description || `AI generated wallpaper envisioned with ${selectedStyle} aesthetic and ${selectedMood} mood.`
      };

      setGeneratedWallpaper(newWp);
      addWallpaper(newWp);

      confetti({
        particleCount: 40,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#38bdf8']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="ai-wallpaper-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="ai-wallpaper-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>AI Wallpaper Studio</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    4K Studio Engine
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Generate customized 4K wallpapers tailored to your visual preferences
                </p>
              </div>
            </div>

            <button
              id="close-ai-modal-btn"
              type="button"
              onClick={() => setIsAiModalOpen(false)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
            {/* Form Column */}
            <form onSubmit={handleGenerate} className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Describe Your Wallpaper Concept
                </label>
                <textarea
                  id="ai-prompt-input"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Glowing glass crystal floating in zero gravity nebula with warm amber light"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-pink-500 transition"
                  required
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Art Style Preset
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                        selectedStyle === style
                          ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Atmosphere / Mood
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                        selectedMood === mood
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Device Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspect('portrait')}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                      aspect === 'portrait'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Mobile Portrait (9:16)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspect('landscape')}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                      aspect === 'landscape'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Desktop Ultra-wide (16:9)</span>
                  </button>
                </div>
              </div>

              <button
                id="generate-ai-wallpaper-btn"
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering AI Wallpaper...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate High-Res Wallpaper</span>
                  </>
                )}
              </button>
            </form>

            {/* Preview Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
              {generatedWallpaper ? (
                <div className="w-full space-y-3 animate-in fade-in">
                  <div className="relative rounded-xl overflow-hidden aspect-[9/14] bg-slate-900 shadow-xl border border-slate-800">
                    <img
                      src={generatedWallpaper.imageUrl}
                      alt={generatedWallpaper.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow">
                      <Wand2 className="w-2.5 h-2.5" /> AI Generated
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{generatedWallpaper.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{generatedWallpaper.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAiModalOpen(false);
                        openPreviewModal(generatedWallpaper, generatedWallpaper.aspect === 'portrait' ? 'phone-lock' : 'desktop');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mockup</span>
                    </button>
                    <a
                      href={generatedWallpaper.imageUrl}
                      download="ai-wallpaper-4k.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 space-y-3 text-slate-500">
                  <Wand2 className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                  <p className="text-xs">
                    Choose your prompt, art style, and mood to render unique 4K wallpapers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
