import { useRef, useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";

export default function CameraScreen() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const createOutfitMutation = trpc.outfit.create.useMutation();

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err: any) {
      const message =
        err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions."
          : err.name === "NotFoundError"
            ? "No camera found on this device."
            : `Camera error: ${err.message}`;
      setError(message);
      toast.error(message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      // Show flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 600);

      // Simulate AI analysis - in production, call actual API
      const detectedItems = ["White T-Shirt", "Blue Jeans", "White Sneakers"];
      const colorPalette = ["#FFFFFF", "#0066CC", "#F5F5F5"];
      const styleTags = ["casual", "minimalist", "comfortable"];
      const styleScore = 8;
      const recommendations = [
        "Add a denim jacket for extra style",
        "Perfect for casual outings",
        "Great color coordination",
      ];

      // Create outfit scan
      await createOutfitMutation.mutateAsync({
        imageUrl: imageData,
        detectedItems,
        colorPalette,
        styleScore,
        styleTags,
        weatherCondition: "Sunny",
        temperature: 22,
        weatherIcon: "sunny",
        recommendations,
      });

      toast.success("Outfit scanned successfully!");
      setTimeout(() => setLocation("/history"), 1000);
    } catch (err: any) {
      const message = `Capture failed: ${err.message}`;
      setError(message);
      toast.error(message);
    } finally {
      setIsCapturing(false);
    }
  }, [createOutfitMutation, setLocation]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <PageTransition type="slideUp">
      <div className="camera-fullscreen bg-background flex flex-col">
      {/* Video Stream */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Scanning Overlay */}
        {isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-80 border-2 border-accent rounded-2xl">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg"></div>

              {/* Scanning line */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-pulse"></div>
              </div>

              {/* Pulsing glow */}
              <div className="absolute inset-0 border-2 border-accent rounded-2xl opacity-30 animate-pulse-glow"></div>
            </div>

            {/* Status text */}
            <div className="absolute bottom-20 left-0 right-0 text-center">
              <p className="text-accent font-bold text-sm">Position outfit in frame</p>
            </div>
          </div>
        )}

        {/* Flash Effect */}
        {showFlash && (
          <div className="absolute inset-0 bg-accent animate-flash pointer-events-none"></div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-destructive/90 text-destructive-foreground p-4 text-center text-sm font-bold">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card border-t border-border p-4 safe-area-bottom flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <button
          onClick={capturePhoto}
          disabled={!isStreaming || isCapturing}
          className="w-16 h-16 rounded-full bg-gradient-accent hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <Loader2 className="w-6 h-6 text-accent-foreground animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent-foreground/20 border-2 border-accent-foreground"></div>
          )}
        </button>

        <div className="w-10"></div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </PageTransition>
  );
}
