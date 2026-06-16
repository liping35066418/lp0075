import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListOrdered, Trash2, ArrowRightLeft, MapPin, Pencil, Check, X } from "lucide-react";
import { useMeasurementStore, formatDistance } from "@/store/measurementStore";

export const AnnotationList = () => {
  const {
    measurements,
    currentUnit,
    selectedMeasurementId,
    selectMeasurement,
    removeMeasurement,
    scaleConfig,
    setMeasurementLabel,
  } = useMeasurementStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (id: string, currentLabel?: string) => {
    setEditingId(id);
    setEditingValue(currentLabel || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const commitEdit = () => {
    if (editingId) {
      setMeasurementLabel(editingId, editingValue);
    }
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <ListOrdered className="w-3.5 h-3.5 text-neon-cyan" />
          <span>测量记录</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/45">
          <span>参考标尺</span>
          <span className="digit-display text-neon-cyan/80">
            {scaleConfig.referenceLengthCm} cm
          </span>
        </div>
      </div>

      {measurements.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
          <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center">
            <ArrowRightLeft className="w-6 h-6 text-neon-cyan/70" strokeWidth={1.5} />
          </div>
          <div className="text-center space-y-1">
            <div className="text-sm text-white/60">暂无测量记录</div>
            <div className="text-[11px] text-white/35">
              在画面中点击两点即可生成尺寸标注
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[230px] overflow-y-auto scrollbar-thin pr-1 -mr-1">
          <AnimatePresence initial={false}>
            {measurements.map((m, idx) => {
              const isSelected = selectedMeasurementId === m.id;
              const value = formatDistance(m.realDistanceCm, currentUnit);
              const isEditing = editingId === m.id;
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => !isEditing && selectMeasurement(isSelected ? null : m.id)}
                  className={`annotation-card group ${isSelected ? "selected" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-neon-cyan/20 border border-neon-cyan/50"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${
                          isSelected ? "text-neon-cyan" : "text-white/60"
                        }`}
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-space-800 border border-white/10 flex items-center justify-center text-[9px] digit-display font-bold text-white/80">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            ref={inputRef}
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={commitEdit}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="输入名称，如：桌宽"
                            className="flex-1 min-w-0 px-2 py-1 rounded-lg bg-white/5 border border-neon-cyan/40 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/40"
                            maxLength={20}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              commitEdit();
                            }}
                            className="w-7 h-7 rounded-lg bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/25 transition-all shrink-0"
                            title="确定"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all shrink-0"
                            title="取消"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-0.5 pr-1">
                          <span
                            className={`text-xs truncate ${
                              isSelected ? "text-neon-cyan/80" : "text-white/50"
                            }`}
                          >
                            测量 #{String(idx + 1).padStart(2, "0")}
                          </span>
                          {m.label && (
                            <span
                              className={`text-xs font-semibold truncate ${
                                isSelected ? "text-neon-cyan" : "text-white/85"
                              }`}
                              title={m.label}
                            >
                              · {m.label}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(m.id, m.label);
                            }}
                            className="ml-auto shrink-0 w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-white/35 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                            title="编辑名称"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {!isEditing && (
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`digit-display text-lg font-bold ${
                              isSelected
                                ? "text-neon-cyan text-shadow-neon"
                                : "text-white"
                            }`}
                          >
                            {m.label ? `${m.label}  ${value}` : value}
                          </span>
                          <span className="text-[10px] text-white/35">
                            像素 {m.pixelDistance.toFixed(0)} px
                          </span>
                        </div>
                      )}
                      {isSelected && !isEditing && (
                        <div className="mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
                            已选中 · 再次点击取消聚焦
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMeasurement(m.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-neon-red hover:border-neon-red/40 hover:bg-neon-red/10 transition-all shrink-0"
                      title="删除该标注"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
