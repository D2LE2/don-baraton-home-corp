"use client";

import Link from "next/link";
import { AppShell } from "@/components/homehub/AppShell";
import { useNova } from "@/context/NovaContext";
import { homes } from "@/data/homes";

export default function EarlyAccessPage() {
  const { waitlist, isOnWaitlist } = useNova();
  const joined = homes.filter((h) => isOnWaitlist(h.id));

  return (
    <AppShell>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111]">Early Access</h1>
      <p className="mt-2 max-w-lg text-[14px] text-[#6a6a6a]">
        Priority lists for pre-market homes. When a project is ready, you&apos;re already in line —
        before the open market.
      </p>

      {joined.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#e0e0e0] bg-white px-5 py-10 text-center">
          <p className="text-[14px] text-[#8a8a8a]">You haven&apos;t joined a list yet.</p>
          <Link
            href="/discover"
            className="mt-4 inline-flex rounded-full bg-[#111] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Discover homes
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {joined.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between rounded-2xl border border-[#ececec] bg-white px-4 py-4"
            >
              <div>
                <p className="text-[15px] font-semibold text-[#111]">{h.address}</p>
                <p className="text-[13px] text-[#6a6a6a]">
                  {h.city} · {h.progress}% · Est. {h.expectedCompletion}
                </p>
              </div>
              <Link
                href={`/homes/${h.id}`}
                className="rounded-full border border-[#e8e8e8] px-3 py-1.5 text-[12px] font-medium text-[#111]"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}

      {waitlist.length > 0 && (
        <p className="mt-6 text-[12px] text-[#8a8a8a]">{waitlist.length} list membership(s) saved</p>
      )}
    </AppShell>
  );
}
