"use client";

import { Home } from "lucide-react";
import { AppShell } from "@/components/homehub/AppShell";
import { MarketplaceStub } from "@/components/homehub/MarketplaceStub";

export default function PublishRentalPage() {
  return (
    <AppShell>
      <MarketplaceStub
        eyebrow="For landlords & hosts"
        title="List a rental"
        description="Publish a home or space for rent, set availability, and connect with people looking nearby."
        icon={Home}
        related={[
          { href: "/rentals", label: "See what renters browse" },
          { href: "/publish", label: "Publish a home for sale instead" },
        ]}
      />
    </AppShell>
  );
}
