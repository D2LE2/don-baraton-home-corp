import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { NovaProvider } from "@/context/NovaContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "HomeHub — Pre-market homes",
  description:
    "Discover homes before they hit the market. Follow renovations, join early access, and get in line before Zillow.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8f7f4] text-[#111]">
        <NovaProvider>{children}</NovaProvider>
      </body>
    </html>
  );
}
