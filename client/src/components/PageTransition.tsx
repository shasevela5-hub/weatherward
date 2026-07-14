import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  type?: "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight";
}

export default function PageTransition({
  children,
  type = "fade",
}: PageTransitionProps) {
  const animationClass = {
    fade: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down",
    slideLeft: "animate-slide-in-left",
    slideRight: "animate-slide-in-right",
  }[type];

  return <div className={animationClass}>{children}</div>;
}
