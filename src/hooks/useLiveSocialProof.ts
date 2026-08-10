"use client";

import { useEffect, useMemo, useState } from "react";
import type { Residence } from "@/data/residences";

export type LiveToast = {
  id: number;
  text: string;
};

const FIRST_NAMES = [
  "Sofía",
  "Carlos",
  "Ana",
  "Luis",
  "María",
  "Diego",
  "Camila",
  "Andrés",
  "Valentina",
  "Mateo",
  "Isabella",
  "Javier",
];

function seedFrom(id: string) {
  return id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function pickName(seed: number, salt: number) {
  return FIRST_NAMES[(seed + salt) % FIRST_NAMES.length];
}

/** Simulated live presence + waitlist ticks for a residence slide. */
export function useLiveSocialProof(residence: Residence, active: boolean) {
  const seed = useMemo(() => seedFrom(residence.id), [residence.id]);
  const baseViewers = 9 + (seed % 14);

  const [viewers, setViewers] = useState(baseViewers);
  const [waitlistLive, setWaitlistLive] = useState(residence.waitlistCount);
  const [toast, setToast] = useState<LiveToast | null>(null);

  useEffect(() => {
    if (!active) return;

    let toastId = 0;
    let cancelled = false;
    let liveViewers = baseViewers;
    let liveWaitlist = residence.waitlistCount;

    const pushToast = (text: string) => {
      if (cancelled) return;
      toastId += 1;
      const id = toastId;
      setToast({ id, text });
      window.setTimeout(() => {
        if (!cancelled) {
          setToast((cur) => (cur?.id === id ? null : cur));
        }
      }, 3200);
    };

    const first = window.setTimeout(() => {
      pushToast(`${liveViewers} personas mirando ${residence.name} ahora`);
    }, 1100);

    const viewerTick = window.setInterval(() => {
      const delta = Math.random() > 0.55 ? 1 : -1;
      liveViewers = Math.max(4, Math.min(42, liveViewers + delta));
      setViewers(liveViewers);
      if (Math.random() > 0.62) {
        if (delta > 0) {
          pushToast(`Alguien más entró a ver ${residence.name}`);
        } else {
          pushToast(`${liveViewers} personas mirando esta propiedad ahora`);
        }
      }
    }, 3800 + (seed % 900));

    const waitlistTick = window.setInterval(() => {
      liveWaitlist += 1;
      setWaitlistLive(liveWaitlist);
      const name = pickName(seed, liveWaitlist);
      pushToast(`${name} se unió a la lista de espera`);
    }, 9200 + (seed % 1600));

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(viewerTick);
      window.clearInterval(waitlistTick);
    };
  }, [active, baseViewers, residence.id, residence.name, residence.waitlistCount, seed]);

  const currentStage =
    residence.stages.find((s) => s.status === "current") ??
    residence.stages.find((s) => s.status === "upcoming") ??
    residence.stages[residence.stages.length - 1];

  return {
    viewers,
    waitlistLive,
    toast,
    currentStage,
  };
}
