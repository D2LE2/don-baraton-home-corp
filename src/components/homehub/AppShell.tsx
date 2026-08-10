"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Box,
  Building2,
  Compass,
  Heart,
  Home,
  KeyRound,
  MessageCircle,
  Settings,
  Star,
  User,
} from "lucide-react";

const PRIMARY_NAV = [
  { href: "/discover", label: "Homes", icon: Compass },
  { href: "/rentals", label: "Rentals", icon: KeyRound },
  { href: "/things", label: "Things", icon: Box },
] as const;

const ACCOUNT_NAV = [
  { href: "/updates", label: "Updates", icon: Bell },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/early-access", label: "Early Access", icon: Star },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE_NAV = [
  { href: "/discover", label: "Homes", icon: Compass },
  { href: "/rentals", label: "Rentals", icon: KeyRound },
  { href: "/things", label: "Things", icon: Box },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/discover") {
    return pathname === "/discover" || pathname.startsWith("/homes");
  }
  if (href === "/rentals") {
    return pathname === "/rentals" || pathname.startsWith("/rentals/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onPublish = pathname === "/publish" || pathname.startsWith("/publish/");
  const onListRental =
    pathname === "/rentals/publish" || pathname.startsWith("/rentals/publish/");

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-[#ececec] bg-white px-4 py-6 md:flex">
        <Link href="/" className="mb-8 px-2">
          <span className="text-[18px] font-semibold tracking-tight">HomeHub</span>
          <span className="mt-0.5 block text-[11px] font-medium text-[#8a8a8a]">
            Buy · Rent · Publish
          </span>
        </Link>

        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
          Explore
        </p>
        <nav className="flex flex-col gap-1">
          {PRIMARY_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href) && !onListRental;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
                  active
                    ? "bg-[#111] text-white"
                    : "text-[#5c5c5c] hover:bg-[#f4f4f4] hover:text-[#111]"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <p className="mt-6 mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
          Publish
        </p>
        <nav className="flex flex-col gap-1">
          <Link
            href="/publish"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
              onPublish
                ? "bg-[#111] text-white"
                : "text-[#5c5c5c] hover:bg-[#f4f4f4] hover:text-[#111]"
            }`}
          >
            <Building2 size={18} strokeWidth={1.75} />
            List a home
          </Link>
          <Link
            href="/rentals/publish"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
              onListRental
                ? "bg-[#111] text-white"
                : "text-[#5c5c5c] hover:bg-[#f4f4f4] hover:text-[#111]"
            }`}
          >
            <Home size={18} strokeWidth={1.75} />
            List a rental
          </Link>
        </nav>

        <p className="mt-6 mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
          Account
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
                  active
                    ? "bg-[#111] text-white"
                    : "text-[#5c5c5c] hover:bg-[#f4f4f4] hover:text-[#111]"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-[220px]">
        <div className="mx-auto min-h-screen max-w-[1200px] px-4 pb-24 pt-4 md:px-8 md:pb-10 md:pt-6">
          {children}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ececec] bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/rentals"
                ? pathname === "/rentals"
                : isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                  active ? "text-[#111]" : "text-[#8a8a8a]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.6} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
