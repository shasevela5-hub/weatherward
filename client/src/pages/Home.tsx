import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Flame } from "lucide-react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [styleStreak, setStyleStreak] = useState(12);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
  }, []);

  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-background pb-24">
        {/* Header with Sign Out */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-2xl font-serif font-bold text-accent tracking-wider">WEATHERWARD</h1>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-accent border-2 border-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-foreground">{user?.name?.[0]?.toUpperCase() || "U"}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-serif italic font-bold text-foreground">
                  {greeting}, <span className="text-accent">{user?.name || "User"}</span>
                </h2>
                <p className="text-muted-foreground font-light">Elevate your style with AI-powered outfit analysis</p>
              </div>
            </div>

            {/* Style Streak Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Style Streak: {styleStreak} days</span>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-6 mb-12">
            {/* Color Analysis Card */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-pink-500/20 via-red-500/10 to-black border border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Color Analysis</h3>
                    <p className="text-muted-foreground font-light">Discover your palette</p>
                  </div>
                  <span className="text-4xl">🎨</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-pink-400"></div>
                  <div className="w-8 h-8 rounded-full bg-red-500"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-400"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-300"></div>
                </div>
              </div>
            </div>

            {/* Weather Match Card */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-black border border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Weather Match</h3>
                    <p className="text-muted-foreground font-light">Perfect for conditions</p>
                  </div>
                  <span className="text-4xl">🌤️</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Sunny • 24°C</span>
                </div>
              </div>
            </div>

            {/* Style Rating Card */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-black border border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Style Rating</h3>
                    <p className="text-muted-foreground font-light">Your editorial score</p>
                  </div>
                  <span className="text-4xl">⭐</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-bold text-accent">88</span>
                  <span className="text-muted-foreground">/100 Editorial Chic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outfit History Filmstrip */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Recent Lookbook</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 h-48 rounded-xl bg-gradient-to-br from-accent/20 to-black border border-accent/30 hover:border-accent/60 transition-all duration-300 cursor-pointer transform hover:scale-105 flex items-center justify-center group"
                  onClick={() => setLocation(`/history`)}
                >
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">👗</span>
                    <p className="text-xs text-muted-foreground">Scan {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setLocation("/camera")}
              className="w-full py-6 text-lg bg-gradient-accent hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Scan New Outfit
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/history")}
              className="w-full py-6 text-lg"
            >
              View History
            </Button>
          </div>
        </div>


      </div>
    </PageTransition>
  );
}
