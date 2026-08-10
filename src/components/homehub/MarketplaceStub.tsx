import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type RelatedLink = {
  href: string;
  label: string;
};

export function MarketplaceStub({
  eyebrow,
  title,
  description,
  icon: Icon,
  related = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  related?: RelatedLink[];
}) {
  return (
    <div className="mx-auto max-w-xl">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#f3ebe3] px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-[#a67c52] uppercase">
        <Icon size={13} strokeWidth={1.75} />
        {eyebrow}
      </span>
      <h1 className="mt-4 text-[1.65rem] font-semibold tracking-tight text-[#111] md:text-[1.85rem]">
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#6a6a6a]">{description}</p>
      <p className="mt-4 rounded-2xl border border-dashed border-[#e4e4e4] bg-[#fafafa] px-4 py-3 text-[13px] text-[#6a6a6a]">
        Coming soon — this side of HomeHub is scaffolded so seekers and publishers can enter from
        day one.
      </p>
      {related.length > 0 && (
        <div className="mt-8 space-y-2">
          <p className="text-[12px] font-semibold tracking-wide text-[#8a8a8a] uppercase">
            Also explore
          </p>
          <div className="flex flex-col gap-2">
            {related.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center justify-between rounded-2xl border border-[#ececec] bg-white px-4 py-3.5 text-[14px] font-medium text-[#111] transition hover:border-[#ddd]"
              >
                {label}
                <ArrowRight size={15} className="text-[#8a8a8a]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
