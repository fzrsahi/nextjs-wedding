import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";

import { UI_OG_INCOMPLETE_DESCRIPTION, UI_OG_INCOMPLETE_TITLE, UI_OG_SITE_NAME } from "@/lib/constants/messages.id";

import "./globals.css";

/** Untuk `og:image` & URL absolut; set `NEXT_PUBLIC_SITE_URL` di produksi (mis. https://undangan.domain.com). */
function resolveMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: UI_OG_INCOMPLETE_TITLE,
  description: UI_OG_INCOMPLETE_DESCRIPTION,
  openGraph: {
    siteName: UI_OG_SITE_NAME,
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Browser extensions may inject attributes on <body> and trigger hydration warnings. */}
      <body className="min-h-full flex flex-col bg-neutral-200" suppressHydrationWarning>
        <div 
          className="mx-auto w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl overflow-x-hidden"
          style={{ transform: "translateZ(0)", containerType: "inline-size" }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
