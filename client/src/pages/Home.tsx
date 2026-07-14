import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Camera, History, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-accent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Weatherward
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            Scan your outfit. Get AI-powered style analysis. Dress for the weather.
          </p>
          <Button
            onClick={() => {
              const loginUrl = new URL(window.location.href);
              loginUrl.pathname = "/api/oauth/callback";
              window.location.href = `/api/oauth/authorize?redirect_uri=${encodeURIComponent(loginUrl.toString())}`;
            }}
            className="btn-luxury text-lg px-8 py-4"
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30 safe-area-top">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-black text-accent">Weatherward</h1>
          <button
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-3xl font-black mb-2">
            Welcome, <span className="text-accent">{user?.name || "Fashionista"}</span>
          </h2>
          <p className="text-muted-foreground">
            Elevate your style with AI-powered outfit analysis
          </p>
        </div>

        {/* Primary CTA - Camera */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setLocation("/camera")}
            className="w-full bg-gradient-accent hover:shadow-lg active:scale-95 transition-all duration-200 rounded-xl p-8 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <Camera className="w-8 h-8 text-accent-foreground" />
              <Sparkles className="w-6 h-6 text-accent-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl font-black text-accent-foreground mb-1">
              Scan Outfit
            </h3>
            <p className="text-accent-foreground/80">
              Use your camera to analyze your current look
            </p>
          </button>
        </div>

        {/* Secondary CTA - History */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => setLocation("/history")}
            className="w-full card-premium group"
          >
            <div className="flex items-center justify-between mb-4">
              <History className="w-8 h-8 text-accent" />
              <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Outfit History
            </h3>
            <p className="text-muted-foreground">
              Browse your past scans and style insights
            </p>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="card-premium p-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-2xl font-black text-accent mb-2">🎨</div>
            <p className="text-sm font-bold text-foreground">Color Analysis</p>
            <p className="text-xs text-muted-foreground mt-1">
              Discover your palette
            </p>
          </div>
          <div className="card-premium p-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-2xl font-black text-accent mb-2">🌤️</div>
            <p className="text-sm font-bold text-foreground">Weather Match</p>
            <p className="text-xs text-muted-foreground mt-1">
              Perfect for conditions
            </p>
          </div>
          <div className="card-premium p-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="text-2xl font-black text-accent mb-2">⭐</div>
            <p className="text-sm font-bold text-foreground">Style Rating</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get your score
            </p>
          </div>
          <div className="card-premium p-4 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-2xl font-black text-accent mb-2">💡</div>
            <p className="text-sm font-bold text-foreground">AI Tips</p>
            <p className="text-xs text-muted-foreground mt-1">
              Style advice
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
