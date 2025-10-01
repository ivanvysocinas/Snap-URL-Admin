/**
 * Standard API response wrapper structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    [key: string]: any;
  };
  pagination?: PaginationMeta;
  error?: string;
}

/**
 * Export-specific API response structure
 */
export interface ExportApiResponse {
  success: boolean;
  message: string;
  data?: any;
  meta?: {
    [key: string]: any;
  };
  error?: string;
}

/**
 * Pagination metadata for API responses
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalUrls: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

/**
 * Sort order options for API queries
 */
export type SortOrder = "asc" | "desc";