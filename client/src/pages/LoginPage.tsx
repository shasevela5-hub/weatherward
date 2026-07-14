import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { startLogin } from "@/const";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo/Branding */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-accent mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-2">Weatherward</h1>
            <p className="text-lg text-muted-foreground font-light">Scan Your Style, Own Your Look</p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-accent/50 transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-accent font-bold">📸</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Instant Scanning</h3>
                <p className="text-sm text-muted-foreground">Capture your outfit in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-accent/50 transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-accent font-bold">✨</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Get personalized style insights</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-accent/50 transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-accent font-bold">🌤️</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Weather Aware</h3>
                <p className="text-sm text-muted-foreground">Recommendations for any climate</p>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={startLogin}
            className="w-full py-4 px-6 rounded-xl bg-gradient-accent hover:shadow-xl active:scale-95 transition-all duration-200 text-accent-foreground font-bold text-lg flex items-center justify-center gap-2 mb-4"
          >
            <span>Sign In with Manus</span>
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or continue</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Demo Note */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground text-center">
              Sign in to unlock your personal style dashboard and start scanning outfits with AI-powered recommendations.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
