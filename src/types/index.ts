export interface MeasurePoint {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface Measurement {
  id: string;
  pointA: MeasurePoint;
  pointB: MeasurePoint;
  pixelDistance: number;
  realDistanceCm: number;
  createdAt: number;
  label?: string;
}

export interface ScaleConfig {
  pixelsPerCm: number;
  referenceLengthCm: number;
}

export type Unit = "cm" | "m";

export type CameraStatus = "idle" | "requesting" | "active" | "error";

export interface AppState {
  cameraStatus: CameraStatus;
  cameraError: string | null;
  pendingPoint: MeasurePoint | null;
  measurements: Measurement[];
  currentUnit: Unit;
  scaleConfig: ScaleConfig;
  isPanelExpanded: boolean;
  selectedMeasurementId: string | null;
  hoverPoint: { x: number; y: number } | null;
  canvasSize: { width: number; height: number };
}

export interface MeasurementActions {
  setCameraStatus: (status: CameraStatus, error?: string | null) => void;
  addPendingPoint: (point: MeasurePoint) => void;
  cancelPendingPoint: () => void;
  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (id: string) => void;
  clearAllMeasurements: () => void;
  setUnit: (unit: Unit) => void;
  setScaleConfig: (config: Partial<ScaleConfig>) => void;
  togglePanel: () => void;
  selectMeasurement: (id: string | null) => void;
  setHoverPoint: (point: { x: number; y: number } | null) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  setMeasurementLabel: (id: string, label: string) => void;
}

export type MeasurementStore = AppState & MeasurementActions;
