"use client";

import { useState, useRef, FC } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import api from "../../../lib/api";
import type {
  ApiResponse,
  BulkCreateUrlsRequest,
  CreateUrlRequest,
  ShortUrl,
} from "../../../types";
import { ImportResults } from "@/components/bulk/ImportResults";
import { ImportContent } from "@/components/bulk/ImportContent";
import { ImportMethodSelector } from "@/components/bulk/ImportMethodSelector";
import { ImportSettings } from "@/components/bulk/ImportSettings";
import { ImportSidebar } from "@/components/bulk/ImportSidebar";
import { useAuth } from "@/context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";

/**
 * Parsed URL data from file or text input
 */
interface ParsedUrl {
  originalUrl: string;
  title?: string;
  description?: string;
}

/**
 * Import configuration settings
 */
interface ImportSettings {
  generateQR: boolean;
  fetchMetadata: boolean;
  skipDuplicates: boolean;
  customDomain: string;
}

/**
 * Import operation results
 */
interface ImportResults {
  created: ShortUrl[];
  skipped: any[];
  errors: any[];
  summary: {
    total: number;
    created: number;
    skipped: number;
    errors: number;
  };
}

/**
 * Bulk create API response structure
 */
interface BulkCreateResponse {
  created?: ShortUrl[];
  skipped?: any[];
  errors?: any[];
  successful?: ShortUrl[];
  failed?: any[];
  summary?: {
    total: number;
    created: number;
    skipped: number;
    errors: number;
  };
}

/**
 * Comprehensive bulk import component with multiple input methods
 * Supports file uploads (CSV), text input, and bookmark imports with advanced parsing
 */
