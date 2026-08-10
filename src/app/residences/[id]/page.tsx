import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BuildStory } from "@/components/BuildStory";
import { FollowHome } from "@/components/FollowHome";
import { LiveProgress } from "@/components/LiveProgress";
import { Logo } from "@/components/Logo";
import { ResidenceWaitlistBanner } from "@/components/ResidenceWaitlistBanner";
import { getResidence, residences } from "@/data/residences";

export function generateStaticParams() {
  return residences.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const residence = getResidence(id);
  if (!residence) return { title: "Residence — Omar Corp" };
  return {
    title: `${residence.name} — Omar Corp`,
    description: residence.tagline,
  };
}

export default async function ResidenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const residence = getResidence(id);
  if (!residence) notFound();

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md md:px-10">
        <Link
          href="/residences"
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-muted uppercase"
        >
          <ArrowLeft size={16} />
          Residences
        </Link>
        <Logo size="sm" />
        <Link
          href="/private"
          className="text-[10px] tracking-[0.2em] text-gold uppercase"
        >
          Private
        </Link>
      </header>

      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <Image
          src={residence.image}
          alt={residence.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10">
          <p className="text-[11px] tracking-[0.3em] text-gold-soft uppercase">{residence.code}</p>
          <h1 className="mt-2 text-4xl font-light tracking-[0.08em] text-white md:text-6xl">
            {residence.name}
          </h1>
          <p className="mt-2 text-white/70">{residence.location}</p>
          <p className="mt-4 text-sm tracking-[0.12em] text-white/85 uppercase">
            {residence.beds} BED · {residence.baths} BATH · {residence.sqft.toLocaleString()} SQ FT ·{" "}
            {residence.garage} GARAGE
          </p>
        </div>
      </section>

      <ResidenceWaitlistBanner residence={residence} />

      <BuildStory stages={residence.stages} />
      <LiveProgress progress={residence.progress} stages={residence.stages} />

      <div id="follow">
        <FollowHome residence={residence} />
      </div>

      <section className="border-t border-border bg-ink px-5 py-16 text-center text-white md:px-10">
        <p className="text-[11px] tracking-[0.3em] text-gold-soft uppercase">Omar Private</p>
        <h2 className="mx-auto mt-3 max-w-lg text-2xl font-light tracking-wide">
          Acceso privado a residencias antes de que salgan al mercado.
        </h2>
        <Link
          href="/private/apply"
          className="mt-8 inline-flex rounded-full bg-gold-soft px-8 py-3.5 text-[11px] tracking-[0.22em] text-ink uppercase"
        >
          Solicitar membresía →
        </Link>
      </section>
    </main>
  );
}
