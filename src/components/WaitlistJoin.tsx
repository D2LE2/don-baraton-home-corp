"use client";

import { Lock, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";

export function WaitlistJoin({
  residence,
  open,
  onClose,
}: {
  residence: Residence;
  open: boolean;
  onClose: () => void;
}) {
  const { isOnWaitlist, joinWaitlist, follow } = useNova();
  const joined = isOnWaitlist(residence.id);
  const [name, setName] = useState(follow?.name ?? "");
  const [email, setEmail] = useState(follow?.email ?? "");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    joinWaitlist({
      residenceId: residence.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
        <div className="relative bg-ink px-6 py-7 text-white">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => {
              onClose();
              setDone(false);
            }}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white"
          >
            <X size={16} />
          </button>
          <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Lista de espera</p>
          <h3 className="mt-2 text-2xl font-light tracking-wide">{residence.name}</h3>
          <p className="mt-1 text-sm text-white/55">{residence.location}</p>
          <p className="mt-4 text-[11px] tracking-[0.15em] text-white/40 uppercase">
            Entrega estimada · {residence.expected}
          </p>
        </div>

        <div className="px-6 py-6">
          {joined || done ? (
            <div className="py-4 text-center">
              <p className="text-lg font-light text-ink">Estás en la lista.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Te contactaremos cuando {residence.name.replace("THE ", "")} abra acceso prioritario
                o tenga una actualización importante.
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
                Cupos limitados. Anótate ahora para prioridad en esta residencia.
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
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  Teléfono (opcional)
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="+1 ..."
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
              >
                <Lock size={14} />
                Unirme a la lista de espera
              </button>
              {residence.waitlistLimited && (
                <p className="text-center text-[11px] tracking-[0.12em] text-muted uppercase">
                  Acceso exclusivo · Cupos limitados
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
