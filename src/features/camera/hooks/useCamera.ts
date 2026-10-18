import { useEffect, useRef, useState } from "react";

export type FacingMode = "user" | "environment";
export type CameraErrorCode =
  | "insecure"
  | "unsupported"
  | "preview"
  | "denied"
  | "missing"
  | "busy"
  | "overconstrained"
  | "unknown";
type CameraStatus = "idle" | "starting" | "ready" | "error";

export function useCamera(active: boolean, facing: FacingMode, retryToken = 0) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<CameraErrorCode | null>(null);
  const [canFlip, setCanFlip] = useState(false);

  useEffect(() => {
    if (!active) {
      setStatus("idle");
      setError(null);
      return;
    }

    const holder: { stream: MediaStream | null } = { stream: null };
    let cancelled = false;

    async function start() {
      setStatus("starting");
      setError(null);

      if (!window.isSecureContext) {
        setStatus("error");
        setError("insecure");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setError("unsupported");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: facing,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        holder.stream = stream;
        if (cancelled) {
          stopStream(stream);
          return;
        }

        const video = videoRef.current;
        if (!video) {
          stopStream(stream);
          setStatus("error");
          setError("preview");
          return;
        }

        video.srcObject = stream;
        await video.play();
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setCanFlip(devices.filter((device) => device.kind === "videoinput").length > 1);
        setStatus("ready");
      } catch (caught) {
        if (cancelled) return;
        setStatus("error");
        setError(cameraErrorCode(caught));
      }
    }

    void start();

    return () => {
      cancelled = true;
      stopStream(holder.stream);
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [active, facing, retryToken]);

  return { videoRef, status, error, canFlip };
}

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

function cameraErrorCode(error: unknown): CameraErrorCode {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") return "denied";
  if (name === "NotFoundError" || name === "DevicesNotFoundError") return "missing";
  if (name === "NotReadableError" || name === "TrackStartError") return "busy";
  if (name === "SecurityError") return "insecure";
  if (name === "OverconstrainedError") return "overconstrained";
  return "unknown";
}
