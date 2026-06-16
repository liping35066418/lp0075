import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMeasurementStore, formatDistance } from "@/store/measurementStore";
import { createPoint, clampPercent } from "@/utils/distanceCalc";
import {
  setupHiDPICanvas,
  clearCanvas,
  drawGrid,
  drawReferenceRuler,
  drawMeasurement,
  drawMeasurePoint,
  drawMeasureLine,
} from "@/utils/canvasDrawing";

export const MeasurementCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const animStartRef = useRef<Record<string, number>>({});

  const {
    measurements,
    pendingPoint,
    scaleConfig,
    currentUnit,
    selectedMeasurementId,
    hoverPoint,
    cameraStatus,
    addPendingPoint,
    setHoverPoint,
    setCanvasSize,
  } = useMeasurementStore();

  const selectedId = selectedMeasurementId;

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    sizeRef.current = { w, h };
    setCanvasSize({ width: w, height: h });
    setupHiDPICanvas(canvas, w, h);
  }, [setCanvasSize]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let cx = 0;
    let cy = 0;
    if ("touches" in e) {
      const t = e.touches[0] || e.changedTouches[0];
      if (!t) return null;
      cx = t.clientX;
      cy = t.clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }
    const x = clampPercent((cx - rect.left) / rect.width);
    const y = clampPercent((cy - rect.top) / rect.height);
    return { x, y };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (cameraStatus !== "active") return;
      const p = getPoint(e);
      if (!p) return;
      const point = createPoint(p.x, p.y);
      addPendingPoint(point);
      if (!pendingPoint) {
        // first point: do nothing extra, wait for second
      }
    },
    [cameraStatus, getPoint, addPendingPoint, pendingPoint],
  );

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (cameraStatus !== "active") return;
      const p = getPoint(e);
      setHoverPoint(p);
    },
    [cameraStatus, getPoint, setHoverPoint],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (cameraStatus !== "active") return;
      const p = getPoint(e);
      if (!p) return;
      const point = createPoint(p.x, p.y);
      addPendingPoint(point);
    },
    [cameraStatus, getPoint, addPendingPoint],
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    clearCanvas(ctx, w, h);
    drawGrid(ctx, w, h, 48);
    drawReferenceRuler(
      ctx,
      w / 2,
      h * 0.68,
      scaleConfig.pixelsPerCm,
      scaleConfig.referenceLengthCm,
    );

    const now = Date.now();

    measurements.forEach((m) => {
      if (!animStartRef.current[m.id]) {
        animStartRef.current[m.id] = now;
      }
      const start = animStartRef.current[m.id];
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / 500);
      const eased = 1 - Math.pow(1 - progress, 3);
      const formatted = formatDistance(m.realDistanceCm, currentUnit);
      const selected = selectedId === m.id;
      drawMeasurement(ctx, m, w, h, formatted, selected, eased);
    });

    if (pendingPoint) {
      const ax = pendingPoint.x * w;
      const ay = pendingPoint.y * h;
      drawMeasurePoint(ctx, ax, ay, { color: "#FF6B35", label: "起点" });

      if (hoverPoint) {
        const bx = hoverPoint.x * w;
        const by = hoverPoint.y * h;
        drawMeasureLine(ctx, ax, ay, bx, by, {
          color: "rgba(255, 107, 53, 0.6)",
          dashed: true,
        });

        const dxp = (hoverPoint.x - pendingPoint.x) * w;
        const dyp = (hoverPoint.y - pendingPoint.y) * h;
        const pixelD = Math.sqrt(dxp * dxp + dyp * dyp);
        const cm = pixelD / scaleConfig.pixelsPerCm;
        const label = formatDistance(cm, currentUnit);

        const mx = ((pendingPoint.x + hoverPoint.x) / 2) * w;
        const my = ((pendingPoint.y + hoverPoint.y) / 2) * h - 34;

        ctx.save();
        ctx.font = "600 13px Orbitron, system-ui, sans-serif";
        const metrics = ctx.measureText(label);
        const padX = 10,
          padY = 6;
        const bw = metrics.width + padX * 2;
        const bh = 26;
        const rx = mx - bw / 2,
          ry = my - bh / 2;
        ctx.fillStyle = "rgba(255, 107, 53, 0.18)";
        ctx.strokeStyle = "rgba(255, 107, 53, 0.7)";
        ctx.lineWidth = 1.25;
        roundRect(ctx, rx, ry, bw, bh, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#FF6B35";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, mx, my + 1);
        ctx.restore();
      }
    } else if (hoverPoint && cameraStatus === "active") {
      const hx = hoverPoint.x * w;
      const hy = hoverPoint.y * h;
      ctx.save();
      ctx.strokeStyle = "rgba(0, 245, 212, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(w, hy);
      ctx.moveTo(hx, 0);
      ctx.lineTo(hx, h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(0, 245, 212, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hx, hy, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(render);
  }, [
    measurements,
    pendingPoint,
    scaleConfig,
    currentUnit,
    selectedId,
    hoverPoint,
    cameraStatus,
  ]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverPoint(null)}
      onTouchStart={handleTouchStart}
      className="measure-canvas absolute inset-0 w-full h-full z-10"
      style={{ display: "block" }}
    />
  );
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const __memo_stub = () => useMemo(() => null, []);
