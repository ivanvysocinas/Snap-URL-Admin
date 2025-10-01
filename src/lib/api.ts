/**
 * API Client for URL Shortener Service
 *
 * This module provides a comprehensive client for interacting with the URL shortener API.
 * It handles authentication, URL management, analytics, redirects, and utility functions.
 *
 * Features:
 * - Automatic token management for authenticated requests
 * - Flexible base URL configuration for different environments
 * - Type-safe API responses with full TypeScript support
 * - Error handling and response parsing for different content types
 * - Support for both client-side and server-side rendering
 */

import type {
  ApiResponse,
  ShortUrl,
  CreateUrlRequest,
  UpdateUrlRequest,
  BulkCreateUrlsRequest,
  UrlAnalytics,
  DashboardData,
  User,
  LoginCredentials,
  AuthResponse,
  PasswordChangeData,
  ExportFormat,
  PaginationMeta,
  QRCode,
} from "../types";

/**
 * Determines the appropriate base URL for API requests
 * Handles both server-side and client-side environments
 */
const getBaseURL = (): string => {
  if (typeof window === "undefined") {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE_URL ||
      "http://localhost:3001"
    );
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
};

export const BASE_URL = getBaseURL();

/**
 * Retrieves the authentication token from localStorage
 * Returns null in server-side environment
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * Generic HTTP request handler with automatic authentication and response parsing
 *
 * @param endpoint - API endpoint path
 * @param options - Request configuration options
 * @returns Promise with typed API response
 *
 * Features:
 * - Automatic Bearer token injection for authenticated requests
 * - Content-type aware response parsing (JSON, text, blob)
 * - Error handling and logging
 */
