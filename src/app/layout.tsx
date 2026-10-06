import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const clay = Nunito({
  subsets: ["latin"],
  variable: "--font-clay",
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TechMunda Control Tower",
  description: "TechMunda × Curevanta Project Control Tower — execution operating system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} ${clay.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
