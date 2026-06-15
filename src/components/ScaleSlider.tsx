import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Maximize2, Minimize2 } from "lucide-react";
import { useMeasurementStore } from "@/store/measurementStore";

const MIN = 5;
const MAX = 200;
const STEP = 1;

export const ScaleSlider = () => {
  const { scaleConfig, setScaleConfig } = useMeasurementStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [value, setValue] = useState(scaleConfig.pixelsPerCm);

  useEffect(() => {
    setValue(scaleConfig.pixelsPerCm);
  }, [scaleConfig.pixelsPerCm]);

  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  const commit = useCallback(
    (v: number) => {
      const clamped = Math.min(Math.max(v, MIN), MAX);
      setValue(clamped);
      setScaleConfig({ pixelsPerCm: clamped });
    },
    [setScaleConfig],
  );

  const fromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const v = MIN + ratio * (MAX - MIN);
      return Math.round(v / STEP) * STEP;
    },
    [value],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    commit(fromClientX(e.clientX));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    commit(fromClientX(e.clientX));
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const presets = [10, 30, 50, 80, 120];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neon-cyan" />
          <span>标尺比例校准</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => commit(value - 5)}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
            title="减小"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 min-w-[88px] text-center">
            <span className="digit-display text-neon-cyan text-sm font-bold text-shadow-neon">
              {value.toFixed(0)}
            </span>
            <span className="text-[10px] text-neon-cyan/70 ml-1">px/cm</span>
          </div>
          <button
            onClick={() => commit(value + 5)}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
            title="增大"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="ruler-track select-none cursor-pointer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="ruler-fill" style={{ width: `${percent}%` }} />
        <div className="absolute inset-0 flex items-center justify-between px-[6px] pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="w-px h-[6px] bg-white/10 rounded-full"
              style={{ opacity: i === 0 || i === 8 ? 0 : 1 }}
            />
          ))}
        </div>
        <motion.div
          className="ruler-thumb"
          style={{ left: `${percent}%` }}
          whileTap={{ scale: 1.15 }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/35 px-1">
        <span>{MIN} px/cm</span>
        <div className="flex items-center gap-1.5">
          <span className="text-white/30">快速</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => commit(p)}
              className={`px-2 py-0.5 rounded-md border text-[10px] transition-all ${
                Math.abs(value - p) < 1
                  ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/25"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span>{MAX} px/cm</span>
      </div>
    </div>
  );
};