const makeRequest = async <T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    skipAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> => {
  const { method = "GET", body, headers = {}, skipAuth = false } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Добавляем авторизацию если не пропускаем
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // Добавляем body для POST/PUT запросов
  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Проверяем content-type для правильного парсинга
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("text/")) {
      const text = await response.text();
      data = { success: response.ok, message: text, data: text };
    } else {
      // Для других типов (например, файлы)
      const blob = await response.blob();
      data = { success: response.ok, data: blob };
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  /**
   * Authentication API methods
   * Handles user registration, login, profile management, and security features
   */
  auth: {
    // POST /api/auth/register - only name, email, password
    register: async (userData: {
      name: string;
      email: string;
      password: string;
    }): Promise<AuthResponse> => {
      const response = await makeRequest<{ user: User; token: string }>(
        "/api/auth/register",
        {
          method: "POST",
          body: userData,
          skipAuth: true,
        }
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          error: response.error,
        };
      }

      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    },

    // POST /api/auth/login - only email, password
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await makeRequest<{ user: User; token: string }>(
        "/api/auth/login",
        {
          method: "POST",
          body: credentials,
          skipAuth: true,
        }
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          error: response.error,
        };
      }

      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    },

    // POST /api/auth/refresh
    refresh: async (): Promise<AuthResponse> => {
      return makeRequest<{ user: User; token: string }>("/api/auth/refresh", {
        method: "POST",
      });
    },

    // POST /api/auth/logout
    logout: async (): Promise<ApiResponse<void>> => {
      return makeRequest<void>("/api/auth/logout", { method: "POST" });
    },

    // GET /api/auth/validate
    validate: async (): Promise<
      ApiResponse<{ user: User; tokenData: any }>
    > => {
      return makeRequest<{ user: User; tokenData: any }>("/api/auth/validate");
    },

    // GET /api/auth/profile
    getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
      return makeRequest<{ user: User }>("/api/auth/profile");
    },

    // PUT /api/auth/profile
    updateProfile: async (
      updates: Partial<User>
    ): Promise<ApiResponse<{ user: User }>> => {
      return makeRequest<{ user: User }>("/api/auth/profile", {
        method: "PUT",
        body: updates,
      });
    },

    // PUT /api/auth/change-password - currentPassword, newPassword
    changePassword: async (
      passwords: PasswordChangeData
    ): Promise<ApiResponse<void>> => {
      return makeRequest<void>("/api/auth/change-password", {
        method: "PUT",
        body: passwords,
      });
    },

    // POST /api/auth/forgot-password
    forgotPassword: async (
      email: string
    ): Promise<ApiResponse<{ resetToken?: string }>> => {
      return makeRequest<{ resetToken?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
        skipAuth: true,
      });
    },

    // POST /api/auth/reset-password
    resetPassword: async (
      resetToken: string,
      newPassword: string
    ): Promise<ApiResponse<void>> => {
      return makeRequest<void>("/api/auth/reset-password", {
        method: "POST",
        body: { resetToken, newPassword },
        skipAuth: true,
      });
    },

    // GET /api/auth/usage
    getApiUsage: async (): Promise<
      ApiResponse<{
        usage: {
          userId: string;
          requestCount: number;
          lastRequestAt: string;
          rateLimitResets: number;
          accountAge: number;
          totalUrls: number;
          totalClicks: number;
          activityScore: number;
        };
      }>
    > => {
      return makeRequest<any>("/api/auth/usage");
    },

    // POST /api/auth/api-key
    generateApiKey: async (
      keyName?: string
    ): Promise<
      ApiResponse<{
        apiKey: string;
        keyName: string;
        expiresAt: string;
      }>
    > => {
      return makeRequest<any>("/api/auth/api-key", {
        method: "POST",
        body: keyName ? { keyName } : {},
      });
    },

    // DELETE /api/auth/account
    deactivateAccount: async (
      reason?: string
    ): Promise<
      ApiResponse<{
        deactivatedAt: string;
        reason?: string;
      }>
    > => {
      return makeRequest<any>("/api/auth/account", {
        method: "DELETE",
        body: reason ? { reason } : {},
      });
    },
  },

  /**
   * URL Management API methods
   * Handles URL shortening, retrieval, updates, and bulk operations
   */
  urls: {
    // POST /api/urls - optionalAuth
    create: async (
      urlData: CreateUrlRequest
    ): Promise<ApiResponse<{ url: ShortUrl; shortUrl: string }>> => {
      return makeRequest<{ url: ShortUrl; shortUrl: string }>("/api/urls", {
        method: "POST",
        body: urlData,
        skipAuth: false, // optionalAuth в роуте означает что токен опционален
      });
    },

    /**
     * Retrieves all URLs with optional pagination and filtering
     *
     * @param params - Query parameters for filtering and pagination
     * @returns Paginated list of URLs with metadata
     */
    getAll: async (params?: {
      page?: number;
      limit?: number;
      sortBy?: "createdAt" | "clickCount" | "title" | "lastClickedAt";
      sortOrder?: "asc" | "desc";
      search?: string;
      isActive?: boolean;
    }): Promise<ApiResponse<ShortUrl[]> & { pagination?: PaginationMeta }> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/urls${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<ShortUrl[]>(endpoint);
    },

    // GET /api/urls/search
    search: async (
      query: string,
      params?: {
        page?: number;
        limit?: number;
        sortBy?: "relevance" | "recent" | "popular";
      }
    ): Promise<ApiResponse<ShortUrl[]> & { pagination?: PaginationMeta }> => {
      const searchParams = new URLSearchParams({ q: query });

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      return makeRequest<ShortUrl[]>(
        `/api/urls/search?${searchParams.toString()}`
      );
    },

    // GET /api/urls/popular
    getPopular: async (params?: {
      limit?: number;
      days?: number;
      minClicks?: number;
    }): Promise<ApiResponse<ShortUrl[]>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/urls/popular${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<ShortUrl[]>(endpoint);
    },

    /**
     * Exports URLs data in various formats
     * Handles special response parsing for CSV and JSON formats
     *
     * @param params - Export configuration options
     * @returns Raw data in requested format (CSV string or JSON object)
     */
    export: async (params?: {
      format?: ExportFormat;
      includeAnalytics?: boolean;
      includeInactive?: boolean;
      startDate?: string;
      endDate?: string;
    }): Promise<any> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/urls/export${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

      try {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType?.includes("text/csv")) {
          const csvText = await response.text();
          return csvText;
        } else if (contentType?.includes("application/json")) {
          const jsonData = await response.json();

          if (jsonData.success && jsonData.data) {
            return jsonData.data;
          }
          return jsonData;
        } else {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.error(`Export Error:`, error);
        throw error;
      }
    },

    // GET /api/urls/preview/{shortCode} - no auth
    getPreview: async (
      shortCode: string
    ): Promise<
      ApiResponse<{
        originalUrl: string;
        title?: string;
        description?: string;
        domain: string;
        createdAt: string;
        qrCode?: string;
      }>
    > => {
      return makeRequest<{
        originalUrl: string;
        title?: string;
        description?: string;
        domain: string;
        createdAt: string;
        qrCode?: string;
      }>(`/api/urls/preview/${shortCode}`, { skipAuth: true });
    },

    // POST /api/urls/bulk
    bulkCreate: async (
      data: BulkCreateUrlsRequest
    ): Promise<
      ApiResponse<{
        created: ShortUrl[];
        skipped: any[];
        errors: any[];
      }>
    > => {
      return makeRequest<{
        created: ShortUrl[];
        skipped: any[];
        errors: any[];
      }>("/api/urls/bulk", {
        method: "POST",
        body: data,
      });
    },

    // GET /api/urls/{id}
    getById: async (id: string): Promise<ApiResponse<ShortUrl>> => {
      return makeRequest<ShortUrl>(`/api/urls/${id}`);
    },

    // PUT /api/urls/{id}
    update: async (
      id: string,
      updates: UpdateUrlRequest
    ): Promise<ApiResponse<ShortUrl>> => {
      return makeRequest<ShortUrl>(`/api/urls/${id}`, {
        method: "PUT",
        body: updates,
      });
    },

    // DELETE /api/urls/{id}
    delete: async (
      id: string,
      hardDelete = false
    ): Promise<ApiResponse<void>> => {
      const endpoint = `/api/urls/${id}${hardDelete ? "?hardDelete=true" : ""}`;
      return makeRequest<void>(endpoint, { method: "DELETE" });
    },

    // POST /api/urls/{id}/qr
    generateQR: async (
      id: string,
      options?: {
        size?: 128 | 256 | 512 | 1024;
        primaryColor?: string;
        backgroundColor?: string;
        format?: "png" | "svg";
      }
    ): Promise<ApiResponse<{ qrCode: QRCode; url: ShortUrl }>> => {
      return makeRequest<{ qrCode: QRCode; url: ShortUrl }>(
        `/api/urls/${id}/qr`,
        {
          method: "POST",
          body: options || {},
        }
      );
    },

    // GET /api/urls/{id}/stats
    getStats: async (id: string): Promise<ApiResponse<UrlAnalytics>> => {
      return makeRequest<UrlAnalytics>(`/api/urls/${id}/stats`);
    },
  },

  /**
   * Analytics API methods
   * Provides comprehensive analytics data including real-time stats,
   * dashboard data, geographic analytics, and reporting features
   */
  analytics: {
    // GET /api/analytics/url/{id}
    getUrlAnalytics: async (
      id: string,
      params?: {
        startDate?: string;
        endDate?: string;
        excludeBots?: boolean;
        includeRealTime?: boolean;
      }
    ): Promise<ApiResponse<UrlAnalytics>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/url/${id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<UrlAnalytics>(endpoint);
    },

    // GET /api/analytics/dashboard
    getDashboard: async (params?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
    }): Promise<ApiResponse<DashboardData>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/dashboard${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<DashboardData>(endpoint);
    },

    // GET /api/analytics/platform - Admin only
    getPlatformAnalytics: async (params?: {
      startDate?: string;
      endDate?: string;
    }): Promise<ApiResponse<any>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/platform${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<any>(endpoint);
    },

    // GET /api/analytics/realtime
    getRealTime: async (
      minutes = 60
    ): Promise<
      ApiResponse<{
        timeWindow: string;
        statistics: {
          recentClicks: number;
          activeUrls: number;
          activeCountries: number;
          avgClicksPerMinute: number;
        };
        activeUrls: Array<{
          shortUrl: string;
          title?: string;
          clickCount: number;
          uniqueVisitors: number;
          lastClick: string;
        }>;
        liveVisitors: number;
        lastUpdated: string;
      }>
    > => {
      return makeRequest<any>(`/api/analytics/realtime?minutes=${minutes}`);
    },

    // GET /api/analytics/clicks
    getClickAnalytics: async (params?: {
      period?: "1d" | "7d" | "30d" | "90d" | "custom";
      urlId?: string;
      groupBy?: "hour" | "day" | "week" | "month";
      startDate?: string;
      endDate?: string;
    }): Promise<ApiResponse<any>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/clicks${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<any>(endpoint);
    },

    // GET /api/analytics/top
    getTopContent: async (params?: {
      metric?: "clicks" | "uniqueClicks" | "ctr";
      limit?: number;
      days?: number;
    }): Promise<ApiResponse<any>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/top${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<any>(endpoint);
    },

    // GET /api/analytics/geographic
    getGeographicAnalytics: async (params?: {
      urlId?: string;
      startDate?: string;
      endDate?: string;
      level?: "country" | "city";
    }): Promise<ApiResponse<any>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/geographic${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<any>(endpoint);
    },

    // POST /api/analytics/report
    generateReport: async (data: {
      type?: "url" | "user" | "platform";
      targetId?: string;
      startDate?: string;
      endDate?: string;
      format?: "json" | "csv";
      includeCharts?: boolean;
    }): Promise<ApiResponse<any>> => {
      return makeRequest<any>("/api/analytics/report", {
        method: "POST",
        body: data,
      });
    },

    // POST /api/analytics/summary
    getAnalyticsSummary: async (data: {
      urlIds: string[];
      startDate?: string;
      endDate?: string;
      metrics?: string[];
    }): Promise<ApiResponse<any>> => {
      return makeRequest<any>("/api/analytics/summary", {
        method: "POST",
        body: data,
      });
    },

    // GET /api/analytics/export
    exportAnalytics: async (params?: {
      type?: "user" | "platform";
      format?: "json" | "csv";
      startDate?: string;
      endDate?: string;
      includeDetailed?: boolean;
    }): Promise<ApiResponse<any>> => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }

      const endpoint = `/api/analytics/export${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      return makeRequest<any>(endpoint);
    },

    // POST /api/analytics/cleanup - Admin only
    cleanupAnalyticsData: async (data?: {
      retentionDays?: number;
      dryRun?: boolean;
    }): Promise<ApiResponse<any>> => {
      return makeRequest<any>("/api/analytics/cleanup", {
        method: "POST",
        body: data || {},
      });
    },
  },

  /**
   * Redirect handling methods
   * Manages URL redirects, previews, and validation
   * Note: Most methods trigger browser redirects rather than returning data
   */
  redirects: {
    // GET /preview/{shortCode}
    getPreview: async (shortCode: string): Promise<ApiResponse<any>> => {
      return makeRequest<any>(`/preview/${shortCode}`, { skipAuth: true });
    },

    /**
     * Triggers QR code redirect - navigates browser to QR endpoint
     */
    handleQRRedirect: async (shortCode: string): Promise<void> => {
      // Это редирект, не возвращает данные
      window.location.href = `${BASE_URL}/qr/${shortCode}`;
    },

    // POST /validate-batch
    validateBatch: async (shortCodes: string[]): Promise<ApiResponse<any>> => {
      return makeRequest<any>("/validate-batch", {
        method: "POST",
        body: { shortCodes },
        skipAuth: true,
      });
    },

    /**
     * Triggers tracked redirect - navigates browser with tracking enabled
     */
    handleTrackedRedirect: async (shortCode: string): Promise<void> => {
      window.location.href = `${BASE_URL}/${shortCode}/track`;
    },

    // GET /{shortCode}/stats
    getPublicStats: async (shortCode: string): Promise<ApiResponse<any>> => {
      return makeRequest<any>(`/${shortCode}/stats`, { skipAuth: true });
    },

    // POST /{shortCode}/unlock
    unlockPasswordProtected: async (
      shortCode: string,
      password: string
    ): Promise<ApiResponse<any>> => {
      return makeRequest<any>(`/${shortCode}/unlock`, {
        method: "POST",
        body: { password },
        skipAuth: true,
      });
    },

    /**
     * Triggers main redirect - navigates browser to shortened URL
     */
    handleRedirect: async (shortCode: string): Promise<void> => {
      window.location.href = `${BASE_URL}/${shortCode}`;
    },
  },

  /**
   * Utility helper methods
   * Provides common functionality like clipboard operations
   */
  utils: {
    /**
     * Copies text to clipboard with fallback support for older browsers
     *
     * @param text - Text to copy to clipboard
     * @returns Promise<boolean> - Success status of the operation
     */
    copyToClipboard: async (text: string): Promise<boolean> => {
      if (!navigator.clipboard) {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const result = document.execCommand("copy");
          document.body.removeChild(textArea);
          return result;
        } catch (err) {
          console.error("Fallback copy failed:", err);
          return false;
        }
      }

      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Copy to clipboard failed:", err);
        return false;
      }
    },
  },
};

export default api;
