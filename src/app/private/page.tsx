import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Omar Private — Solicitar membresía",
  description:
    "Acceso privado a residencias Omar Corp antes de que salgan al mercado.",
};

export default function PrivatePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24">
        <div className="pointer-events-none absolute inset-0 hero-grain" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Lock size={22} />
          </div>
          <p className="mt-6 text-[11px] tracking-[0.35em] text-gold uppercase">Membresía</p>
          <h1 className="mt-4 text-4xl font-light tracking-[0.12em] text-ink md:text-6xl">
            OMAR PRIVATE
          </h1>
          <p className="script mt-2 text-3xl text-gold">Solo para quienes están listos.</p>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
            Acceso privado a residencias antes de que salgan al mercado. No es una lista genérica —
            es membresía Omar Corp por solicitud.
          </p>

          <Link
            href="/private/apply"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase transition hover:bg-ink/90"
          >
            Solicitar membresía →
          </Link>

          <ul className="mx-auto mt-16 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
            {[
              "Acceso anticipado a nuevas residencias",
              "Invitaciones a lanzamientos privados",
              "Updates y recorridos prioritarios",
            ].map((item) => (
              <li
                key={item}
                className="rounded-3xl border border-border bg-white px-5 py-6 text-sm text-muted"
              >
                <Sparkles size={16} className="mb-3 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
