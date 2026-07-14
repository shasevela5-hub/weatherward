import { Home, Sparkles, Clock, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/camera", icon: Sparkles, label: "Scan" },
    { path: "/history", icon: Clock, label: "History" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              location === path
                ? "text-accent bg-accent/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}

        {/* Floating Action Button (FAB) */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <button className="w-14 h-14 rounded-full bg-gradient-accent hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center text-accent-foreground shadow-lg border border-accent/50">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
