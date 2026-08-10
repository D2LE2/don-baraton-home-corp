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
  title: "Omar Corp — El futuro de vivir",
  description:
    "Omar Corp: showroom inmobiliario en vivo. Residencias en construcción, contador real y lista de espera exclusiva.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0b",
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
