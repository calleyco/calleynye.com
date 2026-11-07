import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ConsoleEasterEgg } from "@/components/layout/console-easter-egg";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: "Calley Nye | Senior Software Engineer",
  description:
    "Calley Nye portfolio: accessibility leadership, real-time UI engineering, and writing on AI-assisted inclusive product development.",
};

// Runs synchronously before paint so the first painted pixels are the correct
// theme — no flash. Mirrors src/lib/theme.ts's resolve rule in plain JS because
// an inline <script> string cannot import the TS module.
const themeScript = `(function(){try{var p=localStorage.getItem("calley.theme");var s=window.matchMedia("(prefers-color-scheme: light)").matches;var l=p==="light"||((p==="system"||!p)&&s);var d=document.documentElement;d.classList.toggle("light",l);d.style.colorScheme=l?"light":"dark";}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <ConsoleEasterEgg />
        <ReadingProgress />
        <div className="stage">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
