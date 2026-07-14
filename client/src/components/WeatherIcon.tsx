import { Cloud, CloudRain, Sun, Wind, CloudSnow, CloudDrizzle } from "lucide-react";

interface WeatherIconProps {
  condition: string | null | undefined;
  size?: number;
}

export default function WeatherIcon({ condition, size = 24 }: WeatherIconProps) {
  const iconProps = { size, className: "text-accent" };

  const conditionLower = (condition || "").toLowerCase();

  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return <Sun {...iconProps} />;
  }
  if (conditionLower.includes("cloud")) {
    return <Cloud {...iconProps} />;
  }
  if (
    conditionLower.includes("rain") ||
    conditionLower.includes("rainy")
  ) {
    return <CloudRain {...iconProps} />;
  }
  if (conditionLower.includes("snow")) {
    return <CloudSnow {...iconProps} />;
  }
  if (conditionLower.includes("drizzle")) {
    return <CloudDrizzle {...iconProps} />;
  }
  if (conditionLower.includes("wind")) {
    return <Wind {...iconProps} />;
  }

  return <Sun {...iconProps} />;
}