const BulkImportContent: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import method and state management
  const [importMethod, setImportMethod] = useState<
    "file" | "text" | "bookmarks"
  >("file");
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  // Import results and errors
  const [results, setResults] = useState<{
    created: ShortUrl[];
    skipped: any[];
    errors: any[];
    summary: {
      total: number;
      created: number;
      skipped: number;
      errors: number;
    };
  } | null>(null);

  // Import settings configuration
  const [settings, setSettings] = useState({
    generateQR: false,
    fetchMetadata: true,
    skipDuplicates: true,
    customDomain: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Parses CSV content with intelligent field detection
   * Extracts URLs, titles, and descriptions while filtering out IDs and dates
   */
  const parseCSV = (content: string): ParsedUrl[] => {
    const lines = content.split("\n").filter((line) => line.trim());
    const results: ParsedUrl[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const urlMatch = line.match(/"(https?:\/\/[^"]+)"/);
      if (!urlMatch) continue;

      const originalUrl = urlMatch[1];
      if (!originalUrl) continue;

      const segments = line.split('","');
      let title: string | null = null;
      let description: string | null = null;

      // Extract meaningful text fields, skipping IDs, dates, and numbers
      for (const segment of segments) {
        const cleaned = segment.replace(/^"|"$/g, "").trim();

        if (
          cleaned.match(/^[a-f0-9]{24}/) ||
          cleaned.match(/^\d{4}-\d{2}-\d{2}/) ||
          cleaned.match(/^\d+$/) ||
          cleaned.length < 5
        ) {
          continue;
        }

        if (!title && cleaned.length >= 5 && cleaned.length <= 100) {
          title = cleaned;
          continue;
        }

        if (
          title &&
          !description &&
          cleaned.length >= 10 &&
          cleaned.length <= 500
        ) {
          description = cleaned;
          break;
        }
      }

      let finalTitle: string;
      try {
        finalTitle = title || `Imported ${new URL(originalUrl).hostname}`;
      } catch {
        finalTitle = "Imported URL";
      }

      results.push({
        originalUrl,
        title: finalTitle,
        ...(description && { description }),
      });
    }

    return results;
  };

  /**
   * Parses uploaded files with format detection
   * Supports CSV with advanced parsing and plain text formats
   */
  const parseFile = async (file: File): Promise<ParsedUrl[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;

        if (file.name.endsWith(".csv")) {
          const parsedUrls = parseCSV(content);
          resolve(parsedUrls);
        } else {
          // Parse as plain text - one URL per line
          const urls = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && /^https?:\/\/.+/.test(line))
            .map((url) => ({ originalUrl: url }));
          resolve(urls);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  /**
   * Parses text input for URL extraction
   * Filters valid HTTP/HTTPS URLs from multi-line text
   */
  const parseTextInput = (): ParsedUrl[] => {
    return textInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && /^https?:\/\/.+/.test(line))
      .map((url) => ({ originalUrl: url }));
  };

  /**
   * Main import handler with comprehensive error handling
   * Processes different input methods and sends to bulk create API
   */
  const handleImport = async (): Promise<void> => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "URL import is not available in demo mode. Please use a full account to access all features.",
        "Import URLs"
      );
      return;
    }

    setLoading(true);
    setProcessing(true);
    setErrors({});

    try {
      let parsedUrls: ParsedUrl[] = [];

      // Parse input based on method
      if (importMethod === "file" && file) {
        parsedUrls = await parseFile(file);
      } else if (importMethod === "text") {
        parsedUrls = parseTextInput();
      } else if (importMethod === "bookmarks") {
        parsedUrls = parseTextInput();
      }

      // Validate parsed URLs
      if (parsedUrls.length === 0) {
        setErrors({ general: "No valid URLs found to import" });
        return;
      }

      if (parsedUrls.length > 20) {
        setErrors({ general: "Too many URLs. Maximum 20 URLs per import." });
        return;
      }

      // Prepare URLs for bulk creation
      const urlsToCreate: CreateUrlRequest[] = parsedUrls.map((urlData) => {
        const createRequest: CreateUrlRequest = {
          originalUrl: urlData.originalUrl,
        };

        // Add title if available, otherwise generate from domain
        if (urlData.title && urlData.title.trim()) {
          createRequest.title = urlData.title.trim();
        } else {
          try {
            createRequest.title = `Imported ${new URL(urlData.originalUrl).hostname}`;
          } catch {
            createRequest.title = "Imported URL";
          }
        }

        // Add description if available
        if (urlData.description && urlData.description.trim()) {
          createRequest.description = urlData.description.trim();
        }

        return createRequest;
      });

      // Call bulk create API
      const bulkRequest: BulkCreateUrlsRequest = {
        urls: urlsToCreate,
        generateQR: settings.generateQR,
        fetchMetadata: settings.fetchMetadata,
        skipDuplicates: settings.skipDuplicates,
      };

      const response: ApiResponse<BulkCreateResponse> =
        await api.urls.bulkCreate(bulkRequest);

      if (response.success && response.data) {
        // Handle both old and new response formats
        const responseData = response.data;

        const created = responseData.created || responseData.successful || [];
        const skipped = responseData.skipped || [];
        const errors = responseData.errors || responseData.failed || [];

        // Calculate summary if not provided
        const summary = responseData.summary || {
          total: created.length + skipped.length + errors.length,
          created: created.length,
          skipped: skipped.length,
          errors: errors.length,
        };

        setResults({
          created,
          skipped,
          errors,
          summary,
        });
      } else {
        throw new Error(response.message || "Failed to import URLs");
      }
    } catch (error) {
      console.error("Import error:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Failed to import URLs",
      });
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  /**
   * Resets all import state to initial values
   */
  const resetImport = () => {
    setFile(null);
    setTextInput("");
    setResults(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Downloads a sample CSV file for user reference
   */
  const downloadSample = () => {
    const sampleContent = `_id,originalUrl,shortCode,customAlias,title,description,userId,isActive,expiresAt,clickCount,uniqueClicks,lastClickedAt,qrCode,metadata,tags,geoRestrictions,createdAt,variants,updatedAt,__v
68c4945eb34f7576651ea394,"https://nodejs.org/en/docs/","node-docs","node-docs","Node.js Documentation","Official Node.js documentation and API reference","68c4945ab34f7576651ea376",true,"",462,308,"2025-09-18T11:15:01.251Z",{"dataUrl":null,"size":256,"generatedAt":"2025-09-18T20:31:37.852Z"},{"domain":"nodejs.org","pageTitle":"Node.js Documentation","pageDescription":"Official Node.js documentation and API reference","httpStatus":200,"lastChecked":"2025-09-12T21:45:02.012Z"},[],{"allowedCountries":[],"blockedCountries":[]},"2025-09-12T09:11:16.967Z",[],"2025-09-18T20:31:37.852Z",""
68c4945eb34f7576651ea3a0,"https://www.producthunt.com/","product-hunt","product-hunt","Product Hunt","Discover new products and startups","68c4945ab34f7576651ea376",true,"",495,352,"2025-09-13T11:40:31.805Z",{"dataUrl":null,"size":256,"generatedAt":null},{"domain":"www.producthunt.com","pageTitle":"Product Hunt","pageDescription":"Discover new products and startups","httpStatus":200,"lastChecked":"2025-09-12T21:45:02.476Z"},[],{"allowedCountries":[],"blockedCountries":[]},"2025-09-12T04:09:49.877Z",[],"2025-09-12T21:45:09.172Z",""
68c4945db34f7576651ea38e,"https://developer.mozilla.org/en-US/docs/Web/JavaScript","mdn-js","mdn-js","MDN JavaScript Docs","Complete JavaScript documentation and guides","68c4945ab34f7576651ea376",true,"",160,104,"2025-09-13T10:43:51.813Z",{"dataUrl":null,"size":256,"generatedAt":null},{"domain":"developer.mozilla.org","pageTitle":"MDN JavaScript Docs","pageDescription":"Complete JavaScript documentation and guides","httpStatus":200,"lastChecked":"2025-09-12T21:45:01.791Z"},[],{"allowedCountries":[],"blockedCountries":[]},"2025-09-11T06:33:52.771Z",[],"2025-09-12T21:45:04.805Z",""
68c4945eb34f7576651ea397,"https://tailwindcss.com/docs","tailwind","tailwind","Tailwind CSS Docs","Utility-first CSS framework documentation","68c4945ab34f7576651ea376",true,"",466,342,"2025-09-13T17:11:28.682Z",{"dataUrl":null,"size":256,"generatedAt":null},{"domain":"tailwindcss.com","pageTitle":"Tailwind CSS Docs","pageDescription":"Utility-first CSS framework documentation","httpStatus":200,"lastChecked":"2025-09-12T21:45:02.125Z"},[],{"allowedCountries":[],"blockedCountries":[]},"2025-09-09T02:30:31.094Z",[],"2025-09-12T21:45:06.913Z",""
68c4945eb34f7576651ea3a3,"https://news.ycombinator.com/","hacker-news","hacker-news","Hacker News","Technology and startup news aggregator","68c4945ab34f7576651ea376",true,"",125,84,"2025-09-13T16:30:51.188Z",{"dataUrl":null,"size":256,"generatedAt":null},{"domain":"news.ycombinator.com","pageTitle":"Hacker News","pageDescription":"Technology and startup news aggregator","httpStatus":200,"lastChecked":"2025-09-12T21:45:02.583Z"},[],{"allowedCountries":[],"blockedCountries":[]},"2025-09-08T17:51:39.873Z",[],"2025-09-12T21:45:09.620Z",""
`;

    const blob = new Blob([sampleContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_urls.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Bulk Import"
        description="Import multiple URLs at once from files, text, or browser bookmarks"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="btn-ghost p-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadSample}
              className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Sample</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetImport}
              className="btn-ghost px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Error Messages */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 dark:text-red-400">
                  {errors.general}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && <ImportResults results={results} />}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Methods and Content */}
          <div className="lg:col-span-2 space-y-6">
            <ImportMethodSelector
              importMethod={importMethod}
              setImportMethod={setImportMethod}
            />

            <ImportContent
              importMethod={importMethod}
              file={file}
              setFile={setFile}
              textInput={textInput}
              setTextInput={setTextInput}
              fileInputRef={fileInputRef}
              errors={errors}
              setErrors={setErrors}
              loading={loading}
              parseTextInput={parseTextInput}
            />

            <ImportSettings
              settings={settings}
              setSettings={setSettings}
              loading={loading}
              processing={processing}
              file={file}
              textInput={textInput}
              onImport={handleImport}
            />
          </div>

          {/* Sidebar */}
          <ImportSidebar />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default BulkImportContent;
