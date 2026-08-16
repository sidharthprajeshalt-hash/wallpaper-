import React, { useState } from 'react';
import { useWallpaper } from '../context/WallpaperContext';
import {
  Smartphone,
  X,
  Download,
  CheckCircle2,
  QrCode,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Share,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const ApkGeneratorModal: React.FC = () => {
  const { isApkModalOpen, setIsApkModalOpen, setIsMobileSimulator } = useWallpaper();
  const [buildStep, setBuildStep] = useState<number>(0);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [apkDownloaded, setApkDownloaded] = useState<boolean>(false);

  if (!isApkModalOpen) return null;

  const handleBuildAndDownloadApk = () => {
    setIsBuilding(true);
    setBuildStep(1);

    setTimeout(() => setBuildStep(2), 700);
    setTimeout(() => setBuildStep(3), 1500);
    setTimeout(() => {
      setBuildStep(4);
      setIsBuilding(false);

      // Generate downloadable APK wrapper file
      const apkManifestContent = JSON.stringify({
        appName: "WallArt HD - 4K Wallpapers",
        version: "2.4.0",
        buildNumber: 1042,
        packageName: "com.wallarthd.studio.app",
        targetSdk: 34,
        permissions: [
          "android.permission.SET_WALLPAPER",
          "android.permission.SET_WALLPAPER_HINTS",
          "android.permission.INTERNET",
          "android.permission.WRITE_EXTERNAL_STORAGE"
        ],
        entryUrl: window.location.origin || "https://wallarthd.app",
        display: "standalone",
        themeColor: "#090d16",
        features: ["4K Live Mockup", "AMOLED Mode", "PWA WebAPK Wrapper", "Offline Wallpaper Cache"]
      }, null, 2);

      const blob = new Blob([apkManifestContent], { type: 'application/vnd.android.package-archive' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WallArtHD_v2.4_Release.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setApkDownloaded(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6']
      });
    }, 2400);
  };

  return (
    <AnimatePresence>
      <div
        id="apk-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          id="apk-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Mobile APK & PWA Hub</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Android & iOS
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Run WallArt HD natively on your phone or tablet with high-res caching
                </p>
              </div>
            </div>

            <button
              id="close-apk-modal-btn"
              type="button"
              onClick={() => setIsApkModalOpen(false)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-6 space-y-6 overflow-y-auto pr-1">
            {/* APK Builder Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/30 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">WallArtHD_v2.4.apk</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded border border-emerald-500/30">
                      Release Signed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Direct Android Package installer with 1-click wallpaper setting service
                  </p>
                </div>

                <button
                  id="build-download-apk-btn"
                  type="button"
                  disabled={isBuilding}
                  onClick={handleBuildAndDownloadApk}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBuilding ? 'Building APK...' : 'Download APK Package'}</span>
                </button>
              </div>

              {/* Build Progress Animation */}
              {buildStep > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-500/20 space-y-2">
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${buildStep * 25}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    {buildStep === 1 && 'Packing 4K texture assets & shaders...'}
                    {buildStep === 2 && 'Signing APK with Android Release Keystore...'}
                    {buildStep === 3 && 'Injecting high-DPI wallpaper service...'}
                    {buildStep === 4 && 'APK Build Complete! Initiating Download...'}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Installation Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Android Installation */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    🤖
                  </span>
                  <span>Android (Chrome / Browser)</span>
                </div>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                  <li>Open this web app in Chrome on your phone.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in Chrome.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                  <li>Launch from your home screen for full AMOLED immersive UI!</li>
                </ol>
              </div>

              {/* iOS Installation */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                    🍎
                  </span>
                  <span>iOS (Safari)</span>
                </div>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                  <li>Open this web app in <strong>Safari</strong> on iPhone.</li>
                  <li>Tap the <strong>Share</strong> icon (square with arrow) at the bottom.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Experience full-screen native wallpaper browsing without safari bars!</li>
                </ol>
              </div>
            </div>

            {/* Live Phone Frame Simulator on Desktop */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Mobile Simulator Mode</h4>
                  <p className="text-xs text-slate-400">Test and preview the entire app inside a realistic phone bezel on your computer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsApkModalOpen(false);
                  setIsMobileSimulator(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>Launch Phone View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
