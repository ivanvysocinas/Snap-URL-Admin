import { Metadata } from 'next';
import RealTimeAnalyticsContent from './RealTimeAnalyticsContent';

export const metadata: Metadata = {
  title: 'Real-time Analytics - SnapURL Admin',
  description: 'Monitor live activity, track real-time clicks, and view active users as they interact with your shortened URLs.',
  keywords: 'real-time analytics, live tracking, active users, click monitoring, live dashboard, real-time metrics',
};

/**
 * Real-time analytics page with live monitoring capabilities
 * Displays active users, live clicks, and real-time metrics
 */
export default function RealTimeAnalyticsPage(): JSX.Element {
  return <RealTimeAnalyticsContent />;
}