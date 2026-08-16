import React, { useState, useEffect } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { Smartphone, X, Battery, Wifi, Signal, Monitor } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const { isMobileSimulator, setIsMobileSimulator } = useWallpaper();
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobileSimulator) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Floating Mode Switcher Bar */}
      <div className="sticky top-2 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-2xl mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Mobile Simulator Mode</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileSimulator(false)}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <Monitor className="w-3 h-3" />
          <span>Desktop Mode</span>
        </button>
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative w-full max-w-[412px] h-[min(840px,88vh)] rounded-[48px] p-3 bg-slate-900 border-[6px] border-slate-800 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col">
        {/* Metal rim highlight */}
        <div className="absolute inset-0 rounded-[42px] ring-1 ring-white/10 pointer-events-none" />

        {/* Screen Bezel */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-950 flex flex-col">
          {/* Status Bar */}
          <div className="h-9 bg-slate-950 px-5 flex items-center justify-between text-xs font-semibold text-slate-300 z-50 select-none border-b border-slate-900 flex-shrink-0">
            <span className="text-[11px] font-mono">{timeStr}</span>
            {/* Dynamic Island / Camera Punch Hole */}
            <div className="w-20 h-3.5 bg-black rounded-full mx-auto flex items-center justify-between px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <Signal className="w-2.5 h-2.5" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3 h-3 text-emerald-400" />
            </div>
          </div>

          {/* Child App inside Mobile View with internal scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
            {children}
          </div>

          {/* Home Bar Indicator */}
          <div className="h-3.5 bg-slate-950 flex items-center justify-center pointer-events-none flex-shrink-0">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
