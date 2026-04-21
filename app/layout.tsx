import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/supabase/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ankorpus.kz"),
  title: {
    default: "Ән мәтіндерінің корпусы",
    template: "%s · Ән мәтіндерінің корпусы",
  },
  description: "Қазақ тіліндегі поп, дәстүрлі және эстрадалық ән мәтіндерін зерттеуге арналған аннотацияланған ғылыми платформа.",
  openGraph: {
    title: "Ән мәтіндерінің корпусы",
    description: "15 000+ аннотацияланған мәтін · ғылыми зерттеу платформасы",
    url: "https://ankorpus.kz",
    siteName: "Ән мәтіндерінің корпусы",
    locale: "kk_KZ",
    type: "website",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Ән мәтіндерінің корпусы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ән мәтіндерінің корпусы",
    description: "Қазақ тіліндегі поп, дәстүрлі және эстрадалық ән мәтіндерінің аннотацияланған корпусы.",
    images: ["/og-cover.svg"],
  },
};

export const viewport = {
  themeColor: "#0A0A0F",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="kk" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-bg-primary font-sans text-text-primary antialiased">
        <div className="relative flex min-h-screen flex-col overflow-x-clip">
          <SiteNavbar userEmail={user?.email ?? null} />
          <main className="flex-1 pt-20">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
