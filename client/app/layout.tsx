import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BimalX Shorten - Free URL Shortener",
    template: "%s | BimalX Shorten"
  },
  description: "Create short, memorable links and track clicks with our free URL shortener service",
  keywords: ["URL shortener", "link shortener", "free link shortening", "custom URLs"],
  metadataBase: new URL("https://bimalxshorten.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BimalX Shorten",
    description: "Free custom URL shortener service",
    url: "https://bimalxshorten.vercel.app",
    siteName: "BimalX Shorten",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BimalX Shorten",
    description: "Free custom URL shortener service",
    images: ['/og-image.png'],
  },
  verification: {
    google: 'wxbR1YVfm3FmiWwibcXRZHTPBrN9C3AQGtRJ01fpp5Y', // Your actual verification code
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Google Search Console Verification */}
        <meta 
          name="google-site-verification" 
          content="wxbR1YVfm3FmiWwibcXRZHTPBrN9C3AQGtRJ01fpp5Y" 
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "BimalX Shorten",
              "url": "https://bimalxshorten.vercel.app",
              "description": "Free URL shortening service",
              "applicationCategory": "Utility"
            })
          }}
        />
      </body>
    </html>
  );
}