import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PageTransition from "@/components/PageTransition";
import WeatherIcon from "@/components/WeatherIcon";
import { useState, useRef } from "react";

export default function ScanDetailScreen() {
  const [match, params] = useRoute("/scan/:id");
  const [, setLocation] = useLocation();
  const scanId = params?.id ? parseInt(params.id) : null;
  const { data: scan, isLoading } = trpc.outfit.get.useQuery(
    { id: scanId! },
    { enabled: !!scanId }
  );
  const [recIndex, setRecIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (isLoading || !scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const recommendations = scan.recommendations || [];
  const hasRecs = recommendations.length > 0;

  const nextRec = () => {
    if (hasRecs) setRecIndex((i) => (i + 1) % recommendations.length);
  };
  const prevRec = () => {
    if (hasRecs) setRecIndex((i) => (i - 1 + recommendations.length) % recommendations.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextRec();
      else prevRec();
    }
    touchStartX.current = null;
  };

  return (
    <PageTransition type="slideUp">
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-0 z-30 safe-area-top">
          <div className="container flex items-center gap-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/history")}
              className="btn-ripple"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-black">Outfit Details</h1>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8 space-y-6 animate-fade-in">
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden bg-muted h-96 relative group">
            <img
              src={scan.imageUrl}
              alt="Outfit scan"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-full font-black text-lg">
              {scan.styleScore}/10
            </div>
          </div>

          {/* Style Score Card */}
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Style Rating
            </h2>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-5xl font-black text-accent">{scan.styleScore}</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-accent transition-all duration-500"
                  style={{ width: `${(scan.styleScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {scan.styleScore >= 8
                ? "Excellent outfit choice!"
                : scan.styleScore >= 6
                  ? "Good style coordination"
                  : "Room for improvement"}
            </p>
          </div>

          {/* Detected Items */}
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Detected Items
            </h2>
            <div className="flex flex-wrap gap-2">
              {scan.detectedItems.map((item: string, i: number) => (
                <span
                  key={i}
                  className="bg-accent/10 text-accent px-4 py-2 rounded-lg font-bold text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Color Palette
            </h2>
            <div className="flex gap-3">
              {scan.colorPalette.map((color: string, i: number) => (
                <div
                  key={i}
                  className="flex-1 h-20 rounded-lg border border-border transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
              ))}
            </div>
          </div>

          {/* Style Tags */}
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Style Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {scan.styleTags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-bold capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Weather Context */}
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Weather Context
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-2">
                  Temperature
                </p>
                <p className="text-2xl font-black text-accent">
                  {scan.temperature}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-2">
                  Condition
                </p>
                <div className="flex items-center gap-2">
                  <WeatherIcon condition={scan.weatherCondition} size={24} />
                  <p className="text-lg font-bold text-foreground">
                    {scan.weatherCondition}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Swipeable Recommendations */}
          {hasRecs && (
            <div className="card-premium">
              <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
                Style Tips
              </h2>
              <div
                className="relative overflow-hidden touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div className="min-h-[100px] flex items-center justify-center px-8 py-4">
                  <p className="text-base text-foreground text-center leading-relaxed animate-fade-in key={recIndex}">
                    {recommendations[recIndex]}
                  </p>
                </div>
                {recommendations.length > 1 && (
                  <>
                    <button
                      onClick={prevRec}
                      className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent/20 hover:bg-accent/40 transition-all btn-ripple"
                      aria-label="Previous tip"
                    >
                      <ChevronLeft className="w-5 h-5 text-accent" />
                    </button>
                    <button
                      onClick={nextRec}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent/20 hover:bg-accent/40 transition-all btn-ripple"
                      aria-label="Next tip"
                    >
                      <ChevronRight className="w-5 h-5 text-accent" />
                    </button>
                    <div className="flex justify-center gap-2 mt-3">
                      {recommendations.map((_: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setRecIndex(i)}
                          className={`h-1.5 rounded-full transition-all ${i === recIndex ? "w-6 bg-accent" : "w-1.5 bg-muted"}`}
                          aria-label={`Tip ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/history")}
              className="btn-luxury-outline btn-ripple"
            >
              Back
            </Button>
            <Button
              onClick={() => setLocation("/camera")}
              className="btn-luxury btn-ripple"
            >
              Scan Again
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
