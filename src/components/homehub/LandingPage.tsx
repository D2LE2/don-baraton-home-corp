"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Bell,
  Box,
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
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { JoinListModal } from "@/components/homehub/JoinListModal";
import { homes, type PreMarketHome } from "@/data/homes";

const AVATARS = [
  { bg: "#f4c4b8", letter: "S" },
  { bg: "#d4e5f7", letter: "M" },
  { bg: "#e8d5b7", letter: "A" },
  { bg: "#cfe8d4", letter: "C" },
];

/** Coral accent from HomeHub mock */
const CORAL = "#ff5a5f";
const CORAL_SOFT = "#ffe8e9";
const CORAL_MUTED = "#ff6b70";

function statusBadge(home: PreMarketHome) {
  if (home.id === "004" || home.category === "coming_soon") {
    if (home.id === "004") return "Coming Soon";
    return "Coming Soon";
  }
  if (home.category === "renovation") return `${home.progress}% Under Renovation`;
  if (home.category === "new_construction") return `${home.progress}% New Construction`;
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
    <article className="w-[272px] shrink-0 overflow-hidden rounded-[1.25rem] border border-[#efefef] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)] sm:w-[290px] lg:w-auto lg:min-w-0">
      <Link href={`/homes/${home.id}`} className="relative block aspect-[4/3] bg-[#eee]">
        <Image
          src={home.image}
          alt={home.address}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 1024px) 290px, 25vw"
        />
        <span className="absolute top-3 left-3 max-w-[80%] rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#222] shadow-sm">
          {statusBadge(home)}
        </span>
        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#222] shadow-sm">
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
                key={a.letter}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold text-[#444]"
                style={{ background: a.bg }}
              >
                {a.letter}
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
    copy: "Verified projects, secure payments and trusted partners.",
  },
] as const;

const CATEGORIES = [
  {
    href: "/rentals",
    title: "Rentals",
    copy: "Find homes and spaces available for rent.",
    cta: "Explore Rentals",
    image: "/images/interior.jpg",
    Icon: KeyRound,
    tint: "#f8ebe9",
    iconBg: "#ff5a5f",
  },
  {
    href: "/things",
    title: "Things",
    copy: "Rent the things you need, when you need them.",
    cta: "Explore Things",
    image: "/images/things-drill.jpg",
    Icon: Box,
    tint: "#eaf3ea",
    iconBg: "#3d9a5f",
  },
  {
    href: "/#how",
    title: "How it works",
    copy: "A simple way to discover, follow, and get access.",
    cta: "Learn more",
    image: "/images/how-it-works-phone.jpg",
    Icon: Play,
    tint: "#ebe8f6",
    iconBg: "#7b6fd6",
  },
] as const;

const MOBILE_TABS = [
  { id: "homes", label: "Homes", Icon: Home, href: "/discover" },
  { id: "rentals", label: "Rentals", Icon: KeyRound, href: "/rentals" },
  { id: "things", label: "Things", Icon: Box, href: "/things" },
] as const;

