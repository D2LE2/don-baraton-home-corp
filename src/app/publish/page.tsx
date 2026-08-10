"use client";

import { Building2 } from "lucide-react";
import { AppShell } from "@/components/homehub/AppShell";
import { MarketplaceStub } from "@/components/homehub/MarketplaceStub";

export default function PublishPage() {
  return (
    <AppShell>
      <MarketplaceStub
        eyebrow="For owners & builders"
        title="Publish a home project"
        description="List a renovation or new build, share progress, and measure demand before the home hits the open market."
        icon={Building2}
        related={[
          { href: "/discover", label: "Browse homes seekers see" },
          { href: "/rentals/publish", label: "List a rental instead" },
        ]}
      />
    </AppShell>
  );
}
