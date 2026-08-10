"use client";

import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNova } from "@/context/NovaContext";
import type { PreMarketHome } from "@/data/homes";
import { formatPriceRange } from "@/data/homes";

export function JoinListModal({
  home,
  open,
  onClose,
}: {
  home: PreMarketHome;
  open: boolean;
  onClose: () => void;
}) {
  const { isOnWaitlist, joinWaitlist, follow } = useNova();
  const joined = isOnWaitlist(home.id);
  const [name, setName] = useState(follow?.name ?? "");
  const [email, setEmail] = useState(follow?.email ?? "");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    joinWaitlist({
      residenceId: home.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ececec] bg-white shadow-xl">
        <div className="relative border-b border-[#f0f0f0] px-6 py-5">
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              onClose();
              setDone(false);
            }}
            className="absolute top-4 right-4 rounded-full border border-[#ececec] p-2"
          >
            <X size={16} />
          </button>
          <p className="text-[12px] font-medium text-[#8a8a8a]">Priority list</p>
          <h3 className="mt-1 text-[1.25rem] font-semibold tracking-tight text-[#111]">
            {home.address}
          </h3>
          <p className="mt-1 text-[13px] text-[#6a6a6a]">
            {home.city}, {home.state} · {formatPriceRange(home.priceMin, home.priceMax)}
          </p>
          <p className="mt-2 text-[12px] text-[#8a8a8a]">
            {home.interested} people ahead of you · Est. {home.expectedCompletion}
          </p>
        </div>

        <div className="px-6 py-5">
          {joined || done ? (
            <div className="py-2 text-center">
              <p className="text-[17px] font-semibold text-[#111]">You&apos;re on the list</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6a6a6a]">
                We&apos;ll notify you when early access opens or this home has a major update.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setDone(false);
                }}
                className="mt-5 w-full rounded-full bg-[#111] py-3.5 text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-[12px] font-medium text-[#6a6a6a]">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3.5 py-3 text-[14px] outline-none focus:border-[#111]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#6a6a6a]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3.5 py-3 text-[14px] outline-none focus:border-[#111]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#6a6a6a]">Phone (optional)</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3.5 py-3 text-[14px] outline-none focus:border-[#111]"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-[#111] py-3.5 text-[14px] font-semibold text-white"
              >
                Join the list
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
