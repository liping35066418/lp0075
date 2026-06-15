import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useMeasurementStore } from "@/store/measurementStore";
import { UnitSwitch } from "./UnitSwitch";
import { ScaleSlider } from "./ScaleSlider";
import { AnnotationList } from "./AnnotationList";

export const ControlPanel = () => {
  const { isPanelExpanded, togglePanel, measurements, cameraStatus } =
    useMeasurementStore();

  const isActive = cameraStatus === "active";

  return (
    <>
      <AnimatePresence>
        {!isPanelExpanded && (
          <motion.button
            key="expand-btn"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={togglePanel}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 glass-panel px-5 py-2.5 flex items-center gap-2.5 hover:border-neon-cyan/30 transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-white/75">展开控制面板</span>
            {measurements.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan digit-display">
                {measurements.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelExpanded && (
          <motion.div
            key="panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute bottom-0 inset-x-0 z-30"
          >
            <div className="mx-auto max-w-[1400px] px-5 pb-5">
              <div className="glass-panel overflow-hidden">
                <button
                  onClick={togglePanel}
                  className="w-full flex items-center justify-between px-5 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-1 bg-white/15 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-neon-cyan/70" />
                    </div>
                    <span className="text-sm text-white/75 font-medium">
                      控制面板
                    </span>
                    <span className="hidden sm:inline text-[11px] text-white/35">
                      单位切换 · 标尺校准 · 标注列表
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  </div>
                </button>

                <div className="p-5 pt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 space-y-5">
                    <UnitSwitch />
                  </div>

                  <div className="md:col-span-5 space-y-5">
                    <ScaleSlider />
                    {!isActive && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
                        <Info className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
                        <div className="text-xs text-neon-orange/80 leading-relaxed">
                          摄像头未启动，标尺校准与测量功能需要先启动摄像头才能使用。
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4">
                    <AnnotationList />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
