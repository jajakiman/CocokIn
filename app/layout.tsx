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
  title: "CocokIn | Talent Bertumbuh, UMKM Naik Kelas",
  description:
    "CocokIn mempertemukan Talent dan UMKM melalui matching terukur, proyek digital, dan bukti kerja terverifikasi.",
  openGraph: {
    title: "CocokIn | Talent Bertumbuh, UMKM Naik Kelas",
    description:
      "Temukan kecocokan terukur, jalankan proyek digital, dan bangun bukti kerja terverifikasi bersama CocokIn.",
    siteName: "CocokIn",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body className={jakarta.variable}>
        <TalentProvider>{children}</TalentProvider>
      </body>
    </html>
  );
}
