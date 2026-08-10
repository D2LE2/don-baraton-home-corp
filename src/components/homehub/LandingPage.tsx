"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  KeyRound,
  MapPin,
  Play,
  ShieldCheck,
  Star,
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
    copy: "See real progress with photos, videos and updates.",
  },
  {
    icon: Star,
    title: "Early Access",
    copy: "Join the priority list and get first access when it's ready.",
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
    Icon: KeyRound,
  },
  {
    href: "/#categories",
    title: "Things",
    copy: "Rent the things you need, when you need them",
    image: "/images/kitchen.jpg",
    Icon: Box,
  },
  {
    href: "/#how",
    title: "How it works",
    copy: "A simple way to discover, follow, and get access",
    image: "/images/framing.jpg",
    Icon: Play,
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
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#111] text-white">
              <Home size={15} strokeWidth={2} />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">HomeHub</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-[14px] font-medium text-[#5c5c5c] lg:flex">
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
              className="hidden items-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-medium text-[#5c5c5c] md:inline-flex"
            >
              <MapPin size={14} className="text-[#111]" />
              Logansport, IN
              <ChevronDown size={14} className="text-[#8a8a8a]" />
            </button>
            <Link
              href="/discover"
              className="hidden text-[14px] font-medium text-[#5c5c5c] hover:text-[#111] md:inline"
            >
              Log in
            </Link>
            <Link
              href="/early-access"
              className="rounded-full bg-[#111] px-4 py-2.5 text-[13px] font-semibold text-white"
            >
              Get Early Access
            </Link>
            <button
              type="button"
              className="rounded-full border border-[#e8e8e8] px-3 py-2 text-[12px] font-medium lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-[#f0f0f0] px-5 py-3 lg:hidden">
            <div className="flex flex-col gap-2.5 text-[14px] font-medium text-[#5c5c5c]">
              <Link href="/discover" onClick={() => setMenuOpen(false)}>
                Homes
              </Link>
              <Link href="/#how" onClick={() => setMenuOpen(false)}>
                How it works
              </Link>
              <Link href="/#about" onClick={() => setMenuOpen(false)}>
                About us
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 pt-10 pb-12 md:px-8 md:pt-14 md:pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div>
          <span className="inline-flex rounded-full bg-[#f3ebe3] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-[#a67c52] uppercase">
            New way to buy a home
          </span>

          <h1 className="mt-5 max-w-[520px] text-[clamp(2.15rem,4.8vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-[#111]">
            Discover homes{" "}
            <span className="italic font-semibold text-[#111]">before</span> they hit the market
          </h1>

          <p className="mt-4 max-w-[420px] text-[16px] leading-relaxed text-[#6a6a6a]">
            Follow the transformation. Get early access. Be first when the perfect home is ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/early-access"
              className="inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              Join Early Access
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#111]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f4f4]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              How it works
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-white bg-[#e9e9e9] text-[11px] font-semibold text-[#444]"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="max-w-[280px] text-[13px] leading-snug text-[#6a6a6a]">
              <span className="font-semibold text-[#111]">1,248+</span> people getting early access.
              Join a growing community of future homeowners.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-[#eee] shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:aspect-[4/3]">
            <Image
              src="/images/monroe-featured.jpg"
              alt={featured.address}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          {/* Summit-style progress card — top left */}
          <div className="absolute top-4 left-4 w-[min(100%,210px)] rounded-2xl bg-white/95 p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:top-5 md:left-5">
            <p className="text-[13px] font-semibold text-[#111]">The Monroe Project</p>
            <p className="mt-0.5 text-[12px] text-[#6a6a6a]">
              {featured.progress}% Under Renovation
            </p>
            <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[#ececec]">
              <div
                className="h-full rounded-full bg-[#111]"
                style={{ width: `${featured.progress}%` }}
              />
            </div>
          </div>

          {/* Priority list — bottom right */}
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.14)] md:right-5 md:bottom-5 md:left-auto md:w-[300px]">
            <p className="text-[14px] font-semibold text-[#111]">Join the priority list</p>
            <p className="mt-1 text-[12px] leading-snug text-[#6a6a6a]">
              Get notified and be the first to schedule a tour.
            </p>
            <div className="mt-3 flex items-center gap-2">
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
              <p className="text-[12px] text-[#6a6a6a]">
                <span className="font-semibold text-[#111]">{featured.interested}</span> people ahead
                of you
              </p>
            </div>
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#111] py-2.5 text-[13px] font-semibold text-white"
            >
              Join the List
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Value bar */}
      <section id="how" className="bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-11 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-6 lg:py-12">
          {VALUE.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e6dc] text-[#a67c52]">
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

      {/* Browse active projects */}
      <section id="browse" className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.55rem] font-semibold tracking-tight text-[#111] md:text-[1.85rem]">
              Browse active projects
            </h2>
            <p className="mt-1.5 text-[14px] text-[#6a6a6a]">
              Homes currently being transformed and coming soon to the market.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/discover"
              className="mr-1 hidden text-[13px] font-semibold text-[#111] underline-offset-4 hover:underline sm:inline"
            >
              View all projects
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollProjects(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e8e8] bg-white hover:border-[#111]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollProjects(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e8e8] bg-white hover:border-[#111]"
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
            <div key={home.id} className="w-[300px] shrink-0 sm:w-[320px]">
              <HomeCard home={home} priority={i === 0} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom category cards */}
      <section id="categories" className="bg-[#f7f7f7] py-12 md:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-5 md:grid-cols-3 md:gap-5 md:px-8">
          {BOTTOM.map(({ href, title, copy, image, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden rounded-[1.5rem] border border-[#ececec] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            >
              <div className="relative h-[150px]">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <span className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-sm">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
              </div>
              <div className="p-5">
                <p className="text-[16px] font-semibold text-[#111]">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6a6a6a]">{copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t border-[#f0f0f0] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#111] text-white">
              <Home size={15} />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-[#111]">HomeHub</p>
              <p className="mt-1 max-w-md text-[13px] text-[#6a6a6a]">
                Pre-market homes. Follow renovations, join early access, and get in line before the
                open market.
              </p>
            </div>
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

      <JoinListModal home={featured} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
