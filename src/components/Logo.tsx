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
    sm: { brand: "text-sm tracking-[0.35em]", sub: "text-[8px] tracking-[0.45em]" },
    md: { brand: "text-base tracking-[0.4em]", sub: "text-[9px] tracking-[0.5em]" },
    lg: { brand: "text-2xl tracking-[0.45em]", sub: "text-[11px] tracking-[0.55em]" },
  }[size];

  const className = `inline-flex flex-col leading-none ${light ? "text-white" : "text-ink"}`;
  const content = (
    <>
      <span className={`font-medium ${sizes.brand}`}>NOVA</span>
      <span
        className={`mt-1 font-light ${light ? "text-white/55" : "text-muted"} ${sizes.sub}`}
      >
        HOMES
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
