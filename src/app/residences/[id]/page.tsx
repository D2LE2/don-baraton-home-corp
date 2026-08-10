import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [{ id: "001" }, { id: "002" }, { id: "003" }];
}

export default async function ResidenceRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/homes/${id}`);
}
