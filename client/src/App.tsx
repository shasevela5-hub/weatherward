import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import CameraScreen from "./pages/CameraScreen";
import HistoryScreen from "./pages/HistoryScreen";
import ScanDetailScreen from "./pages/ScanDetailScreen";
import LoginPage from "./pages/LoginPage";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Switch>
        {/* Public route */}
        <Route path={"/login"} component={LoginPage} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path={"/"} component={Home} />
            <Route path={"/camera"} component={CameraScreen} />
            <Route path={"/history"} component={HistoryScreen} />
            <Route path={"/scan/:id"} component={ScanDetailScreen} />
          </>
        ) : (
          <>
            <Route path={"*"} component={LoginPage} />
          </>
        )}

        {/* 404 fallback */}
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      {isAuthenticated && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
