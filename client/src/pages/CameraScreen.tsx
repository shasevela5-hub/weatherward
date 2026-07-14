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
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [styleScore, setStyleScore] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);

  const createOutfitMutation = trpc.outfit.create.useMutation();
  const analyzeMutation = trpc.outfit.analyze.useMutation();

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

      // 1. Get current location for weather
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // 2. Fetch weather data (using a placeholder for now, will integrate real API later)
      // For now, let\'s simulate a weather API call
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherResponse.json();
      const currentTemperature = weatherData.current_weather.temperature;
      const weatherCode = weatherData.current_weather.weathercode;
      const weatherConditionsMap: { [key: number]: string } = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog",
        51: "Drizzle light", 53: "Drizzle moderate", 55: "Drizzle dense intensity",
        56: "Freezing Drizzle light", 57: "Freezing Drizzle dense intensity",
        61: "Rain slight", 63: "Rain moderate", 65: "Rain heavy intensity",
        66: "Freezing Rain light", 67: "Freezing Rain heavy intensity",
        71: "Snow fall slight", 73: "Snow fall moderate", 75: "Snow fall heavy intensity",
        77: "Snow grains",
        80: "Rain showers slight", 81: "Rain showers moderate", 82: "Rain showers violent",
        85: "Snow showers slight", 86: "Snow showers heavy",
        95: "Thunderstorm slight or moderate",
        96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
      };
      const currentCondition = weatherConditionsMap[weatherCode] || "Unknown";

      setWeatherCondition(currentCondition);
      setTemperature(currentTemperature);

      // 3. Perform AI analysis
      const analysisResult = await analyzeMutation.mutateAsync({ imageBase64: imageData });

      setDetectedItems(analysisResult.detectedItems);
      setColorPalette(analysisResult.colorPalette);
      setStyleTags(analysisResult.styleTags);
      setStyleScore(analysisResult.styleScore);
        setRecommendations(analysisResult.recommendations);

        // 4. Generate weather-aware recommendations
        // We can't call trpc.outfit.generateWeatherRecommendations.mutate directly like this in a component.
        // Instead, we'll rely on the server-side fallback in createOutfitMutation.
        // The create mutation already calls generateWeatherRecommendations if recommendations are not provided.

        // 5. Save scan to history
        const newScan = await createOutfitMutation.mutateAsync({
          imageUrl: imageData, // In a real app, this would be an S3 URL
          detectedItems: analysisResult.detectedItems,
          colorPalette: analysisResult.colorPalette,
          styleScore: analysisResult.styleScore,
          styleTags: analysisResult.styleTags,
          weatherCondition: currentCondition,
          temperature: currentTemperature,
          weatherIcon: currentCondition, // Using condition as icon for now
          // Omit recommendations to trigger server-side weather-aware generation
        });

      toast.success("Outfit analyzed and saved!");
        setLocation(`/scan/${newScan.id}`);
    } catch (error: any) {
      console.error("Scan failed:", error);
      toast.error("Failed to analyze outfit. Please try again.");
      setError(`Capture failed: ${error.message}`);
    } finally {
      setIsCapturing(false);
    }
  }, [createOutfitMutation, analyzeMutation, setLocation]);

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
