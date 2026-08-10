"use client";

import { Lock, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";
import { formatUsd, savingsPercent } from "@/lib/pricing";

export function UnlockModal({
  residence,
  open,
  onClose,
  onUnlocked,
}: {
  residence: Residence;
  open: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
}) {
  const { unlockResidence, follow, isUnlocked } = useNova();
  const [name, setName] = useState(follow?.name ?? "");
  const [email, setEmail] = useState(follow?.email ?? "");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  const already = isUnlocked(residence.id);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    unlockResidence({
      residenceId: residence.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setDone(true);
    onUnlocked?.();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-4 backdrop-blur-md md:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-ink px-6 py-8 text-white">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => {
              onClose();
              setDone(false);
            }}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2"
          >
            <X size={16} />
          </button>
          <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Desbloquear</p>
          <h3 className="mt-2 text-2xl font-light tracking-wide">{residence.name}</h3>
          <p className="mt-2 text-sm text-white/55">{residence.teaser}</p>
          <div className="mt-5 rounded-2xl border border-gold-soft/25 bg-white/5 px-4 py-3">
            <p className="text-[10px] tracking-[0.22em] text-gold-soft uppercase">
              Precio de preventa
            </p>
            <p className="mt-1 display text-2xl text-white">
              Desde {formatUsd(residence.priceFrom)}
            </p>
            <p className="mt-1 text-xs text-white/55">
              Mercado ~{formatUsd(residence.marketValue)} · ahorras{" "}
              {savingsPercent(residence.priceFrom, residence.marketValue)}% · {residence.priceHook}
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          {already || done ? (
            <div className="py-2 text-center">
              <Sparkles className="mx-auto text-gold" size={28} />
              <p className="mt-4 text-lg font-light text-ink">Propiedad desbloqueada</p>
              <p className="mt-2 text-sm text-muted">
                Ya puedes ver el Build Story, el progreso completo, el desglose de precio y quedar en
                la lista de espera.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setDone(false);
                }}
                className="mt-6 w-full rounded-full bg-ink py-3.5 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
              >
                Continuar
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">
                Deja tus datos para ver el precio completo, condiciones y abrir el Build Story —
                además entras a la lista de espera.
              </p>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Nombre</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="Tu nombre"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="tu@email.com"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Teléfono</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="+1 ..."
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-soft py-3.5 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
              >
                <Lock size={14} />
                Desbloquear propiedad
              </button>
              <p className="text-center text-[10px] tracking-[0.15em] text-muted uppercase">
                Acceso exclusivo · Sin spam
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
