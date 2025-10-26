import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - SnapURL Admin",
    default: "SnapURL Admin - URL Management Dashboard",
  },
  description:
    "Professional URL shortening service with advanced analytics, custom domains, and comprehensive link management tools.",
  keywords: [
    "URL shortener",
    "link management",
    "analytics",
    "QR codes",
    "custom domains",
    "click tracking",
    "link performance",
    "marketing tools",
  ],
  authors: [{ name: "SnapURL Team" }],
  creator: "SnapURL",
  publisher: "SnapURL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://app.snapurl.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.snapurl.dev",
    siteName: "SnapURL Admin",
    title: "SnapURL Admin - Professional URL Management",
    description:
      "Advanced URL shortening service with real-time analytics and comprehensive link management tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapURL Admin Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@snapurl",
    creator: "@snapurl",
    title: "SnapURL Admin - Professional URL Management",
    description: "Advanced URL shortening service with real-time analytics.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "6261416f336707bf",
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  colorScheme: "light dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component with providers and global styles
 * Configures theme, authentication, SEO metadata, and accessibility features
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch for potential third-party services */}
        <link rel="dns-prefetch" href="//api.snapurl.dev" />
        <link rel="dns-prefetch" href="//cdn.snapurl.dev" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme colors for mobile browsers */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${inter.className} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>

          {/* Main application content */}
          <div id="main-content" className="min-h-screen">
            {children}
          </div>

          {/* Portal root for modals */}
          <div id="modal-root" />

          {/* Portal root for toasts */}
          <div id="toast-root" />
        </Providers>

        {/* Analytics script placeholder */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}