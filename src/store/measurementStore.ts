import { create } from "zustand";
import type {
  AppState,
  Measurement,
  MeasurementActions,
  MeasurementStore,
  MeasurePoint,
} from "@/types";

const initialState: AppState = {
  cameraStatus: "idle",
  cameraError: null,
  pendingPoint: null,
  measurements: [],
  currentUnit: "cm",
  scaleConfig: {
    pixelsPerCm: 50,
    referenceLengthCm: 10,
  },
  isPanelExpanded: true,
  selectedMeasurementId: null,
  hoverPoint: null,
};

const recalcDistances = (
  measurements: Measurement[],
  pixelsPerCm: number,
): Measurement[] =>
  measurements.map((m) => ({
    ...m,
    realDistanceCm: m.pixelDistance / pixelsPerCm,
  }));

export const useMeasurementStore = create<MeasurementStore>(
  (set, get) => ({
    ...initialState,

    setCameraStatus: (status, error = null) =>
      set({ cameraStatus: status, cameraError: error }),

    addPendingPoint: (point: MeasurePoint) => {
      const { pendingPoint, scaleConfig } = get();

      if (!pendingPoint) {
        set({ pendingPoint: point });
        return;
      }

      const dx = (point.x - pendingPoint.x) * window.innerWidth;
      const dy = (point.y - pendingPoint.y) * window.innerHeight;
      const pixelDistance = Math.sqrt(dx * dx + dy * dy);

      const measurement: Measurement = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        pointA: pendingPoint,
        pointB: point,
        pixelDistance,
        realDistanceCm: pixelDistance / scaleConfig.pixelsPerCm,
        createdAt: Date.now(),
      };

      set((state) => ({
        measurements: [...state.measurements, measurement],
        pendingPoint: null,
        selectedMeasurementId: measurement.id,
      }));
    },

    cancelPendingPoint: () => set({ pendingPoint: null }),

    addMeasurement: (measurement: Measurement) =>
      set((state) => ({
        measurements: [...state.measurements, measurement],
      })),

    removeMeasurement: (id: string) =>
      set((state) => ({
        measurements: state.measurements.filter((m) => m.id !== id),
        selectedMeasurementId:
          state.selectedMeasurementId === id
            ? null
            : state.selectedMeasurementId,
      })),

    clearAllMeasurements: () =>
      set({ measurements: [], pendingPoint: null, selectedMeasurementId: null }),

    setUnit: (unit) => set({ currentUnit: unit }),

    setScaleConfig: (config) =>
      set((state) => {
        const newScale = { ...state.scaleConfig, ...config };
        const updatedMeasurements =
          config.pixelsPerCm !== undefined
            ? recalcDistances(state.measurements, config.pixelsPerCm)
            : state.measurements;
        return {
          scaleConfig: newScale,
          measurements: updatedMeasurements,
        };
      }),

    togglePanel: () =>
      set((state) => ({ isPanelExpanded: !state.isPanelExpanded })),

    selectMeasurement: (id) => set({ selectedMeasurementId: id }),

    setHoverPoint: (point) => set({ hoverPoint: point }),
  }),
);

export const formatDistance = (cm: number, unit: "cm" | "m"): string => {
  if (unit === "m") {
    const m = cm / 100;
    return `${m.toFixed(2)} m`;
  }
  if (cm >= 100) {
    return `${(cm / 100).toFixed(2)} m`;
  }
  return `${cm.toFixed(1)} cm`;
};
