import React, { useState, useEffect, useRef } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import { PreviewDevice } from '../types';
import {
  X,
  Smartphone,
  Monitor,
  Heart,
  Download,
  Share2,
  Maximize2,
  Sun,
  Battery,
  Wifi,
  Signal,
  Camera,
  Flashlight,
  Sparkles,
  Palette,
  Check,
  Layers,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  CloudRain,
  CloudSun,
  Flame,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Sliders,
  RotateCw,
  Compass,
  Music,
  Activity,
  Calendar,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audioFeedback';

type ClockStyle = 'modern' | 'serif' | 'cyber' | 'neon' | 'condensed' | 'minimal';
type AmbientEffect = 'none' | 'sparkles' | 'rain' | 'dust';

export const DevicePreviewModal: React.FC = () => {
  const {
    previewWallpaper,
    isPreviewModalOpen,
    closePreviewModal,
    previewDevice,
    setPreviewDevice,
    isFavorite,
    toggleFavorite,
    recordDownload
  } = useWallpaper();

  // Clock & Time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockStyle, setClockStyle] = useState<ClockStyle>('modern');
  const [clockColor, setClockColor] = useState<string>('#ffffff');
  const [clockSize, setClockSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [use24Hour, setUse24Hour] = useState(false);

  // Phone state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const [ambientEffect, setAmbientEffect] = useState<AmbientEffect>('none');
  const [parallaxEnabled, setParallaxEnabled] = useState(true);
  const [phoneTilt, setPhoneTilt] = useState({ x: 0, y: 0 });

  // Interactive Widgets State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicTrack, setMusicTrack] = useState(0);
  const [weatherTemp, setWeatherTemp] = useState(72);
  const [isCelsius, setIsCelsius] = useState(false);
  const [batteryPercent, setBatteryPercent] = useState(94);

  // Visual Image Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [activeTab, setActiveTab] = useState<'customize' | 'widgets' | 'effects'>('customize');

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const phoneRef = useRef<HTMLDivElement>(null);

  const tracks = [
    { title: 'Midnight City Glow', artist: 'Neon Reverie', duration: '3:24' },
    { title: 'Ocean Breeze Serenade', artist: 'Coastal Waves', duration: '2:50' },
    { title: 'Green Forest Odyssey', artist: 'Alpine Drift', duration: '4:12' },
  ];

  // Auto-sync dominant color from wallpaper on open
  useEffect(() => {
    if (previewWallpaper && previewWallpaper.colorPalette.length > 0) {
      // Pick the brightest or most vibrant color for clock if not black
      const vibrant = previewWallpaper.colorPalette.find(c => c !== '#000000') || '#ffffff';
      setClockColor(vibrant);
    }
  }, [previewWallpaper]);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isPreviewModalOpen || !previewWallpaper) return null;

  const favorited = isFavorite(previewWallpaper.id);

  const formattedHours = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallaxEnabled || !phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPhoneTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setPhoneTilt({ x: 0, y: 0 });
  };

  const toggleFlashlight = () => {
    sounds.playSwitch();
    setFlashlightOn(!flashlightOn);
  };

  const triggerCamera = () => {
    sounds.playShutter();
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 200);
  };

  const toggleUnlock = () => {
    if (!isUnlocked) {
      sounds.playUnlock();
      setIsUnlocked(true);
    } else {
      sounds.playLock();
      setIsUnlocked(false);
    }
  };

  const handleDownload = async (resolution: string) => {
    setDownloading(true);
    sounds.playTap();
    recordDownload(previewWallpaper.id);

    try {
      const response = await fetch(previewWallpaper.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${previewWallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${resolution}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      window.open(previewWallpaper.imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const getClockFontFamily = () => {
    switch (clockStyle) {
      case 'serif':
        return 'font-serif';
      case 'cyber':
        return 'font-mono tracking-widest';
      case 'neon':
        return 'font-sans drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]';
      case 'condensed':
        return 'font-sans font-black tracking-tight scale-y-110';
      case 'minimal':
        return 'font-light tracking-wider';
      default:
        return 'font-bold tracking-tight';
    }
  };

  const getClockSizeClass = () => {
    switch (clockSize) {
      case 'sm':
        return 'text-4xl sm:text-5xl';
      case 'lg':
        return 'text-6xl sm:text-7xl';
      default:
        return 'text-5xl sm:text-6xl';
    }
  };

  return (
    <AnimatePresence>
      <div
        id="device-preview-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="device-preview-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>{previewWallpaper.title}</span>
                  <span className="text-[10px] px-2 py-0.5 font-mono font-semibold bg-slate-800 text-indigo-300 rounded border border-slate-700">
                    Live OS Simulator
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Interactive Lock Screen • Gestures, Widgets & Customizer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playHeart(!favorited);
                  toggleFavorite(previewWallpaper.id);
                }}
                className={`p-2.5 rounded-xl border transition active:scale-90 ${
                  favorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={favorited ? 'Favorited' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  closePreviewModal();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Workspace Body: Left Phone Simulator + Right Interactive Studio */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Left: Interactive Phone Mockup */}
            <div
              className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-slate-950/60 relative overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background Glow */}
              <div
                className="absolute w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: clockColor }}
              />

              {/* Flashlight screen effect */}
              {flashlightOn && (
                <div className="absolute inset-0 bg-amber-100/30 backdrop-blur-sm z-30 pointer-events-none animate-pulse" />
              )}

              {/* Camera Shutter Flash */}
              {cameraFlash && (
                <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200" />
              )}

              {/* Phone Chassis Container with 3D Parallax */}
              <motion.div
                ref={phoneRef}
                style={{
                  rotateX: parallaxEnabled ? phoneTilt.y : 0,
                  rotateY: parallaxEnabled ? phoneTilt.x : 0,
                  transformPerspective: 1000
                }}
                className="relative w-full max-w-[310px] sm:max-w-[330px] aspect-[9/19.5] rounded-[48px] p-3.5 bg-slate-950 border-[5px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none transition-transform duration-100"
              >
                {/* Physical Buttons on Sides */}
                <div className="absolute -left-[8px] top-24 w-[3px] h-9 bg-slate-700 rounded-l" />
                <div className="absolute -left-[8px] top-36 w-[3px] h-12 bg-slate-700 rounded-l" />
                <div className="absolute -left-[8px] top-52 w-[3px] h-12 bg-slate-700 rounded-l" />
                <div className="absolute -right-[8px] top-32 w-[3px] h-16 bg-slate-700 rounded-r" />

                {/* Inner Screen Bezel */}
                <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col justify-between shadow-inner">
                  {/* Wallpaper Background Image with applied Visual Adjustments */}
                  <img
                    src={previewWallpaper.imageUrl}
                    alt={previewWallpaper.title}
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-all duration-150"
                    referrerPolicy="no-referrer"
                  />

                  {/* Ambient Particle Overlays */}
                  {ambientEffect === 'sparkles' && (
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:16px_16px] animate-pulse opacity-60" />
                  )}
                  {ambientEffect === 'dust' && (
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_40%,rgba(167,139,250,0.5)_2px,transparent_2px)] bg-[size:24px_24px] opacity-40 animate-bounce" />
                  )}
                  {ambientEffect === 'rain' && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent bg-[size:100%_8px] opacity-50" />
                  )}

                  {/* Glass Specular Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                  {/* Top Status Bar & Dynamic Island */}
                  <div className="relative z-20 pt-2 px-5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-[11px] font-semibold text-white/90 drop-shadow">
                      <span>{formattedHours}</span>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3 h-3" />
                        <button
                          type="button"
                          onClick={() => setBatteryPercent(p => (p <= 20 ? 100 : p - 25))}
                          className="flex items-center gap-1 hover:text-amber-300 transition"
                          title="Click to change battery"
                        >
                          <span className="text-[9px] font-mono">{batteryPercent}%</span>
                          <Battery className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Dynamic Island */}
                    <motion.div
                      layout
                      onClick={() => {
                        sounds.playTap();
                        setDynamicIslandExpanded(!dynamicIslandExpanded);
                      }}
                      className={`mt-1 bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer shadow-lg transition-all duration-300 border border-white/10 ${
                        dynamicIslandExpanded ? 'w-full py-2 h-auto rounded-2xl' : 'w-24 h-6'
                      }`}
                    >
                      {dynamicIslandExpanded ? (
                        <div className="w-full flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                              <Music className="w-3 h-3 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[10px] truncate max-w-[110px]">
                                {tracks[musicTrack].title}
                              </p>
                              <p className="text-[8px] text-slate-400">
                                {tracks[musicTrack].artist}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.playTap();
                              setIsPlayingMusic(!isPlayingMusic);
                            }}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                          >
                            {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                          <div className="flex items-center gap-1">
                            {isPlayingMusic && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            )}
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-950/80" />
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>

                  {/* Main Screen Content: Lock Screen vs Home Screen */}
                  <div className="relative z-10 flex-1 px-4 py-2 flex flex-col justify-between">
                    {!isUnlocked ? (
                      /* LOCK SCREEN VIEW */
                      <>
                        {/* Clock & Date Display */}
                        <div className="pt-2 text-center space-y-1">
                          <p
                            className="text-xs font-semibold uppercase tracking-wider drop-shadow-md"
                            style={{ color: clockColor, opacity: 0.9 }}
                          >
                            {formattedDate}
                          </p>

                          <h1
                            className={`${getClockFontFamily()} ${getClockSizeClass()} font-extrabold leading-none drop-shadow-xl transition-all duration-200`}
                            style={{ color: clockColor }}
                          >
                            {formattedHours}
                          </h1>

                          {/* Weather Widget */}
                          <div className="pt-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                sounds.playTap();
                                setIsCelsius(!isCelsius);
                              }}
                              className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-medium flex items-center gap-1.5 shadow hover:bg-black/60 transition"
                            >
                              <CloudSun className="w-3 h-3 text-amber-400" />
                              <span>
                                {isCelsius
                                  ? `${Math.round(((weatherTemp - 32) * 5) / 9)}°C`
                                  : `${weatherTemp}°F`}{' '}
                                • Clear Sky
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Lock Screen Music Widget (if enabled) */}
                        <div className="my-auto">
                          <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/10 text-white shadow-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center shadow">
                                  <Music className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold truncate max-w-[130px]">
                                    {tracks[musicTrack].title}
                                  </p>
                                  <p className="text-[10px] text-slate-300">
                                    {tracks[musicTrack].artist}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playTap();
                                    setIsPlayingMusic(!isPlayingMusic);
                                  }}
                                  className="p-2 rounded-full bg-white text-slate-900 hover:scale-105 active:scale-95 transition shadow"
                                >
                                  {isPlayingMusic ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playTap();
                                    setMusicTrack((t) => (t + 1) % tracks.length);
                                  }}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                                >
                                  <SkipForward className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Simulated Audio Visualizer / Scrubber */}
                            <div className="space-y-1">
                              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-indigo-400 rounded-full transition-all duration-300 ${
                                    isPlayingMusic ? 'w-2/3 animate-pulse' : 'w-1/4'
                                  }`}
                                />
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                <span>1:12</span>
                                <span>{tracks[musicTrack].duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Flashlight & Camera Quick Controls */}
                        <div className="space-y-3 pb-1">
                          <div className="flex items-center justify-between px-2">
                            <button
                              type="button"
                              onClick={toggleFlashlight}
                              className={`p-3 rounded-full backdrop-blur-xl border transition-all active:scale-90 shadow-lg ${
                                flashlightOn
                                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/50'
                                  : 'bg-black/40 hover:bg-black/60 text-white border-white/15'
                              }`}
                              title="Toggle Torch"
                            >
                              <Flashlight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={triggerCamera}
                              className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-lg active:scale-90 transition"
                              title="Shutter Snapshot"
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Swipe/Tap to Unlock Bar */}
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={toggleUnlock}
                              className="group flex flex-col items-center gap-1 text-[10px] font-semibold text-white/80 hover:text-white transition"
                            >
                              <span className="flex items-center gap-1 group-hover:scale-105 transition-transform">
                                <Unlock className="w-3 h-3" /> Tap to Unlock
                              </span>
                              <div className="w-28 h-1 bg-white/70 rounded-full group-hover:bg-white transition-colors" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* HOME SCREEN VIEW */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col justify-between py-2"
                      >
                        {/* App Icons Grid */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-4 gap-3 pt-2">
                            {[
                              { name: 'Gallery', icon: '🖼️', color: 'bg-indigo-600' },
                              { name: 'Camera', icon: '📷', color: 'bg-slate-700' },
                              { name: 'Music', icon: '🎵', color: 'bg-rose-500' },
                              { name: 'Weather', icon: '☀️', color: 'bg-sky-500' },
                              { name: 'Studio', icon: '✨', color: 'bg-purple-600' },
                              { name: 'Files', icon: '📁', color: 'bg-amber-600' },
                              { name: 'Settings', icon: '⚙️', color: 'bg-slate-600' },
                              { name: 'Themes', icon: '🎨', color: 'bg-emerald-600' },
                            ].map((app, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => sounds.playTap()}
                                className="flex flex-col items-center gap-1 group"
                              >
                                <div className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                                  {app.icon}
                                </div>
                                <span className="text-[9px] font-medium text-white/90 drop-shadow">
                                  {app.name}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Home Screen Interactive Widget */}
                          <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold flex items-center gap-1 text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" /> Daily Inspiration
                              </span>
                              <span className="text-[10px] text-slate-300">4K OLED</span>
                            </div>
                            <p className="text-[10px] text-slate-200 line-clamp-1 font-light">
                              {previewWallpaper.title} — Ultra HD resolution
                            </p>
                          </div>
                        </div>

                        {/* Dock & Lock Device Button */}
                        <div className="space-y-2">
                          <div className="p-2 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 grid grid-cols-4 gap-2">
                            {['📞', '💬', '🧭', '⚙️'].map((icon, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => sounds.playTap()}
                                className="w-10 h-10 mx-auto rounded-xl bg-black/30 flex items-center justify-center text-lg shadow hover:scale-105 active:scale-95 transition"
                              >
                                {icon}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={toggleUnlock}
                              className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-semibold text-white/80 hover:text-white flex items-center gap-1 shadow"
                            >
                              <Lock className="w-3 h-3" /> Lock Device
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Bottom Quick Controls for Simulator */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setParallaxEnabled(!parallaxEnabled);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    parallaxEnabled
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>3D Tilt Parallax: {parallaxEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleUnlock}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isUnlocked ? 'Lock Screen' : 'Unlock Screen'}</span>
                </button>
              </div>
            </div>

            {/* Right: Interactive Customizer Studio Panel */}
            <div className="lg:col-span-5 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Tabs */}
                <div className="grid grid-cols-3 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab('customize');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      activeTab === 'customize'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Clock & Style
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab('effects');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      activeTab === 'effects'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Color & FX
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab('widgets');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      activeTab === 'widgets'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Atmosphere
                  </button>
                </div>

                {/* TAB 1: CLOCK & STYLE */}
                {activeTab === 'customize' && (
                  <div className="space-y-4">
                    {/* Clock Typography Picker */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Clock Typography
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'modern', label: 'Modern Sans' },
                          { id: 'serif', label: 'Classic Serif' },
                          { id: 'cyber', label: 'Cyber Mono' },
                          { id: 'neon', label: 'Neon Glow' },
                          { id: 'condensed', label: 'Bold Tall' },
                          { id: 'minimal', label: 'Minimal Thin' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setClockStyle(item.id as ClockStyle);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left ${
                              clockStyle === item.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clock Color Palette */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Clock & UI Tint
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          '#ffffff',
                          '#38bdf8',
                          '#facc15',
                          '#4ade80',
                          '#f43f5e',
                          '#c084fc',
                          '#fb923c',
                          ...previewWallpaper.colorPalette.filter(c => c !== '#000000')
                        ].slice(0, 8).map((hex, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setClockColor(hex);
                            }}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-md ${
                              clockColor === hex ? 'border-white scale-110 ring-2 ring-indigo-500' : 'border-slate-800'
                            }`}
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Clock Size & Format */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                          Clock Size
                        </label>
                        <div className="grid grid-cols-3 p-1 bg-slate-950 rounded-xl border border-slate-800">
                          {(['sm', 'md', 'lg'] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                sounds.playTap();
                                setClockSize(sz);
                              }}
                              className={`py-1 text-xs font-bold rounded-lg uppercase ${
                                clockSize === sz ? 'bg-indigo-600 text-white' : 'text-slate-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                          Time Format
                        </label>
                        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setUse24Hour(false);
                            }}
                            className={`py-1 text-xs font-bold rounded-lg ${
                              !use24Hour ? 'bg-indigo-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            12-Hour
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setUse24Hour(true);
                            }}
                            className={`py-1 text-xs font-bold rounded-lg ${
                              use24Hour ? 'bg-indigo-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            24-Hour
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: COLOR & FX SLIDERS */}
                {activeTab === 'effects' && (
                  <div className="space-y-3.5">
                    {/* Brightness */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">Brightness</span>
                        <span className="font-mono text-indigo-400">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">Contrast</span>
                        <span className="font-mono text-indigo-400">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">Saturation / Vibrancy</span>
                        <span className="font-mono text-indigo-400">{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Hue Rotation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">Hue Color Shift</span>
                        <span className="font-mono text-indigo-400">{hueRotate}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hueRotate}
                        onChange={(e) => setHueRotate(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">Depth Blur</span>
                        <span className="font-mono text-indigo-400">{blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={blur}
                        onChange={(e) => setBlur(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setBrightness(100);
                          setContrast(100);
                          setSaturation(100);
                          setHueRotate(0);
                          setBlur(0);
                        }}
                        className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <RotateCw className="w-3 h-3" /> Reset Image Sliders
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: ATMOSPHERE & AMBIENT OVERLAYS */}
                {activeTab === 'widgets' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Animated Screen Atmosphere
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'none', label: 'Clean Crystal', desc: 'No particle overlay' },
                          { id: 'sparkles', label: 'Cosmic Shimmer', desc: 'Floating starlight sparkles' },
                          { id: 'dust', label: 'Floating Dust', desc: 'Slow ambient purple particles' },
                          { id: 'rain', label: 'Rain Droplets', desc: 'Soft cyan precipitation' },
                        ].map((fx) => (
                          <button
                            key={fx.id}
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setAmbientEffect(fx.id as AmbientEffect);
                            }}
                            className={`p-3 rounded-xl border text-left transition ${
                              ambientEffect === fx.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <p className="font-bold text-xs">{fx.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{fx.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Hex Palettes */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Dominant Color Hex Codes (Click to Copy)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {previewWallpaper.colorPalette.map((hex, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(hex);
                              sounds.playTap();
                              setCopiedHex(hex);
                              setTimeout(() => setCopiedHex(null), 2000);
                            }}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs font-mono text-slate-300 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-700"
                                style={{ backgroundColor: hex }}
                              />
                              <span>{hex}</span>
                            </div>
                            {copiedHex === hex ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <span className="text-[10px] text-slate-500">Copy</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target Device: Mobile 9:16 FHD+</span>
                  <span className="font-mono text-slate-300">{previewWallpaper.resolution}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() => handleDownload('4K')}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Saved to Device!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download 4K Ultra-HD</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(previewWallpaper.imageUrl);
                        sounds.playSparkle();
                        alert('Wallpaper link copied to clipboard!');
                      }
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span>Share Wallpaper</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
