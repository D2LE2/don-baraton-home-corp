"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  value: number;
  /** light surfaces vs dark video overlays */
  tone?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
  showLabel?: boolean;
  label?: string;
  /** Use continuous animate (for live switches) instead of whileInView once */
  live?: boolean;
};

/** Eye-catching transform bar — gold fill, glow, soft shimmer */
export function ProgressBar({
  value,
  tone = "light",
  size = "md",
  className = "",
  showLabel = false,
  label = "Obra",
  live = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const track = tone === "dark" ? "bg-white/20" : "bg-[#ece7df]";
  const height = size === "sm" ? "h-[4px]" : "h-[5px]";

  const fillMotion = live
    ? {
        initial: { width: 0 },
        animate: { width: `${clamped}%` },
        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { width: 0 },
        whileInView: { width: `${clamped}%` },
        viewport: { once: true, margin: "-20px" },
        transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span
            className={`text-[9px] tracking-[0.16em] uppercase ${
              tone === "dark" ? "text-white/55" : "text-[#9a8660]"
            }`}
          >
            {label}
          </span>
          <span
            className={`text-[11px] font-semibold tabular-nums ${
              tone === "dark" ? "text-[#e0c57a]" : "text-ink"
            }`}
          >
            {clamped}%
          </span>
        </div>
      )}
      <div className={`relative w-full overflow-hidden rounded-full ${height} ${track}`}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #a8843c 0%, #e0c57a 45%, #f0dc9a 78%, #c4a574 100%)",
            boxShadow:
              tone === "dark"
                ? "0 0 12px rgba(224,197,122,0.55)"
                : "0 0 10px rgba(196,165,116,0.45)",
          }}
          {...fillMotion}
        >
          <motion.span
            aria-hidden
            className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ left: ["-20%", "120%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.1,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
