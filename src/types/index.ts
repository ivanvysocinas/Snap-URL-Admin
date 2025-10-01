/**
 * Main types export file for SnapURL application
 * Provides centralized access to all type definitions
 */

// User and authentication types
export type {
  User,
  UserPreferences,
  UserSubscription,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ProfileUpdateResponse,
  PasswordChangeData,
} from './user.types';

// URL and link management types
export type {
  ShortUrl,
  UrlMetadata,
  CreateUrlRequest,
  UpdateUrlRequest,
  BulkCreateUrlsRequest,
  QRCode,
  ExportFormat,
  QRCodeFormat,
} from './url.types';

// Analytics and metrics types
export type {
  AnalyticsOverview,
  GeographicData,
  CountryStats,
  CityStats,
  TechnologyData,
  DeviceStats,
  BrowserStats,
  OSStats,
  TrafficData,
  ReferrerStats,
  TimeSeriesData,
  UrlAnalytics,
  PerformanceMetrics,
  RealTimeStats,
  DashboardData,
  TopUrlStats,
  ActivityEvent,
  PlatformAnalytics,
  GrowthMetrics,
  AnalyticsPeriod,
  ReportType,
} from './analytics.types';

// API and response types
export type {
  ApiResponse,
  ExportApiResponse,
  PaginationMeta,
  SortOrder,
} from './api.types';

// UI component and form types
export type {
  ChartDataPoint,
  ModalProps,
  TableColumn,
  FilterOption,
  FormField,
  ValidationRule,
  FormErrors,
  Theme,
  ThemeConfig,
  NavigationItem,
} from './ui.types';

// Header-specific types
export type {
  HeaderUser,
  Notification,
  SearchResult,
  HeaderProps,
} from './header.types';