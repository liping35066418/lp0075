import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Camera, CameraOff, AlertTriangle, Loader2, Scan } from "lucide-react";
import { useMeasurementStore } from "@/store/measurementStore";
import { useCamera } from "@/hooks/useCamera";

interface CameraPreviewProps {
  onReady?: () => void;
}

export const CameraPreview = ({ onReady }: CameraPreviewProps) => {
  const { videoRef, startCamera, stopCamera, streamReady } = useCamera();
  const { cameraStatus, cameraError, measurements } = useMeasurementStore();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current && cameraStatus === "idle") {
      startedRef.current = true;
      startCamera();
    }
  }, [cameraStatus, startCamera]);

  useEffect(() => {
    if (streamReady) onReady?.();
  }, [streamReady, onReady]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-space-950">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(1)" }}
      />

      <div className="absolute inset-0 pointer-events-none grid-overlay-bg opacity-60" />

      <AnimatePresence>
        {streamReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              animate={{ y: ["-10%", "110%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-24"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,245,212,0.12), transparent)",
                filter: "blur(2px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cameraStatus === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-space-950/90 backdrop-blur-sm z-20"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 border border-neon-cyan/30 flex items-center justify-center shadow-neon-cyan">
              <Camera className="w-12 h-12 text-neon-cyan" strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">视觉测算 AI</h2>
              <p className="text-white/60 text-sm max-w-sm">
                点击下方按钮启动摄像头，开启实景实时测量体验
              </p>
            </div>
            <button onClick={startCamera} className="btn-primary px-8 py-3 text-base">
              <Scan className="w-5 h-5" />
              启动摄像头
            </button>
          </motion.div>
        )}

        {cameraStatus === "requesting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-space-950/95 backdrop-blur-md z-20"
          >
            <div className="relative">
              <Loader2 className="w-14 h-14 text-neon-cyan animate-spin" strokeWidth={1.2} />
              <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/20 animate-ping" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-medium text-white">正在请求摄像头权限</h3>
              <p className="text-white/50 text-sm">请在浏览器弹窗中允许访问</p>
            </div>
          </motion.div>
        )}

        {cameraStatus === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-space-950/95 backdrop-blur-md z-20 p-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-orange/20 to-neon-red/10 border border-neon-orange/40 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-neon-orange" strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <h3 className="text-xl font-medium text-white">无法访问摄像头</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {cameraError || "请检查浏览器权限设置，确保已允许摄像头访问"}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={startCamera} className="btn-primary px-6 py-2.5">
                <Camera className="w-4 h-4" />
                重新授权
              </button>
              <button onClick={stopCamera} className="btn-glass px-6 py-2.5 text-white/70">
                <CameraOff className="w-4 h-4" />
                取消
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 pointer-events-none z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              streamReady
                ? "bg-neon-green shadow-[0_0_8px_#00FF94] animate-pulse"
                : "bg-white/30"
            }`}
          />
          <span className="text-white/80 font-medium">
            {streamReady ? "LIVE" : cameraStatus.toUpperCase()}
          </span>
          {measurements.length > 0 && (
            <>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-neon-cyan digit-display">{measurements.length}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
