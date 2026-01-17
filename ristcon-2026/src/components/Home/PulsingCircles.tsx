import { useMemo } from "react";
import heroProfile from "@/assets/heroimg3.png";

interface PulsingCirclesProps {
  outerColor: string; // Hex of outermost circle
  innerColor: string; // Hex of innermost circle
  numCircles?: number; // Default 5
}

function hexToRgb(hex: string) {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
}

function rgbToHex([r, g, b]: number[]) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}

// Linear interpolation between two colors
function lerpColor(c1: string, c2: string, t: number) {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return rgbToHex([r, g, b]);
}

const PulsingCircles: React.FC<PulsingCirclesProps> = ({
  outerColor,
  innerColor,
  numCircles = 5,
}) => {
  const circles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < numCircles; i++) {
      const t = i / (numCircles - 1); // 0 -> outer, 1 -> inner
      arr.push(lerpColor(outerColor, innerColor, t));
    }
    return arr;
  }, [outerColor, innerColor, numCircles]);

  return (
    <div className="relative rounded-2xl shadow-2xl">
      <div className="absolute inset-0 flex items-center justify-center">
        {circles.map((color, index) => {
          // Max size is 70% instead of 100%
          const maxSize = 0.7;
          const size = maxSize - (index / numCircles) * maxSize;
          
          return (
            <div
              key={index}
              className="absolute animate-jelly-pulse"
              style={{
                backgroundColor: color,
                width: `${size * 100}%`,
                height: `${size * 100}%`,
                borderRadius: `${40 + index * 5}% ${60 - index * 5}% ${55 + index * 3}% ${45 - index * 3}% / ${50 + index * 4}% ${50 - index * 4}% ${50 + index * 2}% ${50 - index * 2}%`,
                animationDuration: `${4 + index * 0.5}s`,
                animationDelay: `${index * 0.3}s`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Portrait image */}
      <img
        src={heroProfile}
        alt="Conference Visual"
        className="w-full h-auto object-cover relative z-10"
      />
    </div>
  );
};

export default PulsingCircles;