import { AnimatePresence, motion } from "framer-motion";
import { Undo2, Trash2, X, Target } from "lucide-react";
import { useMeasurementStore } from "@/store/measurementStore";

export const ActionButtons = () => {
  const {
    measurements,
    pendingPoint,
    cancelPendingPoint,
    removeMeasurement,
    clearAllMeasurements,
    selectedMeasurementId,
  } = useMeasurementStore();

  const hasAny = measurements.length > 0 || pendingPoint;

  return (
    <AnimatePresence>
      {hasAny && (
        <motion.div
          initial={{ y: 30, opacity: 0, x: 30 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          exit={{ y: 30, opacity: 0, x: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="absolute bottom-36 right-5 md:right-7 z-30 flex flex-col gap-3"
        >
          <AnimatePresence>
            {pendingPoint && (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={cancelPendingPoint}
                className="btn-warn group h-12 w-12 !p-0"
                title="取消起点"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedMeasurementId && (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={() =>
                  selectedMeasurementId &&
                  removeMeasurement(selectedMeasurementId)
                }
                className="btn-warn group"
                title="删除选中标注"
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline">删除选中</span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {measurements.length > 0 && (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={clearAllMeasurements}
                className="btn-danger group"
                title="清空全部标注"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">清空全部</span>
                <span className="sm:hidden digit-display font-bold">
                  {measurements.length}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {!pendingPoint && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur border border-white/10 whitespace-nowrap">
                <Target className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-xs text-white/70">点击画面开始测距</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
