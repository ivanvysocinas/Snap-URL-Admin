import type { ShortUrl } from "./url.types.ts";


/**
 * High-level analytics overview metrics
 */
export interface AnalyticsOverview {
  totalClicks: number;
  uniqueClicks: number;
  uniqueVisitors: number;
  averageLoadTime: number;
  conversionRate?: number;
  engagementScore?: number;
}

/**
 * Geographic analytics data structure
 */
export interface GeographicData {
  byCountry: CountryStats[];
  byCity?: CityStats[];
  topCountries: CountryStats[];
}

/**
 * Country-specific analytics metrics
 */
export interface CountryStats {
  _id: string;
  count: number;
  countryName: string;
  countryCode?: string;
  percentage?: number;
}

/**
 * City-specific analytics metrics
 */
export interface CityStats {
  _id: string;
  count: number;
  cityName: string;
  countryName: string;
  percentage?: number;
}

/**
 * Technology and device analytics data
 */
export interface TechnologyData {
  byDevice: DeviceStats[];
  byBrowser: BrowserStats[];
  byOS?: OSStats[];
  topBrowsers: BrowserStats[];
  topDevices: DeviceStats[];
}

/**
 * Device type analytics metrics
 */
export interface DeviceStats {
  _id: string;
  count: number;
  deviceType: "desktop" | "mobile" | "tablet";
  percentage?: number;
}

/**
 * Browser analytics metrics
 */
export interface BrowserStats {
  _id: string;
  count: number;
  browserName: string;
  version?: string;
  percentage?: number;
}

/**
 * Operating system analytics metrics
 */
export interface OSStats {
  _id: string;
  count: number;
  osName: string;
  version?: string;
  percentage?: number;
}

/**
 * Traffic source and timing analytics data
 */
export interface TrafficData {
  byReferrer: ReferrerStats[];
  clicksByHour: TimeSeriesData[];
  clicksByDay: TimeSeriesData[];
  clicksByWeek?: TimeSeriesData[];
  clicksByMonth?: TimeSeriesData[];
}

/**
 * Referrer source analytics metrics
 */
export interface ReferrerStats {
  _id: string;
  count: number;
  domain: string;
  percentage?: number;
}

/**
 * Time-based analytics data points
 */
export interface TimeSeriesData {
  date: string;
  clicks: number;
  uniqueVisitors: number;
  timestamp?: number;
}

/**
 * Comprehensive URL analytics structure
 */
export interface UrlAnalytics {
  url: ShortUrl;
  overview: AnalyticsOverview;
  geographic: GeographicData;
  technology: TechnologyData;
  traffic: TrafficData;
  performance: PerformanceMetrics;
  realTime: RealTimeStats;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Performance and engagement metrics
 */
export interface PerformanceMetrics {
  clicksPerDay: number;
  conversionRate: number;
  engagementScore: number;
  peakHour: number;
  trendDirection: "up" | "down" | "stable";
  growthRate?: number;
}

/**
 * Real-time analytics data
 */
export interface RealTimeStats {
  clicksLast5Minutes: number;
  clicksLastHour: number;
  activeCountries: string[];
  liveVisitors: number;
  lastUpdated: string;
}

/**
 * Dashboard overview data structure
 */
export interface DashboardData {
  userId: string;
  overview: AnalyticsOverview;
  trends: TimeSeriesData[];
  geographic: {
    topCountries: CountryStats[];
  };
  topUrls: TopUrlStats[];
  recentActivity: ActivityEvent[];
  performance: PerformanceMetrics;
}

/**
 * Top performing URLs metrics
 */
export interface TopUrlStats {
  _id: string;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clickCount: number;
  uniqueClicks: number;
  createdAt: string;
  performance?: PerformanceMetrics;
}

/**
 * User activity event tracking
 */
export interface ActivityEvent {
  type: "click" | "create" | "update" | "delete";
  timestamp: string;
  url?: ShortUrl;
  location?: string;
  device?: string;
  browser?: string;
  ipAddress?: string;
}

/**
 * Platform-wide analytics for admin views
 */
export interface PlatformAnalytics {
  overview: {
    users: {
      total: number;
      active: number;
      new: number;
    };
    urls: {
      total: number;
      active: number;
      new: number;
    };
    clicks: {
      total: number;
      today: number;
      thisWeek: number;
    };
  };
  growth: {
    users: GrowthMetrics;
    urls: GrowthMetrics;
    clicks: GrowthMetrics;
  };
  performance: PerformanceMetrics;
  trends: TimeSeriesData[];
}

/**
 * Growth tracking metrics structure
 */
export interface GrowthMetrics {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
}

/**
 * Analytics time period options
 */
export type AnalyticsPeriod = "1d" | "7d" | "30d" | "90d" | "custom";

/**
 * Report generation types
 */
export type ReportType = "url" | "user" | "platform";