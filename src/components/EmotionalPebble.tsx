import React from "react";
import { motion } from "motion/react";

export interface MoodConfig {
  id: string;
  label: string;
  colorClass: string;
  glowClass: string;
  textColor: string;
  gradient: string;
  orbGradient: string;
  glowColor: string;
  textColorHex: string;
  solidColor?: string;
  selectorGradient?: string;
  calBgOverlay?: string;
  calBorder?: string;
  calDot?: string;
}

export interface EmotionalPebbleProps {
  mood: MoodConfig | null;
  size?: "large" | "medium" | "responsive";
}

export const WARM_WHITE_MOOD: MoodConfig = {
  id: "unselected",
  label: "Unselected",
  colorClass: "text-amber-100",
  glowClass: "glow-amber",
  textColor: "text-amber-100",
  gradient: "from-amber-100 to-amber-200",
  orbGradient: "radial-gradient(circle at 35% 25%, #FFFFFF 0%, #FFFDF5 30%, #F8EED8 65%, #EAD4B5 100%)",
  selectorGradient: "radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 253, 245, 0.85) 50%, rgba(245, 230, 204, 0.65) 100%)",
  glowColor: "rgba(255, 248, 230, 0.4)",
  solidColor: "#FFF8EB",
  textColorHex: "#FFF5E1",
  calBgOverlay: "bg-amber-100/25 border-amber-200/60 shadow-[inset_0_0_12px_rgba(255,248,225,0.35)]",
  calBorder: "border-amber-200/60",
  calDot: "bg-amber-100 shadow-[0_0_8px_rgba(255,248,225,0.9)]"
};

export const EmotionalPebble: React.FC<EmotionalPebbleProps> = ({
  mood,
  size = "large",
}) => {
  const activeMood = mood || WARM_WHITE_MOOD;

  if (size === "responsive") {
    return (
      <div className="relative flex flex-col items-center justify-center my-1 sm:my-2 select-none">
        {/* Soft outer ambient ethereal glow - subtle */}
        <div
          className="absolute rounded-full transition-all duration-700 ease-in-out pointer-events-none w-44 h-44 sm:w-64 sm:h-64 blur-xl sm:blur-2xl"
          style={{
            background: activeMood.glowColor,
            opacity: 0.25,
          }}
        />

        {/* Crystal Emotional Orb */}
        <div
          className="relative rounded-full flex items-center justify-center z-10 overflow-hidden transition-all duration-700 ease-in-out w-32 h-32 sm:w-52 sm:h-52"
          style={{
            background: activeMood.orbGradient,
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.55),
              inset 0 10px 22px rgba(255, 255, 255, 0.65),
              0 0 20px ${activeMood.glowColor}
            `,
            border: "1px solid rgba(255, 255, 255, 0.45)",
          }}
        >
          {/* Crystal Specular Glare & Lens Reflection Layer */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background: `
                radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 20%, transparent 65%),
                radial-gradient(ellipse at 50% 90%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)
              `,
            }}
          />

          {/* Crystal Edge Prismatic Arch Sheen */}
          <div 
            className="absolute top-2 left-4 sm:left-6 right-4 sm:right-6 h-2/5 rounded-t-full pointer-events-none opacity-85"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.05) 75%, transparent)",
              filter: "blur(0.5px)",
            }}
          />

          {/* Internal Crystalline Star Specular Highlight */}
          <div 
            className="absolute top-[18%] left-[24%] w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white blur-[0.5px] pointer-events-none opacity-95 shadow-[0_0_10px_#ffffff]"
          />

          {/* Subtle organic breathing ring */}
          <motion.span
            animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-white/60 pointer-events-none"
          />
        </div>
      </div>
    );
  }

  const isLarge = size === "large";
  const orbSize = isLarge ? 220 : 150;

  return (
    <div className="relative flex flex-col items-center justify-center my-2 select-none">
      {/* Soft outer ambient ethereal glow - subtle */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          width: `${orbSize * 1.2}px`,
          height: `${orbSize * 1.2}px`,
          background: activeMood.glowColor,
          filter: `blur(${isLarge ? "32px" : "20px"})`,
          opacity: 0.25,
        }}
      />

      {/* Crystal Emotional Orb */}
      <div
        className="relative rounded-full flex items-center justify-center z-10 overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          width: `${orbSize}px`,
          height: `${orbSize}px`,
          background: activeMood.orbGradient,
          boxShadow: `
            inset 0 0 0 1px rgba(255, 255, 255, 0.55),
            inset 0 10px 22px rgba(255, 255, 255, 0.65),
            0 0 20px ${activeMood.glowColor}
          `,
          border: "1px solid rgba(255, 255, 255, 0.45)",
        }}
      >
        {/* Crystal Specular Glare & Lens Reflection Layer */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700"
          style={{
            background: `
              radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 20%, transparent 65%),
              radial-gradient(ellipse at 50% 90%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)
            `,
          }}
        />

        {/* Crystal Edge Prismatic Arch Sheen */}
        <div 
          className="absolute top-2 left-6 right-6 h-2/5 rounded-t-full pointer-events-none opacity-85"
          style={{
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.05) 75%, transparent)",
            filter: "blur(0.5px)",
          }}
        />

        {/* Internal Crystalline Star Specular Highlight */}
        <div 
          className="absolute top-[18%] left-[24%] w-3.5 h-3.5 rounded-full bg-white blur-[0.5px] pointer-events-none opacity-95 shadow-[0_0_10px_#ffffff]"
        />

        {/* Subtle organic breathing ring */}
        <motion.span
          animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-white/60 pointer-events-none"
        />
      </div>
    </div>
  );
};


