import type { Measurement, MeasurePoint } from "@/types";
import { getMidpoint } from "./distanceCalc";

export const setupHiDPICanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, width, height);
};

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize = 40,
  color = "rgba(0, 245, 212, 0.04)",
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
};

export const drawReferenceRuler = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  pixelsPerCm: number,
  lengthCm = 10,
) => {
  const totalPx = pixelsPerCm * lengthCm;
  const startX = centerX - totalPx / 2;
  const endX = centerX + totalPx / 2;
  const y = centerY;

  ctx.save();
  ctx.lineCap = "round";

  ctx.strokeStyle = "rgba(0, 245, 212, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(endX, y);
  ctx.stroke();

  for (let i = 0; i <= lengthCm; i++) {
    const x = startX + i * pixelsPerCm;
    const isMajor = i % 5 === 0;
    const tickH = isMajor ? 14 : 7;
    ctx.strokeStyle = isMajor
      ? "rgba(0, 245, 212, 0.85)"
      : "rgba(0, 245, 212, 0.4)";
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, y - tickH);
    ctx.lineTo(x, y + tickH);
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = "rgba(0, 245, 212, 0.9)";
      ctx.font = "500 11px Orbitron, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i}`, x, y + 28);
    } else {
      const midCm = i + 0.5;
      if (midCm <= lengthCm) {
        const mx = startX + (i + 0.5) * pixelsPerCm;
        ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx, y - 4);
        ctx.lineTo(mx, y + 4);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "500 12px Orbitron, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`参考标尺 · ${lengthCm} cm`, centerX, y - 26);

  ctx.restore();
};

export const drawMeasurePoint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  opts: { color?: string; pulse?: boolean; label?: string } = {},
) => {
  const { color = "#00FF94", pulse = true, label } = opts;

  ctx.save();
  if (pulse) {
    const t = (Date.now() % 1600) / 1600;
    const alpha = 0.7 * (1 - t);
    const r = 6 + t * 18;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
    if (!color.startsWith("rgb")) {
      ctx.strokeStyle = hexToRgba(color, alpha);
    }
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "#0A0E1A";
  ctx.fill();

  if (label) {
    ctx.font = "600 11px Orbitron, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 16);
  }
  ctx.restore();
};

export const drawMeasureLine = (
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  opts: { color?: string; dashed?: boolean; animated?: boolean; progress?: number } = {},
) => {
  const {
    color = "#00F5D4",
    dashed = false,
    animated = false,
    progress = 1,
  } = opts;

  const endX = ax + (bx - ax) * progress;
  const endY = ay + (by - ay) * progress;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  if (dashed) ctx.setLineDash([6, 6]);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const drawArrow = (x: number, y: number, angle: number) => {
    const size = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - size * Math.cos(angle - Math.PI / 6),
      y - size * Math.sin(angle - Math.PI / 6),
    );
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - size * Math.cos(angle + Math.PI / 6),
      y - size * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();
  };

  if (progress >= 1) {
    const angleA = Math.atan2(ay - by, ax - bx);
    const angleB = Math.atan2(by - ay, bx - ax);
    drawArrow(ax, ay, angleA);
    drawArrow(bx, by, angleB);
  }

  ctx.restore();
};

export const drawDistanceLabel = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  selected: boolean,
  dimmed = false,
) => {
  const padding = { x: 12, y: 7 };
  ctx.save();
  ctx.font = "700 14px Orbitron, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const w = metrics.width + padding.x * 2;
  const h = 30;

  const bgX = x - w / 2;
  const bgY = y - h / 2;

  const r = 10;
  ctx.beginPath();
  ctx.moveTo(bgX + r, bgY);
  ctx.lineTo(bgX + w - r, bgY);
  ctx.quadraticCurveTo(bgX + w, bgY, bgX + w, bgY + r);
  ctx.lineTo(bgX + w, bgY + h - r);
  ctx.quadraticCurveTo(bgX + w, bgY + h, bgX + w - r, bgY + h);
  ctx.lineTo(bgX + r, bgY + h);
  ctx.quadraticCurveTo(bgX, bgY + h, bgX, bgY + h - r);
  ctx.lineTo(bgX, bgY + r);
  ctx.quadraticCurveTo(bgX, bgY, bgX + r, bgY);
  ctx.closePath();

  const labelAlpha = dimmed ? 0.45 : 1;
  ctx.fillStyle = selected
    ? `rgba(0, 245, 212, ${0.18 * labelAlpha})`
    : `rgba(10, 14, 26, ${0.78 * labelAlpha})`;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = selected
    ? hexToRgba("#00F5D4", dimmed ? 0.6 : 0.85)
    : `rgba(0, 245, 212, ${(dimmed ? 0.2 : 0.35)})`;
  ctx.stroke();
  if (selected) {
    ctx.shadowColor = "#00F5D4";
    ctx.shadowBlur = dimmed ? 6 : 18;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = selected
    ? hexToRgba("#00F5D4", dimmed ? 0.6 : 1)
    : `rgba(255, 255, 255, ${dimmed ? 0.55 : 1})`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
  ctx.restore();
};

export const drawMeasurement = (
  ctx: CanvasRenderingContext2D,
  m: Measurement,
  width: number,
  height: number,
  formattedValue: string,
  selected: boolean,
  animationProgress = 1,
  dimmed = false,
) => {
  const ax = m.pointA.x * width;
  const ay = m.pointA.y * height;
  const bx = m.pointB.x * width;
  const by = m.pointB.y * height;

  const alpha = dimmed ? 0.3 : 1;
  const lineColor = selected
    ? "#00F5D4"
    : hexToRgba("#00F5D4", alpha);
  const pointColor = selected
    ? "#00FF94"
    : hexToRgba("#00FF94", alpha);

  drawMeasureLine(ctx, ax, ay, bx, by, {
    color: lineColor,
    animated: animationProgress < 1,
    progress: animationProgress,
  });

  drawMeasurePoint(ctx, ax, ay, {
    color: pointColor,
    pulse: selected || !dimmed,
  });
  drawMeasurePoint(ctx, bx, by, {
    color: pointColor,
    pulse: selected || !dimmed,
  });

  if (animationProgress >= 0.6) {
    const mid = getMidpoint(m.pointA, m.pointB);
    const mx = mid.x * width;
    const my = mid.y * height - 38;
    drawDistanceLabel(ctx, formattedValue, mx, my, selected, dimmed);
  }
};

const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const drawScanLine = (
  ctx: CanvasRenderingContext2D,
  width: number,
  progress: number,
) => {
  const y = progress * ctx.canvas.height / (window.devicePixelRatio || 1);
  const grad = ctx.createLinearGradient(0, y - 60, 0, y + 60);
  grad.addColorStop(0, "rgba(0, 245, 212, 0)");
  grad.addColorStop(0.5, "rgba(0, 245, 212, 0.08)");
  grad.addColorStop(1, "rgba(0, 245, 212, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, y - 60, width, 120);
};
