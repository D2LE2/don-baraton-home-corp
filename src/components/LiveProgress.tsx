"use client";

import Image from "next/image";
import { Check, Circle } from "lucide-react";
import { useState } from "react";
import type { BuildStage } from "@/data/residences";
import { ProgressRing } from "./ProgressRing";

export function LiveProgress({
  progress,
  stages,
}: {
  progress: number;
  stages: BuildStage[];
}) {
  const [selected, setSelected] = useState(
    stages.find((s) => s.status === "current")?.id ?? stages[0]?.id,
  );
  const active = stages.find((s) => s.id === selected) ?? stages[0];

  return (
    <section className="border-y border-border bg-white px-5 py-16 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] tracking-[0.3em] text-gold uppercase">Live Progress</p>
          <div className="mt-8">
            <ProgressRing progress={progress} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-wide text-ink">Construction Stages</h2>
          <p className="mt-2 text-sm text-muted">
            Cada etapa es clickeable. Toca para ver fotos y videos reales de ese momento.
          </p>

          <ul className="mt-8 space-y-2">
            {stages.map((stage) => {
              const isActive = stage.id === selected;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(stage.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-ink text-white"
                        : "bg-transparent hover:bg-black/[0.03]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                        stage.status === "done"
                          ? isActive
                            ? "border-gold bg-gold text-ink"
                            : "border-gold bg-gold/15 text-gold"
                          : stage.status === "current"
                            ? isActive
                              ? "border-gold text-gold"
                              : "border-gold text-gold"
                            : isActive
                              ? "border-white/30 text-white/50"
                              : "border-border text-muted"
                      }`}
                    >
                      {stage.status === "done" ? (
                        <Check size={14} strokeWidth={2.5} />
                      ) : (
                        <Circle
                          size={10}
                          fill={stage.status === "current" ? "currentColor" : "none"}
                        />
                      )}
                    </span>
                    <span className="flex-1 text-sm tracking-wide">{stage.label}</span>
                    <span
                      className={`text-[10px] tracking-[0.2em] uppercase ${
                        isActive ? "text-gold-soft" : "text-muted"
                      }`}
                    >
                      {stage.date}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {active && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-border">
              <div className="relative aspect-[16/10]">
                <Image
                  src={active.images[0]}
                  alt={active.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] tracking-[0.25em] text-gold uppercase">{active.date}</p>
                <h3 className="mt-1 text-lg text-ink">{active.label}</h3>
                <p className="mt-2 text-sm text-muted">{active.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
