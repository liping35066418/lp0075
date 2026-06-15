import type { MeasurePoint, Measurement, ScaleConfig } from "@/types";

export const calcPixelDistance = (
  a: MeasurePoint,
  b: MeasurePoint,
  viewportWidth: number,
  viewportHeight: number,
): number => {
  const dx = (b.x - a.x) * viewportWidth;
  const dy = (b.y - a.y) * viewportHeight;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calcRealDistanceCm = (
  pixelDistance: number,
  pixelsPerCm: number,
): number => pixelDistance / pixelsPerCm;

export const createMeasurement = (
  pointA: MeasurePoint,
  pointB: MeasurePoint,
  scale: ScaleConfig,
  viewportWidth: number,
  viewportHeight: number,
  label?: string,
): Measurement => {
  const pixelDistance = calcPixelDistance(
    pointA,
    pointB,
    viewportWidth,
    viewportHeight,
  );
  return {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    pointA,
    pointB,
    pixelDistance,
    realDistanceCm: calcRealDistanceCm(pixelDistance, scale.pixelsPerCm),
    createdAt: Date.now(),
    label,
  };
};

export const createPoint = (
  xPercent: number,
  yPercent: number,
): MeasurePoint => ({
  id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  x: xPercent,
  y: yPercent,
  timestamp: Date.now(),
});

export const clampPercent = (value: number, min = 0, max = 1): number =>
  Math.min(Math.max(value, min), max);

export const getMidpoint = (a: MeasurePoint, b: MeasurePoint) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});
