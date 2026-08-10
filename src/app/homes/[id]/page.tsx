import { notFound } from "next/navigation";
import { AppShell } from "@/components/homehub/AppShell";
import { HomeDetailClient } from "@/components/homehub/HomeDetailClient";
import { getHome, homes } from "@/data/homes";

export function generateStaticParams() {
  return homes.map((h) => ({ id: h.id }));
}

export default async function HomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const home = getHome(id);
  if (!home) notFound();

  return (
    <AppShell>
      <HomeDetailClient home={home} />
    </AppShell>
  );
}
