"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Bell,
  Box,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  MapPin,
  Menu,
  Play,
  Ruler,
  Search,
  ShieldCheck,
  Star,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { JoinListModal } from "@/components/homehub/JoinListModal";
import { homes, type PreMarketHome } from "@/data/homes";

const AVATARS = ["S", "M", "A", "C"];

function statusLabel(home: PreMarketHome) {
  if (home.category === "renovation") return "Under Renovation";
  if (home.category === "new_construction") return "New Construction";
  return "Coming Soon";
}

function ProjectCard({
  home,
  priority,
}: {
  home: PreMarketHome;
  priority?: boolean;
}) {
  return (
    <article className="w-[280px] shrink-0 overflow-hidden rounded-[1.25rem] border border-[#efefef] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)] sm:w-[300px]">
      <Link href={`/homes/${home.id}`} className="relative block aspect-[4/3] bg-[#eee]">
        <Image
          src={home.image}
          alt={home.address}
          fill
          priority={priority}
          className="object-cover"
          sizes="300px"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#111] shadow-sm">
            {home.progress}%
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#111] shadow-sm">
            {statusLabel(home)}
          </span>
        </div>
        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow-sm">
          <Heart size={14} strokeWidth={1.75} />
        </span>
      </Link>
      <div className="space-y-2 px-3.5 pt-3.5 pb-4">
        <Link href={`/homes/${home.id}`}>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#111]">{home.address}</h3>
          <p className="mt-0.5 text-[13px] text-[#6a6a6a]">
            {home.city}, {home.state} {home.zip}
          </p>
        </Link>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6a6a6a]">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={13} /> {home.beds} Beds
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={13} /> {home.baths} Baths
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler size={13} /> {home.sqft.toLocaleString()} sqft
          </span>
        </p>
        <div className="flex items-center gap-2 pt-0.5">
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
            <span className="font-semibold text-[#111]">{home.interested}</span> interested
          </p>
        </div>
      </div>
    </article>
  );
}

const VALUE = [
  {
    icon: Home,
    title: "Homes in Progress",
    copy: "Discover homes being renovated or built near you.",
  },
  {
    icon: Bell,
    title: "Follow & Updates",
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
    copy: "Verified projects, clear process, and secure payments.",
  },
] as const;

const ENTRIES = [
  {
    href: "/discover",
    title: "Find a home",
    copy: "Discover renovations and get early access before listing day.",
    Icon: Search,
  },
  {
    href: "/publish",
    title: "Publish a home",
    copy: "Owners & builders: list a project and measure demand early.",
    Icon: Building2,
  },
  {
    href: "/rentals",
    title: "Find a rental",
    copy: "Browse homes and spaces available to rent nearby.",
    Icon: KeyRound,
  },
  {
    href: "/rentals/publish",
    title: "List a rental",
    copy: "Landlords & hosts: publish a space and connect with renters.",
    Icon: Home,
  },
] as const;

const CATEGORIES = [
  {
    href: "/rentals",
    title: "Rentals",
    copy: "Find homes and spaces available for rent",
    image: "/images/interior.jpg",
    Icon: KeyRound,
  },
  {
    href: "/things",
    title: "Things",
    copy: "Rent tools and gear when you need them",
    image: "/images/kitchen.jpg",
    Icon: Wrench,
  },
  {
    href: "/#how",
    title: "How it works",
    copy: "A simple way to discover, follow, and get access",
    image: "/images/framing.jpg",
    Icon: Play,
  },
] as const;

const MOBILE_TABS = [
  { id: "homes", label: "Homes", Icon: Home, href: "/discover" },
  { id: "rentals", label: "Rentals", Icon: KeyRound, href: "/rentals" },
  { id: "things", label: "Things", Icon: Box, href: "/things" },
] as const;

