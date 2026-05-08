import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perspectiv - Transaction Enrichment API",
  description:
    "Enrich your transactions with complete merchant data, logos, and details. Easy integration, powerful analytics.",
  generator: "v0.app",
  openGraph: {
    title: "Perspectiv - Transaction Enrichment API",
    description:
      "Enrich your transactions with complete merchant data, logos, and details. Easy integration, powerful analytics.",
    url: "https://www.perspectiv.live",
    siteName: "Perspectiv",
    images: [
      {
        url: "/open_graph_image.png",
        width: 1200,
        height: 630,
        alt: "Perspectiv - Transaction Enrichment API",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
