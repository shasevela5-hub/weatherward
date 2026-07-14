import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "AI Wardrobe Scan",
    subtitle: "Instant visual recognition. Understand your fits in real‑time.",
    icon: "📸",
    gradient: "from-purple-900 via-black to-black",
  },
  {
    id: 2,
    title: "Dynamic Weather Adaptation",
    subtitle: "Looks that react to your local forecast.",
    icon: "🌤️",
    gradient: "from-blue-900 via-black to-black",
  },
  {
    id: 3,
    title: "Signature Style Scoring",
    subtitle: "Data‑driven tips to refine your aesthetic.",
    icon: "✨",
    gradient: "from-amber-900 via-black to-black",
  },
];

export default function OnboardingCarousel({ onSkip, onSignIn }: { onSkip: () => void; onSignIn: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection("right");
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? "right" : "left");
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection("right");
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-8">
        {/* Wordmark */}
        <div className="absolute top-8 left-6 z-20">
          <h1 className="text-2xl font-serif font-bold text-accent tracking-wider">WEATHERWARD</h1>
        </div>

        {/* Main Carousel Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md">
          {/* Icon */}
          <div className="text-8xl mb-8 animate-bounce">{slide.icon}</div>

          {/* Title */}
          <h2 className="text-5xl font-serif font-bold text-white mb-4 italic">{slide.title}</h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-300 mb-12 font-light leading-relaxed">{slide.subtitle}</p>

          {/* Progress Dots */}
          <div className="flex gap-2 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-accent" : "w-2 bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full max-w-md space-y-4">
          {/* Glassmorphism Button */}
          <button
            onClick={onSignIn}
            className="w-full py-4 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white font-bold text-lg shadow-lg"
          >
            Sign In with Email
          </button>

          {/* Links */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
              Skip
            </button>
            <div className="w-px h-4 bg-gray-600"></div>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
              Privacy
            </a>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-12 right-6 flex gap-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
