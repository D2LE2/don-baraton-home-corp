import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { NovaProvider } from "@/context/NovaContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "NOVA HOMES — El futuro de vivir",
  description:
    "Showroom inmobiliario en vivo. Descubre residencias en construcción, sigue su transformación y solicita acceso a NOVA Private.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <NovaProvider>{children}</NovaProvider>
      </body>
    </html>
  );
}