export function LandingPage() {
  const featured = homes[0];
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<(typeof MOBILE_TABS)[number]["id"]>("homes");

  const scrollProjects = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const selectTab = (id: (typeof MOBILE_TABS)[number]["id"], href: string) => {
    setTab(id);
    if (id !== "homes") router.push(href);
  };

  return (
    <div className="min-h-screen bg-white text-[#111] pb-[72px] md:pb-0">
      {/* Header — mobile: logo | location | hamburger */}
      <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between gap-3 px-4 md:h-[64px] md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#111] text-white">
              <Home size={15} />
            </span>
            <span className="text-[16px] font-semibold tracking-tight md:text-[17px]">HomeHub</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-[14px] font-medium text-[#5c5c5c] lg:flex">
            <Link href="/discover" className="hover:text-[#111]">
              Homes
            </Link>
            <Link href="/rentals" className="hover:text-[#111]">
              Rentals
            </Link>
            <Link href="/things" className="hover:text-[#111]">
              Things
            </Link>
            <Link href="/publish" className="hover:text-[#111]">
              Publish
            </Link>
            <Link href="/#how" className="hover:text-[#111]">
              How it works
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[12px] font-medium text-[#5c5c5c] md:text-[13px]"
            >
              <MapPin size={14} className="text-[#111]" />
              <span className="max-w-[110px] truncate sm:max-w-none">Logansport, IN</span>
              <ChevronDown size={14} className="hidden text-[#8a8a8a] sm:block" />
            </button>
            <Link
              href="/discover"
              className="hidden text-[14px] font-medium text-[#5c5c5c] hover:text-[#111] md:inline"
            >
              Log in
            </Link>
            <Link
              href="/early-access"
              className="hidden rounded-full bg-[#111] px-4 py-2.5 text-[13px] font-semibold text-white sm:inline-flex"
            >
              Get Early Access
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111] lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#f0f0f0] px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-[15px] font-medium text-[#5c5c5c]">
              <Link href="/discover" onClick={() => setMenuOpen(false)}>
                Find a home
              </Link>
              <Link href="/publish" onClick={() => setMenuOpen(false)}>
                Publish a home
              </Link>
              <Link href="/rentals" onClick={() => setMenuOpen(false)}>
                Find a rental
              </Link>
              <Link href="/rentals/publish" onClick={() => setMenuOpen(false)}>
                List a rental
              </Link>
              <Link href="/things" onClick={() => setMenuOpen(false)}>
                Rent tools & things
              </Link>
              <Link href="/early-access" onClick={() => setMenuOpen(false)}>
                Get Early Access
              </Link>
              <Link href="/discover" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero — stacked on mobile like mock */}
      <section className="mx-auto max-w-[1200px] px-4 pt-7 md:px-8 md:pt-14 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14 lg:pb-8">
        <div>
          <span className="inline-flex rounded-full bg-[#f3ebe3] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-[#a67c52] uppercase">
            New way to buy a home
          </span>

          <h1 className="mt-4 max-w-[520px] text-[clamp(1.85rem,7vw,3.4rem)] font-semibold leading-[1.1] tracking-tight text-[#111]">
            Discover homes{" "}
            <span className="text-[#c4a07a]">before they hit the market</span>
          </h1>

          <p className="mt-3.5 max-w-[420px] text-[15px] leading-relaxed text-[#6a6a6a] md:text-[16px]">
            Follow the transformation. Get early access. Be first when the perfect home is ready.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/early-access"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-semibold text-white sm:w-auto"
            >
              Join Early Access
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#how"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#111] sm:w-auto"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f4f4]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              How it works
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 md:mt-8">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-white bg-[#e9e9e9] text-[11px] font-semibold text-[#444] md:h-9 md:w-9"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="text-[13px] leading-snug text-[#6a6a6a]">
              <span className="font-semibold text-[#111]">1,248+</span> people getting early access
            </p>
          </div>
        </div>

        {/* Featured visual */}
        <div className="relative mt-8 lg:mt-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#eee] shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:aspect-[5/4] md:aspect-[4/3] md:rounded-[1.75rem]">
            <Image
              src="/images/monroe-featured.jpg"
              alt={featured.address}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          <div className="absolute top-3 left-3 w-[min(72%,200px)] rounded-2xl bg-white/95 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.12)] backdrop-blur-sm md:top-5 md:left-5 md:w-[210px] md:p-3.5">
            <p className="text-[12px] font-semibold text-[#111] md:text-[13px]">
              The Monroe Project
            </p>
            <p className="mt-0.5 text-[11px] text-[#6a6a6a] md:text-[12px]">
              {featured.progress}% Under Renovation
            </p>
            <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#ececec] md:mt-2.5 md:h-[6px]">
              <div
                className="h-full rounded-full bg-[#111]"
                style={{ width: `${featured.progress}%` }}
              />
            </div>
          </div>

          <div className="absolute right-3 bottom-3 left-3 rounded-2xl bg-white p-3.5 shadow-[0_14px_36px_rgba(0,0,0,0.14)] md:right-5 md:bottom-5 md:left-auto md:w-[300px] md:p-4">
            <p className="text-[13px] font-semibold text-[#111] md:text-[14px]">
              Join the priority list
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[#6a6a6a] md:text-[12px]">
              Get notified and be the first to schedule a tour.
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
              <p className="text-[11px] text-[#6a6a6a] md:text-[12px]">
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

      {/* Category toggle — mobile mock */}
      <div className="mx-auto mt-2 flex max-w-[1200px] justify-center px-4 md:mt-4 md:px-8 lg:hidden">
        <div className="inline-flex rounded-full border border-[#ececec] bg-[#f7f7f7] p-1">
          {MOBILE_TABS.map(({ id, label, Icon, href }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id, href)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                tab === id
                  ? "bg-[#f3ebe3] text-[#8a6b2e]"
                  : "text-[#6a6a6a]"
              }`}
            >
              <Icon size={14} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Value props */}
      <section id="how" className="mt-8 bg-[#f7f7f7] md:mt-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-4 py-9 md:grid-cols-4 md:gap-6 md:px-8 md:py-12">
          {VALUE.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-start gap-2.5 sm:flex-row sm:gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0e6dc] text-[#a67c52]">
                <Icon size={17} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[#111] md:text-[14px]">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#6a6a6a] md:text-[13px]">
                  {copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Four marketplace entries */}
      <section id="entries" className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
        <div className="mb-6 max-w-xl md:mb-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#c4a07a] uppercase">
            One platform
          </p>
          <h2 className="mt-1 text-[1.35rem] font-semibold tracking-tight text-[#111] md:text-[1.85rem]">
            Built for seekers and publishers
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#6a6a6a]">
            Whether you&apos;re buying early, listing a project, finding a rental, or hosting one —
            start here.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {ENTRIES.map(({ href, title, copy, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col rounded-[1.35rem] border border-[#efefef] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:border-[#e0e0e0]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ebe3] text-[#a67c52]">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <p className="mt-4 text-[15px] font-semibold text-[#111]">{title}</p>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-[#6a6a6a]">{copy}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#111]">
                Enter
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
        <div className="mb-5 flex items-end justify-between gap-3 md:mb-7">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#c4a07a] uppercase">
              Homes in progress
            </p>
            <h2 className="mt-1 text-[1.35rem] font-semibold tracking-tight text-[#111] md:text-[1.85rem]">
              Browse active projects
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/discover"
              className="mr-1 hidden text-[13px] font-semibold text-[#111] sm:inline"
            >
              View all
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollProjects(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] bg-white md:h-9 md:w-9"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollProjects(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] bg-white md:h-9 md:w-9"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homes.map((home, i) => (
            <ProjectCard key={home.id} home={home} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Secondary category cards */}
      <section id="categories" className="bg-[#f7f7f7] py-10 md:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-3 px-4 sm:grid-cols-3 md:gap-5 md:px-8">
          {CATEGORIES.map(({ href, title, copy, image, Icon }) => (
            <Link
              key={title}
              href={href}
              className="flex items-stretch overflow-hidden rounded-[1.35rem] border border-[#ececec] bg-[#f0f0f0]"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow-sm">
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <p className="mt-3 text-[15px] font-semibold text-[#111]">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#6a6a6a]">{copy}</p>
                <span className="mt-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111]">
                  <ArrowRight size={13} />
                </span>
              </div>
              <div className="relative w-[38%] min-w-[110px] self-stretch">
                <Image src={image} alt="" fill className="object-cover" sizes="140px" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t border-[#f0f0f0] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[15px] font-semibold text-[#111]">HomeHub</p>
            <p className="mt-1 max-w-md text-[13px] text-[#6a6a6a]">
              Buy early. Rent nearby. Publish your home or rental. Rent the tools you need.
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

      {/* Mobile bottom nav — matches mock */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ececec] bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-1 py-2">
          {[
            { href: "/", label: "Home", Icon: Home, active: true },
            { href: "/discover", label: "Search", Icon: Search, active: false },
            { href: "/saved", label: "Saved", Icon: Heart, active: false },
            { href: "/updates", label: "Updates", Icon: Bell, active: false },
            { href: "/profile", label: "Profile", Icon: User, active: false },
          ].map(({ href, label, Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                active ? "text-[#a67c52]" : "text-[#8a8a8a]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.6} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <JoinListModal home={featured} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
