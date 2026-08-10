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
  title: "Omar Corp — Ve la casa antes de que sea hogar",
  description:
    "Colección privada de residencias en transformación. Sigue cada avance, descubre propiedades y asegura prioridad en la lista.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <head>
        {/* Set --app-vh before paint so the hero never undersizes on mobile */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(d.style.getPropertyValue('--app-vh'))return;var el=document.createElement('div');el.style.cssText='position:fixed;left:0;top:0;height:100lvh;width:0;visibility:hidden;pointer-events:none';d.appendChild(el);var h=Math.round(el.offsetHeight||0);el.remove();if(!h)h=Math.max(window.innerHeight||0,d.clientHeight||0,screen.height||0);if(h)d.style.setProperty('--app-vh',(h+48)+'px');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <NovaProvider>{children}</NovaProvider>
      </body>
    </html>
  );
}
