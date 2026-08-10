"use client";

import { Heart, Lock, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";

export function FollowHome({ residence }: { residence: Residence }) {
  const { isFollowing, followResidence, follow } = useNova();
  const following = isFollowing(residence.id);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState(follow?.name ?? "");
  const [email, setEmail] = useState(follow?.email ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    followResidence(residence.id, name.trim(), email.trim());
    setDone(true);
  }

  return (
    <>
      <section className="px-5 py-16 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] tracking-[0.3em] text-gold uppercase">Stay Connected</p>
          <h2 className="mt-3 text-3xl font-light tracking-wide text-ink">
            FOLLOW THIS RESIDENCE
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Recibe actualizaciones cuando {residence.name.replace("THE ", "")} cambie. No visitas
            una vez — la sigues durante meses.
          </p>

          {following ? (
            <div className="mt-8 rounded-3xl border border-gold/30 bg-gold/[0.06] px-6 py-8">
              <Heart className="mx-auto text-gold" fill="currentColor" size={28} />
              <p className="mt-4 text-sm tracking-[0.15em] text-ink uppercase">
                You&apos;re following {residence.name}
              </p>
              {residence.latestUpdate && (
                <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
                  <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
                    {residence.latestUpdate.date}
                  </p>
                  <p className="mt-2 font-medium text-ink">{residence.latestUpdate.title}</p>
                  <p className="mt-1 text-sm text-muted">{residence.latestUpdate.body}</p>
                  <p className="mt-4 text-[11px] tracking-[0.2em] text-gold uppercase">
                    See Update →
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase transition hover:bg-ink/90"
            >
              <Heart size={16} />
              Follow This Residence
            </button>
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-gold uppercase">Create Account</p>
                <h3 className="mt-1 text-xl font-light text-ink">Follow {residence.name}</h3>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setOpen(false);
                  setDone(false);
                }}
                className="rounded-full bg-black/5 p-2"
              >
                <X size={18} />
              </button>
            </div>

            {done ? (
              <div className="py-6 text-center">
                <Heart className="mx-auto text-gold" fill="currentColor" size={32} />
                <p className="mt-4 text-lg text-ink">You&apos;re in.</p>
                <p className="mt-2 text-sm text-muted">
                  Te avisaremos cuando {residence.name} tenga una nueva actualización.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setDone(false);
                  }}
                  className="mt-6 w-full rounded-full bg-ink py-3.5 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
                >
                  Continuar
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
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
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
                >
                  <Lock size={14} />
                  Follow & Get Updates
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