function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-5.2v-5.5h-3.6V21H5a1 1 0 0 1-1-1v-8.5z"
        stroke={CORAL}
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.2" r="1.35" fill={CORAL} />
    </svg>
  );
}

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between gap-3 px-4 md:h-[68px] md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoMark size={24} />
            <span className="text-[17px] font-semibold tracking-tight md:text-[18px]">HomeHub</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[14px] font-medium text-[#5c5c5c] lg:flex">
            <Link href="/discover" className="hover:text-[#111]">
              Homes
            </Link>
            <Link href="/rentals" className="hover:text-[#111]">
              Rentals
            </Link>
            <Link href="/things" className="hover:text-[#111]">
              Things
            </Link>
            <Link href="/#how" className="hover:text-[#111]">
              How it works
            </Link>
            <Link href="/#about" className="hover:text-[#111]">
              About us
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-1 py-1 text-[12px] font-medium text-[#5c5c5c] md:text-[13px]"
            >
              <MapPin size={14} style={{ color: CORAL }} />
              <span className="max-w-[108px] truncate sm:max-w-none">Logansport, IN</span>
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
              className="hidden rounded-full px-4 py-2.5 text-[13px] font-semibold text-white sm:inline-flex"
              style={{ background: CORAL }}
            >
              Get Early Access
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e8e8] text-[#111] lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#f0f0f0] px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3.5 text-[15px] font-medium text-[#5c5c5c]">
              <Link href="/discover" onClick={() => setMenuOpen(false)}>
                Homes
              </Link>
              <Link href="/rentals" onClick={() => setMenuOpen(false)}>
                Rentals
              </Link>
              <Link href="/things" onClick={() => setMenuOpen(false)}>
                Things
              </Link>
              <Link href="/publish" onClick={() => setMenuOpen(false)}>
                Publish a home
              </Link>
              <Link href="/rentals/publish" onClick={() => setMenuOpen(false)}>
                List a rental
              </Link>
              <Link href="/#how" onClick={() => setMenuOpen(false)}>
                How it works
              </Link>
              <Link
                href="/early-access"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
                style={{ color: CORAL }}
              >
                Get Early Access
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-8 px-4 pt-7 md:gap-12 md:px-8 md:pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:pb-4">
        <div className="order-1">
          <span
            className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.05em] uppercase"
            style={{ background: CORAL_SOFT, color: CORAL_MUTED }}
          >
            New way to buy a home
          </span>

          <h1 className="mt-4 max-w-[540px] text-[clamp(1.9rem,6.5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-[#111]">
            Discover homes{" "}
            <em
              className="not-italic font-[family-name:var(--font-fraunces)] italic font-medium"
              style={{ color: CORAL }}
            >
              before
            </em>{" "}
            they hit the market.
          </h1>

          <p className="mt-3.5 max-w-[440px] text-[15px] leading-relaxed text-[#6a6a6a] md:text-[16px]">
            <span className="md:hidden">
              Follow the transformation. Get early access. Be first when the perfect home is ready.
            </span>
            <span className="hidden md:inline">
              Follow the transformation of homes in your area. Get early access and be first when
              they&apos;re ready.
            </span>
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/early-access"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold text-white sm:w-auto"
              style={{ background: CORAL }}
            >
              Get Early Access
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#how"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#e0e0e0] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#111] sm:w-auto"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f4f4]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              How it works
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 md:mt-8 md:items-start">
            <div className="flex shrink-0 -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a.letter}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-white text-[11px] font-semibold text-[#444] md:h-9 md:w-9"
                  style={{ background: a.bg }}
                >
                  {a.letter}
                </span>
              ))}
            </div>
            <p className="text-[13px] leading-snug text-[#6a6a6a]">
              <span className="font-semibold text-[#111]">1,248+ people getting early access.</span>
              <span className="hidden md:inline">
                <br />
                Join a growing community of future homeowners.
              </span>
            </p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#eee] shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:aspect-[5/4] md:aspect-[4/3] md:rounded-[1.75rem]">
            <Image
              src="/images/monroe-featured.jpg"
              alt={featured.address}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          <div className="absolute top-3 left-3 w-[min(72%,200px)] rounded-2xl bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.14)] md:top-5 md:left-5 md:w-[210px] md:p-3.5">
            <p className="text-[12px] font-semibold text-[#111] md:text-[13px]">
              The Summit Project
            </p>
            <p className="mt-0.5 text-[11px] text-[#6a6a6a] md:text-[12px]">68% Under Renovation</p>
            <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#ececec] md:mt-2.5 md:h-[6px]">
              <div className="h-full rounded-full" style={{ width: "68%", background: CORAL }} />
            </div>
          </div>

          <div className="absolute right-3 bottom-3 left-3 rounded-2xl bg-white p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] md:right-5 md:bottom-5 md:left-auto md:w-[300px] md:p-4">
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
                    key={a.letter}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold"
                    style={{ background: a.bg }}
                  >
                    {a.letter}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#6a6a6a] md:text-[12px]">
                <span className="font-semibold text-[#111]">24</span> people ahead of you
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

      {/* Mobile category toggle */}
      <div className="mx-auto mt-5 flex max-w-[1200px] justify-center px-4 lg:hidden">
        <div className="inline-flex items-center rounded-full border border-[#ececec] bg-[#f7f7f7] p-1 shadow-sm">
          {MOBILE_TABS.map(({ id, label, Icon, href }, i) => (
            <div key={id} className="flex items-center">
              {i > 0 && <span className="mx-0.5 h-4 w-px bg-[#ddd]" />}
              <button
                type="button"
                onClick={() => selectTab(id, href)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                  tab === id ? "text-[#111]" : "text-[#6a6a6a]"
                }`}
                style={tab === id ? { background: CORAL_SOFT, color: CORAL } : undefined}
              >
                <Icon size={14} strokeWidth={1.75} />
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Value props */}
      <section id="how" className="mt-8 bg-[#fafafa] md:mt-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-4 gap-y-7 px-4 py-9 md:grid-cols-4 md:gap-6 md:px-8 md:py-12">
          {VALUE.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-start gap-2.5 sm:flex-row sm:gap-3.5">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d0d2] md:h-11 md:w-11"
                style={{ background: CORAL_SOFT, color: CORAL }}
              >
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

      {/* Active projects */}
      <section id="browse" className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
        <div className="mb-5 flex items-end justify-between gap-3 md:mb-7">
          <div className="max-w-xl">
            <p
              className="text-[11px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: CORAL }}
            >
              Homes in progress
            </p>
            <h2 className="mt-1 text-[1.4rem] font-semibold tracking-tight text-[#111] md:text-[1.85rem]">
              Active projects
            </h2>
            <p className="mt-2 hidden text-[14px] text-[#6a6a6a] sm:block">
              Follow renovations near you and join the priority list before they hit the market.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/discover"
              className="mr-1 hidden text-[13px] font-semibold text-[#111] sm:inline"
            >
              View all projects
            </Link>
            <Link
              href="/discover"
              className="mr-1 text-[13px] font-semibold text-[#111] sm:hidden"
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
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homes.map((home, i) => (
            <ProjectCard key={home.id} home={home} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Explore / category cards */}
      <section id="categories" className="bg-[#fafafa] py-10 md:py-14">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="mb-5 md:hidden">
            <p
              className="text-[11px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: CORAL }}
            >
              Explore more
            </p>
            <h2 className="mt-1 text-[1.35rem] font-semibold tracking-tight text-[#111]">
              More ways to access what you need
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:gap-5">
            {CATEGORIES.map(({ href, title, copy, cta, image, Icon, tint, iconBg }) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[170px] items-stretch overflow-hidden rounded-[1.35rem] md:min-h-[180px]"
                style={{ background: tint }}
              >
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ background: iconBg }}
                  >
                    <Icon size={15} strokeWidth={1.75} fill={title === "How it works" ? "currentColor" : "none"} />
                  </span>
                  <p className="mt-3 text-[15px] font-semibold text-[#111] md:text-[16px]">{title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6a6a6a] md:text-[13px]">
                    {copy}
                  </p>
                  <span className="mt-3 hidden items-center gap-1 text-[13px] font-semibold text-[#111] md:inline-flex">
                    {cta}
                    <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow-sm md:hidden">
                    <ArrowRight size={14} />
                  </span>
                </div>
                <div className="relative w-[40%] min-w-[112px] self-stretch">
                  <Image src={image} alt="" fill className="object-cover" sizes="160px" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="border-t border-[#f0f0f0] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-9 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark size={20} />
              <p className="text-[15px] font-semibold text-[#111]">HomeHub</p>
            </div>
            <p className="mt-2 max-w-md text-[13px] text-[#6a6a6a]">
              Discover homes before they hit the market. Follow renovations and get early access.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/publish"
              className="inline-flex items-center rounded-full border border-[#e0e0e0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111]"
            >
              Publish
            </Link>
            <Link
              href="/early-access"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: CORAL }}
            >
              Get Early Access
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
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
              className="flex min-w-[56px] flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium"
              style={{ color: active ? CORAL : "#8a8a8a" }}
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
