"use client";

import { useEffect, useState } from "react";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

export function getTimeLeft(targetIso: string, now = Date.now()): TimeLeft {
  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({
  targetDate,
  variant = "dark",
  size = "md",
  label,
}: {
  targetDate: string;
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    setTime(getTimeLeft(targetDate));
    const id = window.setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  const units = [
    { value: time.days, label: "Días" },
    { value: time.hours, label: "Horas" },
    { value: time.minutes, label: "Min" },
    { value: time.seconds, label: "Seg" },
  ];

  const tone =
    variant === "light"
      ? {
          label: "text-muted",
          value: "text-ink",
          unit: "text-muted",
          sep: "text-border",
        }
      : variant === "gold"
        ? {
            label: "text-gold-soft/80",
            value: "text-gold-soft",
            unit: "text-gold-soft/55",
            sep: "text-gold-soft/25",
          }
        : {
            label: "text-white/55",
            value: "text-white",
            unit: "text-white/45",
            sep: "text-white/20",
          };

  const sizing =
    size === "lg"
      ? { value: "text-3xl md:text-5xl", unit: "text-[9px] md:text-[10px]", gap: "gap-3 md:gap-5" }
      : size === "sm"
        ? { value: "text-[13px]", unit: "text-[7px]", gap: "gap-1.5" }
        : { value: "text-2xl md:text-3xl", unit: "text-[9px]", gap: "gap-2.5 md:gap-4" };

  if (time.done) {
    return (
      <div>
        {label && (
          <p className={`mb-2 text-[10px] tracking-[0.28em] uppercase ${tone.label}`}>{label}</p>
        )}
        <p className={`text-sm tracking-[0.2em] uppercase ${tone.value}`}>Completada</p>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <p className={`mb-3 text-[10px] tracking-[0.28em] uppercase ${tone.label}`}>{label}</p>
      )}
      <div className={`flex items-end ${sizing.gap}`}>
        {units.map((u, i) => (
          <div
            key={u.label}
            className={`flex items-end ${size === "sm" ? "gap-1.5" : "gap-2.5 md:gap-4"}`}
          >
            <div
              className={
                size === "sm"
                  ? "min-w-[2.1rem] text-center"
                  : "min-w-[3.25rem] text-center md:min-w-[4rem]"
              }
            >
              <p
                className={`font-light tabular-nums tracking-wide ${sizing.value} ${tone.value}`}
              >
                {pad(u.value)}
              </p>
              <p className={`mt-0.5 tracking-[0.18em] uppercase ${sizing.unit} ${tone.unit}`}>
                {u.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span
                className={`font-light ${tone.sep} ${size === "sm" ? "mb-3 text-xs" : "mb-5 text-lg"}`}
              >
                |
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
