"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  KeyRound,
  MapPin,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { HomeCard } from "@/components/homehub/HomeCard";
import { JoinListModal } from "@/components/homehub/JoinListModal";
import { homes } from "@/data/homes";

const AVATARS = ["S", "M", "A", "C"];

const VALUE = [
  {
    icon: Home,
    title: "Homes in Progress",
    copy: "Discover homes being renovated or built near you.",
  },
  {
    icon: Bell,
    title: "Follow & Get Updates",
    copy: "See real progress with photos, videos, and updates.",
  },
  {
    icon: KeyRound,
    title: "Early Access",
    copy: "Join the priority list and get first access.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    copy: "Verified projects, clear process, and secure communication.",
  },
] as const;

const BOTTOM = [
  {
    href: "/discover",
    title: "Rentals",
    copy: "Find homes and spaces available for rent",
    image: "/images/interior.jpg",
  },
  {
    href: "/#how",
    title: "Things",
    copy: "Rent the things you need, when you need them",
    image: "/images/kitchen.jpg",
  },
  {
    href: "/#how",
    title: "How it works",
    copy: "A simple way to discover, follow, and get access",
    image: "/images/framing.jpg",
  },
] as const;

export function LandingPage() {
  const featured = homes[0];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollProjects = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111] text-white">
              <Home size={16} />
            </span>
            <span className="text-[16px] font-semibold tracking-tight">HomeHub</span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-medium text-[#5c5c5c] lg:flex">
            <Link href="/discover" className="hover:text-[#111]">
              Homes
            </Link>
            <Link href="/#browse" className="hover:text-[#111]">
              Rentals
            </Link>
            <Link href="/#categories" className="hover:text-[#111]">
              Things
            </Link>
            <Link href="/#how" className="hover:text-[#111]">
              How it works
            </Link>
            <Link href="/#about" className="hover:text-[#111]">
              About us
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5c5c5c] sm:inline-flex"
            >
              <MapPin size={13} />
              Logansport, IN
            </button>
            <Link
              href="/discover"
              className="hidden text-[13px] font-medium text-[#5c5c5c] hover:text-[#111] md:inline"
            >
              Log in
            </Link>
            <Link
              href="/early-access"
              className="rounded-full bg-[#111] px-3.5 py-2 text-[12px] font-semibold text-white sm:px-4 sm:text-[13px]"
            >
              Get Early Access
            </Link>
            <button
              type="button"
              className="rounded-lg border border-[#ececec] px-2.5 py-2 text-[12px] font-medium lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-[#f0f0f0] bg-white px-5 py-3 lg:hidden">
            <div className="flex flex-col gap-2 text-[14px] font-medium text-[#5c5c5c]">
              <Link href="/discover" onClick={() => setMenuOpen(false)}>
                Homes
              </Link>
              <Link href="/#how" onClick={() => setMenuOpen(false)}>
                How it works
              </Link>
              <Link href="/early-access" onClick={() => setMenuOpen(false)}>
                Early Access
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#c4a07a] uppercase">
            New way to buy a home
          </p>
          <h1 className="mt-3 max-w-xl text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-[#111]">
            Discover homes before they hit the market
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#6a6a6a]">
            Follow the transformation. Get early access. Be first when the perfect home is ready.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/early-access"
              className="inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-3.5 text-[14px] font-semibold text-white"
            >
              Join Early Access
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#111]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f4f4]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              How it works
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ececec] text-[11px] font-semibold text-[#444]"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="max-w-xs text-[13px] leading-snug text-[#6a6a6a]">
              <span className="font-semibold text-[#111]">1,248+</span> people getting early access.
              Join a growing community of future homeowners.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#eee] shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:aspect-[4/3]">
            <Image
              src="/images/monroe-featured.jpg"
              alt={featured.address}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Progress overlay */}
          <div className="absolute top-4 left-4 max-w-[220px] rounded-2xl border border-white/50 bg-white/90 p-3 shadow-lg backdrop-blur-md md:top-5 md:left-5">
            <p className="text-[12px] font-semibold text-[#111]">The Monroe Project</p>
            <p className="mt-0.5 text-[11px] text-[#6a6a6a]">{featured.progress}% Under Renovation</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee]">
              <div
                className="h-full rounded-full bg-[#111]"
                style={{ width: `${featured.progress}%` }}
              />
            </div>
          </div>

          {/* Priority list overlay */}
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-md md:right-5 md:bottom-5 md:left-auto md:w-[280px]">
            <p className="text-[13px] font-semibold text-[#111]">Join the priority list</p>
            <p className="mt-1 text-[12px] text-[#6a6a6a]">
              Be first when this home is ready for tours.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {AVATARS.slice(0, 3).map((a) => (
                  <span
                    key={a}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#e8e8e8] text-[9px] font-semibold"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#6a6a6a]">
                <span className="font-semibold text-[#111]">{featured.interested}</span> people ahead
                of you
              </p>
            </div>
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#111] py-2.5 text-[13px] font-semibold text-white"
            >
              Join the List
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section id="how" className="border-y border-[#f0f0f0] bg-[#fafafa]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-6 lg:py-12">
          {VALUE.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ebe3] text-[#a67c52]">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#111]">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6a6a6a]">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse projects */}
      <section id="browse" className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#c4a07a] uppercase">
              Homes in progress
            </p>
            <h2 className="mt-1.5 text-[1.5rem] font-semibold tracking-tight text-[#111] md:text-[1.75rem]">
              Browse active projects
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/discover"
              className="hidden text-[13px] font-semibold text-[#111] underline-offset-2 hover:underline sm:inline"
            >
              View all projects
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollProjects(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e8e8] bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollProjects(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e8e8] bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homes.map((home, i) => (
            <div key={home.id} className="w-[280px] shrink-0 sm:w-[300px]">
              <HomeCard home={home} priority={i === 0} />
            </div>
          ))}
        </div>
      </section>

      {/* Category cards */}
      <section id="categories" className="bg-[#fafafa] py-12 md:py-14">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-5 md:grid-cols-3 md:px-8">
          {BOTTOM.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-3xl border border-[#ececec] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
            >
              <div className="relative h-[140px]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[15px] font-semibold text-[#111]">{item.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6a6a6a]">{item.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About / footer strip */}
      <footer id="about" className="border-t border-[#f0f0f0] bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[15px] font-semibold text-[#111]">HomeHub</p>
            <p className="mt-1 max-w-md text-[13px] text-[#6a6a6a]">
              Pre-market homes for Indiana. Builders publish projects. Buyers follow, join early
              access, and get in line before the open market.
            </p>
          </div>
          <Link
            href="/early-access"
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#111] px-5 py-3 text-[13px] font-semibold text-white"
          >
            Get Early Access
            <ArrowRight size={14} />
          </Link>
        </div>
      </footer>

      <JoinListModal
        home={featured}
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
      />
    </div>
  );
}
