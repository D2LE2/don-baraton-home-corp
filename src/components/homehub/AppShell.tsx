"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  Heart,
  KeyRound,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/updates", label: "Updates", icon: Bell },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/early-access", label: "Early Access", icon: KeyRound },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-[#ececec] bg-white px-4 py-6 md:flex">
        <Link href="/" className="mb-8 px-2">
          <span className="text-[18px] font-semibold tracking-tight">HomeHub</span>
          <span className="mt-0.5 block text-[11px] font-medium text-[#8a8a8a]">
            Pre-market homes
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/homes")
                : pathname === href || pathname.startsWith(`${href}/`);
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
        <div className="mt-auto rounded-2xl bg-[#f6f6f6] px-3 py-3">
          <p className="text-[12px] font-semibold text-[#111]">Publish a project</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#6a6a6a]">
            Builders & flippers: measure demand before you finish.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="md:pl-[220px]">
        <div className="mx-auto min-h-screen max-w-[1200px] px-4 pb-24 pt-4 md:px-8 md:pb-10 md:pt-6">
          {children}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ececec] bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/homes")
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                  active ? "text-[#111]" : "text-[#8a8a8a]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.6} />
                {label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
