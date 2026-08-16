import React, { useState } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import {
  X,
  FolderPlus,
  FolderHeart,
  Trash2,
  Check,
  Sparkles,
  Palette,
  Layers,
  Moon,
  Sun,
  Flame,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BOARD_COLORS = [
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
];

const BOARD_ICONS = [
  { name: 'FolderHeart', icon: FolderHeart },
  { name: 'Moon', icon: Moon },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Flame', icon: Flame },
  { name: 'Zap', icon: Zap },
  { name: 'Star', icon: Star },
];

export const CustomCategoryModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    customCategories,
    createCustomCategory,
    deleteCustomCategory,
    setFilters
  } = useWallpaper();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('FolderHeart');
  const [isCreating, setIsCreating] = useState(false);

  if (!isCategoryModalOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCustomCategory(name, description, selectedIcon, selectedColor);
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const handleSelectCategory = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCustomCategory: catId,
      selectedCategory: 'all',
      onlyFavorites: false
    }));
    setIsCategoryModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        id="custom-categories-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="custom-categories-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <FolderHeart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Custom Wallpaper Boards
                </h2>
                <p className="text-xs text-slate-400">
                  Organize your favorite themes into custom collections & albums
                </p>
              </div>
            </div>

            <button
              id="close-categories-modal-btn"
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Custom Categories */}
          <div className="my-6 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {customCategories.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No custom boards yet. Create your first board below!
              </div>
            ) : (
              customCategories.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition group"
                >
                  <div
                    onClick={() => handleSelectCategory(cat.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${cat.color}30`, borderColor: cat.color, borderWidth: 1 }}
                    >
                      <FolderHeart className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {cat.description || `${cat.wallpaperIds.length} wallpapers in this collection`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                      {cat.wallpaperIds.length} items
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteCustomCategory(cat.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create New Board Form Toggle */}
          {!isCreating ? (
            <button
              id="create-board-toggle-btn"
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-3 rounded-2xl bg-slate-950 border border-dashed border-slate-700 hover:border-purple-500 text-purple-300 hover:text-purple-200 text-sm font-semibold flex items-center justify-center gap-2 transition"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Wallpaper Board</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">New Custom Board Details</h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Minimal AMOLED Setups"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Perfect for dark workstation setups"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              {/* Accent Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {BOARD_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/30 transition"
              >
                Save Board
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
