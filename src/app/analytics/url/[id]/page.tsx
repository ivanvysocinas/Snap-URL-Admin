import type { Metadata } from "next";
import UrlAnalyticsContent from "./UrlAnalyticsContent";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `URL Analytics - SnapURL`,
    description:
      "Detailed analytics and insights for your shortened URL including clicks, geographic data, device information, and performance metrics.",
    keywords:
      "URL analytics, click tracking, geographic data, device analytics, performance metrics",
  };
}

/**
 * URL Analytics Page Component
 * Server component entry point for individual URL analytics
 */
export default function UrlAnalyticsPage({ params }: PageProps) {
  return <UrlAnalyticsContent urlId={params.id} />;
}
