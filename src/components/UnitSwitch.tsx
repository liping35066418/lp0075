import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { useMeasurementStore } from "@/store/measurementStore";
import type { Unit } from "@/types";

const options: { value: Unit; label: string; hint: string }[] = [
  { value: "cm", label: "厘米", hint: "cm" },
  { value: "m", label: "米", hint: "m" },
];

export const UnitSwitch = () => {
  const { currentUnit, setUnit } = useMeasurementStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  const activeIdx = options.findIndex((o) => o.value === currentUnit);

  useEffect(() => {
    const calc = () => {
      const el = containerRef.current;
      if (!el) return;
      const children = el.querySelectorAll<HTMLElement>("[data-option]");
      const child = children[activeIdx];
      if (child) {
        setThumb({
          left: child.offsetLeft,
          width: child.offsetWidth,
        });
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [activeIdx]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Ruler className="w-3.5 h-3.5 text-neon-cyan" />
          <span>单位制式</span>
        </div>
        <span className="digit-display text-[11px] text-neon-cyan/80">
          {options[activeIdx].hint.toUpperCase()}
        </span>
      </div>
      <div ref={containerRef} className="segmented-control">
        <motion.div
          className="segmented-thumb"
          animate={{ x: thumb.left, width: thumb.width }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            data-option
            onClick={() => setUnit(o.value)}
            className={`segmented-option ${o.value === currentUnit ? "active" : ""}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              {o.label}
              <span className="text-[10px] opacity-70">{o.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
