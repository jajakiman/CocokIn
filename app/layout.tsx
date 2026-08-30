import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { TalentProvider } from "@/src/context/talent-context";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cocokin.id"),
  title: {
    default: "CocokIn | Talent Bertumbuh, UMKM Naik Kelas",
    template: "%s | CocokIn",
  },
  description:
    "CocokIn mempertemukan Talent dan UMKM melalui matching terukur, proyek digital, dan bukti kerja terverifikasi.",
  openGraph: {
    title: "CocokIn | Talent Bertumbuh, UMKM Naik Kelas",
    description:
      "Temukan kecocokan terukur, jalankan proyek digital, dan bangun bukti kerja terverifikasi bersama CocokIn.",
    siteName: "CocokIn",
    type: "website",
    url: "/",
    images: [
      {
        url: "/brand/cocokin/logo-full.webp",
        width: 2089,
        height: 753,
        alt: "CocokIn",
      },
    ],
  },
  icons: {
    icon: "/brand/cocokin/logo-mark.webp",
    shortcut: "/brand/cocokin/logo-mark.webp",
  },
  twitter: {
    card: "summary_large_image",
    title: "CocokIn | Talent Bertumbuh, UMKM Naik Kelas",
    description:
      "Temukan kecocokan terukur, jalankan proyek digital, dan bangun bukti kerja terverifikasi bersama CocokIn.",
    images: ["/brand/cocokin/logo-full.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={jakarta.variable} suppressHydrationWarning>
        <TalentProvider>{children}</TalentProvider>
      </body>
    </html>
  );
}
