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

const AVATARS = ["S", "M", "A", "C"];
const ACCENT = "#c28e67";

function statusBadge(home: PreMarketHome) {
  if (home.id === "004") return "Coming Soon Exterior Only";
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
    <article className="w-[260px] shrink-0 overflow-hidden rounded-[1.15rem] border border-[#ebe8e3] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:w-[280px] lg:w-auto lg:min-w-0">
      <Link href={`/homes/${home.id}`} className="relative block aspect-[4/3] bg-[#eee]">
        <Image
          src={home.image}
          alt={home.address}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 1024px) 280px, 25vw"
        />
        <span className="absolute top-3 left-3 max-w-[78%] rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#111] shadow-sm">
          {statusBadge(home)}
        </span>
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

const CATEGORIES = [
  {
    href: "/rentals",
    title: "Rentals",
    copy: "Find homes and spaces available for rent.",
    image: "/images/interior.jpg",
    Icon: KeyRound,
  },
  {
    href: "/things",
    title: "Things",
    copy: "Rent the things you need, when you need them.",
    image: "/images/things-drill.jpg",
    Icon: Box,
  },
  {
    href: "/#how",
    title: "How it works",
    copy: "A simple way to discover, follow, and get access.",
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
    <div className="min-h-screen bg-[#f8f7f4] text-[#111] pb-[72px] md:pb-0">
      <header className="sticky top-0 z-50 border-b border-[#eceae6] bg-[#f8f7f4]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1180px] items-center justify-between gap-3 px-5 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#111] text-white">
              <Home size={15} />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">HomeHub</span>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[13px] font-medium text-[#5c5c5c]"
            >
              <MapPin size={14} className="text-[#111]" />
              <span className="max-w-[110px] truncate sm:max-w-none">Logansport, IN</span>
              <ChevronDown size={14} className="hidden text-[#8a8a8a] sm:block" />
            </button>
            <Link
              href="/discover"
              className="hidden rounded-full border border-[#ddd] bg-white px-4 py-2 text-[13px] font-semibold text-[#111] md:inline-flex"
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
          <div className="border-t border-[#eceae6] px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-[15px] font-medium text-[#5c5c5c]">
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
                Publish
              </Link>
              <Link href="/#how" onClick={() => setMenuOpen(false)}>
                How it works
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

      {/* Hero */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 pt-10 pb-4 md:px-8 md:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:pb-6">
        <div>
          <span
            className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase"
            style={{ background: "#f3ebe3", color: ACCENT }}
          >
            New way to buy a home
          </span>

          <h1 className="mt-5 max-w-[540px] text-[clamp(2rem,5.2vw,3.55rem)] font-semibold leading-[1.08] tracking-tight text-[#111]">
            Discover homes{" "}
            <em
              className="not-italic font-[family-name:var(--font-fraunces)] italic font-medium"
              style={{ color: ACCENT }}
            >
              before
            </em>{" "}
            they hit the market.
          </h1>

          <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-[#6a6a6a] md:text-[16px]">
            Follow the transformation. Get early access. Be first when the perfect home is ready.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/early-access"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-semibold text-white sm:w-auto"
            >
              Join Early Access
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/#how"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#ddd] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#111] sm:w-auto"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1f0ec]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              How it works
            </Link>
          </div>

          <div className="mt-8 flex items-start gap-3">
            <div className="flex shrink-0 -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-[#f8f7f4] bg-[#e4e2de] text-[11px] font-semibold text-[#444]"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="max-w-[280px] text-[13px] leading-snug text-[#6a6a6a]">
              <span className="font-semibold text-[#111]">1,248+ people getting early access.</span>
              <br />
              Join a growing community of future homeowners.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#eee] shadow-[0_24px_60px_rgba(0,0,0,0.12)] md:aspect-[4/3] md:rounded-[1.75rem]">
            <Image
              src="/images/monroe-featured.jpg"
              alt={featured.address}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          <div className="absolute top-4 left-4 w-[min(70%,210px)] rounded-2xl bg-white p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] md:top-5 md:left-5">
            <p className="text-[13px] font-semibold text-[#111]">The Summit Project</p>
            <p className="mt-0.5 text-[12px] text-[#6a6a6a]">68% Under Renovation</p>
            <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[#ececec]">
              <div className="h-full rounded-full bg-[#111]" style={{ width: "68%" }} />
            </div>
          </div>

          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] md:right-5 md:bottom-5 md:left-auto md:w-[300px]">
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
                <span className="font-semibold text-[#111]">24</span> people ahead of you
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

      {/* Mobile category toggle */}
      <div className="mx-auto mt-2 flex max-w-[1180px] justify-center px-5 md:mt-4 md:px-8 lg:hidden">
        <div className="inline-flex rounded-full border border-[#eceae6] bg-white p-1">
          {MOBILE_TABS.map(({ id, label, Icon, href }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id, href)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                tab === id ? "bg-[#f3ebe3] text-[#8a6b2e]" : "text-[#6a6a6a]"
              }`}
            >
              <Icon size={14} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Value props */}
      <section id="how" className="mt-10 border-y border-[#eceae6] bg-[#f3f2ee] md:mt-12">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4 md:gap-8 md:px-8 md:py-12">
          {VALUE.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-start gap-3 sm:flex-row sm:gap-3.5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#f0e6dc", color: ACCENT }}
              >
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

      {/* Browse */}
      <section id="browse" className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div className="max-w-xl">
            <p
              className="text-[11px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: ACCENT }}
            >
              Homes in progress
            </p>
            <h2 className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-[#111] md:text-[1.9rem]">
              Browse active projects
            </h2>
            <p className="mt-2 hidden text-[14px] text-[#6a6a6a] sm:block">
              Follow renovations near you and join the priority list before they hit the market.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/discover"
              className="mr-1 hidden text-[13px] font-semibold text-[#111] sm:inline"
            >
              View all projects
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollProjects(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd] bg-white"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollProjects(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd] bg-white"
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

      {/* Category cards */}
      <section id="categories" className="pb-12 md:pb-16">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-5 sm:grid-cols-3 md:gap-5 md:px-8">
          {CATEGORIES.map(({ href, title, copy, image, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-[168px] items-stretch overflow-hidden rounded-[1.35rem] bg-[#ebe9e4]"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-sm">
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <p className="mt-3.5 text-[16px] font-semibold text-[#111]">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6a6a6a]">{copy}</p>
                <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] transition group-hover:bg-[#111] group-hover:text-white">
                  <ArrowRight size={14} />
                </span>
              </div>
              <div className="relative w-[42%] min-w-[120px] self-stretch">
                <Image src={image} alt="" fill className="object-cover" sizes="180px" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t border-[#eceae6] bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[15px] font-semibold text-[#111]">HomeHub</p>
            <p className="mt-1 max-w-md text-[13px] text-[#6a6a6a]">
              Discover homes before they hit the market. Follow renovations and get early access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/publish"
              className="inline-flex items-center gap-2 rounded-full border border-[#ddd] bg-white px-5 py-3 text-[13px] font-semibold text-[#111]"
            >
              Publish
            </Link>
            <Link
              href="/early-access"
              className="inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-3 text-[13px] font-semibold text-white"
            >
              Get Early Access
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eceae6] bg-[#f8f7f4]/95 backdrop-blur-md md:hidden">
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
                active ? "text-[#c28e67]" : "text-[#8a8a8a]"
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
