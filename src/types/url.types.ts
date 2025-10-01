/**
 * Core shortened URL entity with all metadata
 */
export interface ShortUrl {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  description?: string;
  userId?: string;
  isActive: boolean;
  clickCount: number;
  uniqueClicks: number;
  lastClickedAt?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  qrCode?: QRCode;
  metadata?: UrlMetadata;
  tags?: string[];
}

/**
 * Automatically fetched metadata from target URL
 */
export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  domain: string;
  keywords?: string[];
}

/**
 * Request data for creating new shortened URL
 */
export interface CreateUrlRequest {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  description?: string;
  generateQR?: boolean;
  fetchMetadata?: boolean;
  expiresIn?: number;
  tags?: string[];
}

/**
 * Request data for updating existing URL
 */
export interface UpdateUrlRequest {
  title?: string;
  description?: string;
  isActive?: boolean;
  expiresIn?: number;
  generateQR?: boolean;
  fetchMetadata?: boolean;
  tags?: string[];
}

/**
 * Request data for bulk URL creation
 */
export interface BulkCreateUrlsRequest {
  urls: CreateUrlRequest[];
  generateQR?: boolean;
  fetchMetadata?: boolean;
  skipDuplicates?: boolean;
}

/**
 * QR code data and configuration
 */
export interface QRCode {
  data: object;
  dataURL: string;
  errorCorrectionLevel: string;
  format: string;
  generatedAt: string;
  margin: number;
  size: number;
}

/**
 * Export format types for URL data
 */
export type ExportFormat = "json" | "csv" | "xlsx" | "pdf";

/**
 * QR code output format options
 */
export type QRCodeFormat = "png" | "svg" | "jpg" | "pdf";
