import { motion } from "framer-motion";
import { Eye, Ruler, Sparkles } from "lucide-react";
import { useMeasurementStore, formatDistance } from "@/store/measurementStore";

export const TopStatusBar = () => {
  const { measurements, currentUnit, scaleConfig, pendingPoint } =
    useMeasurementStore();

  const totalDistanceCm = measurements.reduce(
    (sum, m) => sum + m.realDistanceCm,
    0,
  );

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 inset-x-0 z-30 pointer-events-none"
    >
      <div className="mx-auto max-w-[1400px] px-5 pt-5">
        <div className="glass-panel px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan/25 to-neon-cyan/5 border border-neon-cyan/40 flex items-center justify-center shadow-neon-cyan">
              <Eye className="w-5 h-5 text-neon-cyan" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-base tracking-tight">
                  视觉测算 AI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 font-medium">
                  8805 · 3805
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/45">
                <Sparkles className="w-3 h-3" />
                <span>实时视觉测算 · 隐私安全零缓存</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Ruler className="w-3.5 h-3.5 text-neon-cyan" />
              <div className="text-xs text-white/50">标尺比例</div>
              <div className="digit-display text-neon-cyan text-sm font-semibold">
                {scaleConfig.pixelsPerCm.toFixed(0)} px/cm
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F5D4]" />
              <div className="text-xs text-white/50">测量数</div>
              <div className="digit-display text-neon-cyan text-sm font-semibold">
                {measurements.length}
              </div>
            </div>

            {measurements.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                <div className="text-xs text-neon-cyan/80">累计总长</div>
                <div className="digit-display text-white text-sm font-bold text-shadow-neon">
                  {formatDistance(totalDistanceCm, currentUnit)}
                </div>
              </div>
            )}

            {pendingPoint && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-orange/15 border border-neon-orange/40"
              >
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-neon-orange block" />
                  <span className="absolute inset-0 rounded-full bg-neon-orange animate-ping opacity-70" />
                </div>
                <div className="text-xs text-neon-orange font-medium">
                  已选起点 · 点击第二点
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
