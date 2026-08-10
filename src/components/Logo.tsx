import Link from "next/link";

export function Logo({
  href = "/",
  size = "md",
  light = false,
  as = "link",
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
  as?: "link" | "span";
}) {
  const sizes = {
    sm: { brand: "text-sm tracking-[0.42em]", sub: "text-[8px] tracking-[0.5em]" },
    md: { brand: "text-base tracking-[0.48em]", sub: "text-[9px] tracking-[0.55em]" },
    lg: { brand: "text-3xl tracking-[0.5em]", sub: "text-[11px] tracking-[0.6em]" },
  }[size];

  const className = `inline-flex flex-col leading-none ${light ? "text-white" : "text-ink"}`;
  const content = (
    <>
      <span className={`font-semibold ${sizes.brand}`}>OMAR</span>
      <span
        className={`mt-1.5 font-light ${light ? "text-gold-soft" : "text-gold"} ${sizes.sub}`}
      >
        CORP
      </span>
    </>
  );

  if (as === "span") {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
