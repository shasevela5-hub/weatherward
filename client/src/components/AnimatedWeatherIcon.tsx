import { useEffect, useState } from "react";

interface AnimatedWeatherIconProps {
  condition: "sunny" | "rainy" | "cloudy" | "snowy" | "windy";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function AnimatedWeatherIcon({
  condition,
  size = "md",
  animated = true,
}: AnimatedWeatherIconProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconClass = `${sizeMap[size]} transition-all duration-500 ${
    isLoaded && animated ? "animate-bounce" : ""
  }`;

  switch (condition) {
    case "sunny":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun circle */}
          <circle cx="50" cy="50" r="25" fill="currentColor" className="text-accent" />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 35 * Math.cos(rad);
            const y1 = 50 + 35 * Math.sin(rad);
            const x2 = 50 + 45 * Math.cos(rad);
            const y2 = 50 + 45 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-accent"
              />
            );
          })}
        </svg>
      );

    case "rainy":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud */}
          <path
            d="M 20 60 Q 15 50 25 40 Q 30 35 40 35 Q 45 25 55 25 Q 70 25 75 40 Q 85 45 85 60 Z"
            fill="currentColor"
            className="text-accent"
          />
          {/* Rain drops */}
          {[20, 50, 80].map((x, i) => (
            <g key={x} className={animated ? "animate-pulse" : ""} style={{ animationDelay: `${i * 0.2}s` }}>
              <line x1={x} y1="70" x2={x - 5} y2="85" stroke="currentColor" strokeWidth="2" className="text-accent" />
              <line x1={x + 10} y1="70" x2={x + 5} y2="85" stroke="currentColor" strokeWidth="2" className="text-accent" />
            </g>
          ))}
        </svg>
      );

    case "cloudy":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Clouds */}
          <path
            d="M 15 55 Q 10 45 20 35 Q 25 30 35 30 Q 40 20 50 20 Q 65 20 70 35 Q 80 40 80 55 Z"
            fill="currentColor"
            className="text-accent opacity-70"
          />
          <path
            d="M 25 65 Q 20 58 30 50 Q 35 47 45 47 Q 50 40 60 40 Q 72 40 76 52 Q 85 56 85 68 Z"
            fill="currentColor"
            className="text-accent"
          />
        </svg>
      );

    case "snowy":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Snowflake */}
          {[0, 60, 120].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" className="text-accent" />
                <line x1="35" y1="30" x2="65" y2="70" stroke="currentColor" strokeWidth="2" className="text-accent" />
                <line x1="65" y1="30" x2="35" y2="70" stroke="currentColor" strokeWidth="2" className="text-accent" />
              </g>
            );
          })}
        </svg>
      );

    case "windy":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wind lines */}
          {[25, 50, 75].map((y, i) => (
            <g key={y} className={animated ? "animate-pulse" : ""} style={{ animationDelay: `${i * 0.15}s` }}>
              <line x1="15" y1={y} x2="65" y2={y} stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent" />
              <polygon points="70,{y} 65,{y-4} 65,{y+4}" fill="currentColor" className="text-accent" />
            </g>
          ))}
        </svg>
      );

    default:
      return null;
  }
}
