"use client";

import { KeyRound } from "lucide-react";
import { AppShell } from "@/components/homehub/AppShell";
import { MarketplaceStub } from "@/components/homehub/MarketplaceStub";

export default function RentalsPage() {
  return (
    <AppShell>
      <MarketplaceStub
        eyebrow="Find a rental"
        title="Homes & spaces for rent"
        description="Browse rentals near you — houses, rooms, and spaces ready to move into."
        icon={KeyRound}
        related={[
          { href: "/rentals/publish", label: "List your rental" },
          { href: "/discover", label: "Looking to buy? Browse homes" },
          { href: "/things", label: "Rent tools & things" },
        ]}
      />
    </AppShell>
  );
}
