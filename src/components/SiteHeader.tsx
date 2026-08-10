"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useNova } from "@/context/NovaContext";

const links = [
  { href: "/residences", label: "Residencias" },
  { href: "/private", label: "Omar Private" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const { membership } = useNova();

  return (
    <header
      className={`relative z-40 flex items-center justify-between px-5 py-5 md:px-10 ${
        transparent ? "" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <Logo />
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-[11px] font-medium tracking-[0.2em] text-ink/70 uppercase transition hover:text-gold"
          >
            {l.label}
          </Link>
        ))}
        {membership.status === "approved" ? (
          <Link
            href="/private/status"
            className="rounded-full border border-gold/40 px-4 py-2 text-[10px] tracking-[0.2em] text-gold uppercase"
          >
            Member {membership.memberNumber}
          </Link>
        ) : (
          <Link
            href="/private/apply"
            className="rounded-full bg-ink px-4 py-2 text-[10px] tracking-[0.2em] text-gold-soft uppercase"
          >
            Solicitar acceso
          </Link>
        )}
      </nav>
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] text-ink md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-white px-5 py-6 shadow-sm md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.15em] text-ink uppercase"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={membership.status === "approved" ? "/private/status" : "/private/apply"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-[11px] tracking-[0.2em] text-gold-soft uppercase"
            >
              {membership.status === "approved" ? "Mi membresía" : "Omar Private"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
