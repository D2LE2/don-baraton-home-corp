import { notFound } from "next/navigation";
import { ResidenceDetailClient } from "@/components/ResidenceDetailClient";
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
    description: residence.teaser,
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

  return <ResidenceDetailClient residence={residence} />;
}
