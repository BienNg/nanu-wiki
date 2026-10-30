import type { Metadata } from "next";
import { Inter, Inter_Tight, Patrick_Hand } from "next/font/google";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});
// Handwriting for the margin notes in Messenger examples.
const patrickHand = Patrick_Hand({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-patrick-hand", display: "swap" });

export const metadata: Metadata = {
  title: { default: "NaNu Wiki", template: "%s · NaNu Wiki" },
  description: "Interne Wissensbasis von NaNu NaNa · Kho kiến thức nội bộ",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const lang = (store.get("lang")?.value as Lang | undefined) ?? "both";

  return (
    <html lang={lang === "vi" ? "vi" : "de"} className={`${inter.variable} ${interTight.variable} ${patrickHand.variable} lang-${lang}`}>
      <body className="font-sans text-sm leading-relaxed antialiased">{children}</body>
    </html>
  );
}
