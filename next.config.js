/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Experimental features
  experimental: {
    // App Router (already enabled by default in Next.js 13+)
    appDir: true,

    // Server Components for better performance
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],

    // Optimized CSS loading
    optimizeCss: true,
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/register",
        permanent: true,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack configuration for better bundling
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Add support for importing SVG files as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },

  // Output configuration for different deployment targets
  output: "standalone",

  // PoweredByHeader removal for security
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Page extensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // Ignore TypeScript errors during build (not recommended for production)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Ignore ESLint errors during build (not recommended for production)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Rewrites for API proxying if needed
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_BASE_URL}/:path*`,
      },
    ];
  },
};
