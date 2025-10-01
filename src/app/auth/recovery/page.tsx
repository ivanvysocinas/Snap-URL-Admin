import { Suspense, FC } from "react";
import type { Metadata } from "next";
import { RecoveryContent } from "./RecoveryContent";

/**
 * Password Recovery Page Metadata
 */
export const metadata: Metadata = {
  title: "Reset Password | SnapURL - Secure Account Recovery",
  description:
    "Reset your SnapURL account password securely. Enter your email to receive password reset instructions and regain access to your URL shortening dashboard.",
  keywords: [
    "password reset",
    "account recovery",
    "forgot password",
    "SnapURL login",
    "secure authentication",
    "account access",
  ],

  openGraph: {
    title: "Reset Your SnapURL Password",
    description:
      "Secure password recovery for your SnapURL account. Get back to managing your shortened URLs quickly and safely.",
    url: "/auth/recovery",
    siteName: "SnapURL",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "Reset Your SnapURL Password",
    description: "Secure password recovery for your SnapURL account.",
    creator: "@snapurl",
  },

  robots: {
    index: false,
    follow: true,
    nocache: true,
    noarchive: true,
  },

  other: {
    referrer: "strict-origin-when-cross-origin",
    "format-detection": "telephone=no",
  },

  // Fix verification type error
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],

  applicationName: "SnapURL",
  category: "productivity",
};

/**
 * Loading skeleton component
 */
const RecoveryLoadingSkeleton: FC = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
    <div className="w-full max-w-md mx-auto">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto"></div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Link skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>

    {/* Background decorations */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-green-400/5 to-blue-400/5 rounded-full blur-3xl" />
    </div>
  </div>
);

/**
 * Password Recovery Page
 * Handles secure password reset flow with accessibility features and structured data
 */
const PasswordRecoveryPage: FC = () => {
  return (
    <main
      className="password-recovery-page"
      role="main"
      aria-label="Password Recovery"
    >
      <a
        href="#recovery-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to password recovery form
      </a>

      <section id="recovery-content" aria-label="Password Recovery Form">
        <Suspense fallback={<RecoveryLoadingSkeleton />}>
          <RecoveryContent />
        </Suspense>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Password Recovery",
            description: "Secure password recovery page for SnapURL accounts",
            url: "/auth/recovery",
            isPartOf: {
              "@type": "WebSite",
              name: "SnapURL",
              url: "/",
            },
            potentialAction: {
              "@type": "Action",
              name: "Reset Password",
              target: "/auth/recovery",
            },
          }),
        }}
      />
    </main>
  );
};

export default PasswordRecoveryPage;
