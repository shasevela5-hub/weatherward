import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { startLogin } from "@/const";
import OnboardingCarousel from "@/components/OnboardingCarousel";

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
      <OnboardingCarousel onSkip={() => setLocation("/")} onSignIn={startLogin} />
    </PageTransition>
  );
}
