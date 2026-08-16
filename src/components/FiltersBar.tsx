import React, { useState } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { DEFAULT_CATEGORIES, POPULAR_COLOR_PALETTES } from '../data/wallpapers';
import { AspectRatio, SortOption } from '../types';
import {
  Wand2,
  SlidersHorizontal,
  FolderHeart,
  X,
  Smartphone,
  Monitor,
  Maximize2,
  Palette
} from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export const FiltersBar: React.FC = () => {
  const { filters, setFilters, resetFilters, customCategories } = useWallpaper();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.selectedCategory !== 'all' ||
    filters.selectedCustomCategory !== null ||
    filters.aspectRatio !== 'all' ||
    filters.format !== 'all' ||
    filters.colorFilter !== null ||
    filters.searchQuery !== '' ||
    filters.onlyFavorites ||
    filters.onlyAi;

  return (
    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
        {/* All Button */}
        <button
          id="category-pill-all"
          type="button"
          onClick={() => {
            sounds.playTap();
            setFilters((prev) => ({
              ...prev,
              selectedCategory: 'all',
              selectedCustomCategory: null,
              onlyFavorites: false,
              onlyAi: false
            }));
          }}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
            filters.selectedCategory === 'all' && !filters.selectedCustomCategory && !filters.onlyFavorites && !filters.onlyAi
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          All
        </button>

        {/* AI Studio dedicated pill */}
        <button
          id="category-pill-ai"
          type="button"
          onClick={() => {
            sounds.playTap();
            setFilters((prev) => ({ ...prev, onlyAi: !prev.onlyAi, selectedCustomCategory: null, onlyFavorites: false }));
          }}
          className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1.5 ${
            filters.onlyAi
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-indigo-300 hover:text-indigo-200 hover:border-slate-700'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Studio</span>
        </button>

        {/* Standard Curated Categories */}
        {DEFAULT_CATEGORIES.map((cat) => (
          <button
            id={`category-pill-${cat.slug}`}
            key={cat.id}
            type="button"
            onClick={() => {
              sounds.playTap();
              setFilters((prev) => ({
                ...prev,
                selectedCategory: cat.slug,
                selectedCustomCategory: null,
                onlyFavorites: false,
                onlyAi: false
              }));
            }}
            className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border flex items-center gap-1.5 ${
              filters.selectedCategory === cat.slug && !filters.selectedCustomCategory && !filters.onlyFavorites && !filters.onlyAi
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}

        {/* Custom Boards Pills */}
        {customCategories.map((cCat) => (
          <button
            id={`custom-category-pill-${cCat.id}`}
            key={cCat.id}
            type="button"
            onClick={() => {
              sounds.playTap();
              setFilters((prev) => ({
                ...prev,
                selectedCustomCategory: prev.selectedCustomCategory === cCat.id ? null : cCat.id,
                selectedCategory: 'all',
                onlyFavorites: false,
                onlyAi: false
              }));
            }}
            className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border flex items-center gap-1.5 ${
              filters.selectedCustomCategory === cCat.id
                ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-purple-300 hover:text-purple-100 hover:border-slate-700'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" style={{ color: cCat.color }} />
            <span>{cCat.name}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-400">
              {cCat.wallpaperIds.length}
            </span>
          </button>
        ))}
      </div>

      {/* Secondary Bar: Aspect Ratio, Sort, & Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-2 sm:p-2.5">
        {/* Aspect Ratio Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-slate-800">
          {(
            [
              { label: 'All', value: 'all', icon: Maximize2 },
              { label: 'Mobile (9:16)', value: 'portrait', icon: Smartphone },
              { label: 'Desktop (16:9)', value: 'landscape', icon: Monitor },
            ] as const
          ).map((ratio) => {
            const Icon = ratio.icon;
            return (
              <button
                key={ratio.value}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setFilters((prev) => ({ ...prev, aspectRatio: ratio.value as AspectRatio }));
                }}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  filters.aspectRatio === ratio.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{ratio.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Advanced Filters Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sort Selector */}
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => {
              sounds.playTap();
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }));
            }}
            className="bg-slate-950/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="trending">🔥 Trending</option>
            <option value="popular">⭐ Most Popular</option>
            <option value="newest">✨ Newest First</option>
            <option value="downloads">📥 Most Downloaded</option>
          </select>

          {/* Color & Format Filter Toggle */}
          <button
            id="advanced-filters-toggle-btn"
            type="button"
            onClick={() => {
              sounds.playTap();
              setShowAdvanced(!showAdvanced);
            }}
            className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
              showAdvanced || filters.colorFilter || filters.format !== 'all'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Filter by Color and Format"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Colors</span>
          </button>

          {/* Reset Filters (Only when active) */}
          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              type="button"
              onClick={() => {
                sounds.playTap();
                resetFilters();
              }}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs transition"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Palette & Format Drawer */}
      {showAdvanced && (
        <div className="p-3 sm:p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter by Color Tone
            </span>
            {filters.colorFilter && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setFilters((prev) => ({ ...prev, colorFilter: null }));
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Clear Color Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {POPULAR_COLOR_PALETTES.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setFilters((prev) => ({
                    ...prev,
                    colorFilter: prev.colorFilter === color.hex ? null : color.hex
                  }));
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border transition ${
                  filters.colorFilter === color.hex
                    ? 'border-white bg-slate-800 text-white shadow ring-2 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-slate-700 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
              Format:
            </span>
            {['all', '4K UHD', 'AMOLED', 'HDR', 'AI Art', 'Minimal'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setFilters((prev) => ({ ...prev, format: fmt }));
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  filters.format === fmt
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt === 'all' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
