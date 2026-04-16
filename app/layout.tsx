import type { Metadata } from "next";
import { MuseoModerno, Inter, Outfit } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import { ToastProvider } from "./components/Toast";
import BackToTop from "./components/BackToTop";
import { getSiteConfig } from "./lib/data-service";

const displayFont = MuseoModerno({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const accentFont = Outfit({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteConfig('seo', {
    title: "The Thinking Architect | Africa's Architecture Thinking Community",
    description: "TTA is a pan-African platform for architectural thinking. We host curated talks, written dialogues, and a community of architects and students committed to the culture of rigour in design.",
    keywords: "African architecture, architecture community Nigeria, architectural thinking, design education Africa, architecture talks, built environment Africa, The Thinking Architect"
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: typeof seo.keywords === 'string' ? seo.keywords.split(',').map((k: string) => k.trim()) : seo.keywords,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Preloader>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
          </Preloader>
        </ToastProvider>
      </body>
    </html>
  );
}

