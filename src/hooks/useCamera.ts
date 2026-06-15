import { useCallback, useEffect, useRef, useState } from "react";
import { useMeasurementStore } from "@/store/measurementStore";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  streamReady: boolean;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  const setCameraStatus = useMeasurementStore((s) => s.setCameraStatus);

  const stopCamera = useCallback(() => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStreamReady(false);
      setCameraStatus("idle");
    } catch {
      /* ignore */
    }
  }, [setCameraStatus]);

  const startCamera = useCallback(async () => {
    setCameraStatus("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("当前浏览器不支持摄像头访问");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamReady(true);
        setCameraStatus("active");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "无法访问摄像头";
      setCameraStatus("error", msg);
      stopCamera();
    }
  }, [setCameraStatus, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, startCamera, stopCamera, streamReady };
};
