import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PageTransition from "@/components/PageTransition";
import WeatherIcon from "@/components/WeatherIcon";

export default function ScanDetailScreen() {
  const [match, params] = useRoute("/scan/:id");
  const [, setLocation] = useLocation();
  const scanId = params?.id ? parseInt(params.id) : null;
  const { data: scan, isLoading } = trpc.outfit.get.useQuery(
    { id: scanId! },
    { enabled: !!scanId }
  );

  if (isLoading || !scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

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

        {/* Recommendations */}
        {scan.recommendations && scan.recommendations.length > 0 && (
          <div className="card-premium">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">
              Style Tips
            </h2>
            <div className="space-y-3">
              {scan.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="text-accent font-black text-lg flex-shrink-0">
                    ✓
                  </div>
                  <p className="text-sm text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation("/history")}
            className="btn-luxury-outline"
          >
            Back
          </Button>
          <Button
            onClick={() => setLocation("/camera")}
            className="btn-luxury"
          >
            Scan Again
          </Button>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
