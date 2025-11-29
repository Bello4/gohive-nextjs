import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";

// Theme provider
import { ThemeProvider } from "next-themes";
import ModalProvider from "@/providers/modal-provider";

import { Toaster } from "@/components/ui/sonner";

// Fonts
const interFont = Inter({ subsets: ["latin"] });
const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "HiveGo",
  description:
    "Welcome to HiveGo, your ultimate destination for seamless online dispacth rider app!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HiveGo",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "HiveGo",
    title: {
      default: "HiveGo",
      template: "%s | GoHive",
    },
    description:
      "Welcome to HiveGo, your ultimate destination for seamless online dispacth rider app!",
  },
  twitter: {
    card: "summary",
    title: {
      default: "HiveGo",
      template: "%s | GoHive",
    },
    description:
      "Welcome to HiveGo, your ultimate destination for seamless online dispacth rider app!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GoHive" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${interFont.className} ${barlowFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>{children}</ModalProvider>
          <Toaster />
        </ThemeProvider>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        />
      </body>
    </html>
  );
}
