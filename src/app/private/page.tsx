import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "NOVA Private — Request Membership",
  description:
    "Private access to residences before they're released to the market.",
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
          <p className="mt-6 text-[11px] tracking-[0.35em] text-gold uppercase">Membership</p>
          <h1 className="mt-4 text-4xl font-light tracking-[0.12em] text-ink md:text-6xl">
            NOVA PRIVATE
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
            Private access to residences before they&apos;re released to the market. No waiting
            list — a curated membership for those who are ready.
          </p>

          <Link
            href="/private/apply"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase transition hover:bg-ink/90"
          >
            Request Membership →
          </Link>

          <ul className="mx-auto mt-16 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
            {[
              "Early access to new residences",
              "Private launch invitations",
              "Priority updates & walkthroughs",
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
