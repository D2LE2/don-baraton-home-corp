"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNova } from "@/context/NovaContext";

export default function PrivateStatusPage() {
  const { ready, membership, approveMembershipDemo } = useNova();

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (membership.status === "none") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <Logo />
        <p className="mt-8 text-sm text-muted">Aún no has solicitado membresía.</p>
        <Link
          href="/private/apply"
          className="mt-6 rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
        >
          Solicitar membresía →
        </Link>
      </main>
    );
  }

  if (membership.status === "pending") {
    return (
      <main className="min-h-screen bg-background px-5 py-12 md:px-10">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <Logo />
          <div className="mt-16 h-px w-16 bg-gold" />
          <p className="mt-10 text-[11px] tracking-[0.35em] text-gold uppercase">
            Application Received
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-[0.15em] text-ink">OMAR PRIVATE</h1>
          <p className="mt-4 text-sm text-muted">Review in progress</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Revisaremos tu solicitud con cuidado. Te contactaremos cuando tu acceso esté listo.
          </p>

          {membership.application && (
            <div className="mt-10 w-full rounded-3xl border border-border bg-white p-6 text-left">
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase">Submitted as</p>
              <p className="mt-2 font-medium text-ink">{membership.application.name}</p>
              <p className="text-sm text-muted">{membership.application.email}</p>
            </div>
          )}

          <button
            type="button"
            onClick={approveMembershipDemo}
            className="mt-10 text-[11px] tracking-[0.2em] text-gold uppercase underline-offset-4 hover:underline"
          >
            Demo: Approve membership ✨
          </button>

          <Link
            href="/residences"
            className="mt-6 text-[11px] tracking-[0.2em] text-muted uppercase"
          >
            Explorar residencias →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-12 text-white md:px-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Logo light />
        <Sparkles className="mt-14 text-gold-soft" size={28} />
        <p className="mt-6 text-[11px] tracking-[0.35em] text-gold-soft uppercase">Welcome</p>
        <h1 className="mt-3 text-3xl font-light tracking-[0.12em] md:text-4xl">
          WELCOME TO OMAR PRIVATE
        </h1>

        <div className="mt-12 w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-8 text-left shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.35em] text-gold-soft uppercase">OMAR CORP</p>
              <p className="mt-6 script text-3xl text-gold-soft">Member</p>
            </div>
            <div className="h-10 w-10 rounded-full border border-gold/40" />
          </div>

          <p className="mt-10 text-4xl font-light tracking-[0.2em] text-white">
            {membership.memberNumber}
          </p>
          <p className="mt-3 text-sm text-white/55">
            Member since {membership.memberSince}
          </p>
          {membership.application?.name && (
            <p className="mt-8 border-t border-white/10 pt-5 text-sm tracking-[0.15em] text-white/80 uppercase">
              {membership.application.name}
            </p>
          )}
          <p className="mt-6 text-[10px] leading-relaxed tracking-wide text-white/35">
            Tarjeta digital de membresía. Sin valor legal ni financiero — representa tu acceso
            dentro de Omar Private.
          </p>
        </div>

        <Link
          href="/residences"
          className="mt-10 w-full rounded-full bg-gold-soft py-4 text-center text-[11px] tracking-[0.22em] text-ink uppercase"
        >
          Explorar residencias →
        </Link>
      </div>
    </main>
  );
}
