import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import WeatherIcon from "@/components/WeatherIcon";

export default function HistoryScreen() {
  const [, setLocation] = useLocation();
  const { data: scans, isLoading } = trpc.outfit.list.useQuery();

  return (
    <PageTransition type="slideUp">
      <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30 safe-area-top">
        <div className="container flex items-center gap-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-black">Outfit History</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-premium animate-shimmer">
                <div className="h-40 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : !scans || scans.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-4xl mb-4">📸</div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              No scans yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by scanning your first outfit
            </p>
            <Button
              onClick={() => setLocation("/camera")}
              className="btn-luxury"
            >
              Scan Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan, index) => (
              <button
                key={scan.id}
                onClick={() => setLocation(`/scan/${scan.id}`)}
                className="card-premium text-left block w-full group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Thumbnail */}
                <div className="mb-4 rounded-lg overflow-hidden bg-muted h-32 relative">
                  <img
                    src={scan.imageUrl}
                    alt="Outfit scan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                    {scan.styleScore}/10
                  </div>
                </div>

                {/* Detected Items */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-2">
                    Detected Items
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scan.detectedItems.slice(0, 3).map((item: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {scan.detectedItems.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{scan.detectedItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Weather & Style Tags */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
                      Weather
                    </p>
                    <div className="flex items-center gap-2">
                      <WeatherIcon condition={scan.weatherCondition} size={20} />
                      <p className="text-sm font-bold">
                        {scan.temperature}°C
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
                      Style
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scan.styleTags.slice(0, 2).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                  {new Date(scan.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  );
}
