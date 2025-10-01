"use client";

import { useState, FC } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../lib/api";
import type { CreateUrlRequest, ShortUrl } from "../../../types";
import { useAuth } from "@/context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { SuccessMessage } from "@/components/createUrl/SuccessMessage";
import { BulkCreateMode } from "@/components/createUrl/BulkCreateMode";
import { CreateUrlForm } from "@/components/createUrl/CreateUrlForm";
import { CreateUrlSidebar } from "@/components/createUrl/CreateUrlSidebar";

/**
 * Advanced URL creation component with single and bulk modes
 * Handles comprehensive URL creation with QR codes, metadata, and privacy settings
 */
const CreateNewUrlContent: FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();

  // Mode and loading states
  const [bulkMode, setBulkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success state for URL creation
  const [createdUrl, setCreatedUrl] = useState<ShortUrl | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Comprehensive form data with advanced settings
  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
    title: "",
    description: "",
    tagsString: "",
    generateQR: true,
    fetchMetadata: true,
    password: "",
    enablePassword: false,
    enableExpiration: false,
    customExpirationDate: "",
    qrSettings: {
      size: 256,
      primaryColor: "#000000",
      backgroundColor: "#FFFFFF",
      format: "png",
      margin: 4,
      errorCorrectionLevel: "M",
    },
    privacySettings: {
      isPublic: true,
      allowPreview: true,
      enableStats: true,
      enableTracking: true,
    },
  });

  // Bulk URLs input state
  const [bulkUrls, setBulkUrls] = useState<string>("");

  /**
   * Handles single URL creation with advanced features and demo restrictions
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "URL creation is not available in demo mode. Please use a full account to access all features.",
        "Create URL"
      );
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const createData: CreateUrlRequest = {
        originalUrl: formData.originalUrl,
        generateQR: formData.generateQR,
        fetchMetadata: formData.fetchMetadata,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description && { description: formData.description }),
        ...(formData.tagsString && {
          tags: formData.tagsString
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
        ...(formData.enableExpiration &&
          formData.customExpirationDate && {
            expiresIn: Math.ceil(
              (new Date(formData.customExpirationDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            ),
          }),
      };

      const response = await api.urls.create(createData);

      if (response.success && response.data) {
        setCreatedUrl(response.data.url);
        setShowSuccess(true);

        // Generate custom QR if needed
        if (formData.generateQR && formData.qrSettings) {
          try {
            await api.urls.generateQR(response.data.url._id, {
              size: formData.qrSettings.size as 128 | 256 | 512 | 1024,
              primaryColor: formData.qrSettings.primaryColor,
              backgroundColor: formData.qrSettings.backgroundColor,
              format: formData.qrSettings.format as "png" | "svg",
            });
          } catch (qrError) {
            console.error("QR generation failed:", qrError);
          }
        }
      } else {
        throw new Error(response.message || "Failed to create URL");
      }
    } catch (error) {
      console.error("Error creating URL:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Failed to create URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles bulk URL creation with validation and demo restrictions
   */
  const handleBulkSubmit = async () => {
    console.log(user?.role);
    const urls = bulkUrls
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && /^https?:\/\/.+/.test(line))
      .map((url) => ({ originalUrl: url }));

    if (urls.length === 0) {
      setErrors({ bulk: "Please enter valid URLs" });
      return;
    }

    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "URL creation is not available in demo mode. Please use a full account to access all features.",
        "Create URLs"
      );
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.urls.bulkCreate({
        urls,
        generateQR: formData.generateQR ?? false,
        fetchMetadata: formData.fetchMetadata ?? false,
        skipDuplicates: true,
      });

      if (response.success) {
        setShowSuccess(true);
        setBulkUrls("");
      }
    } catch (error) {
      setErrors({ bulk: "Failed to create URLs" });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets form to initial state and clears all data
   */
  const resetForm = () => {
    setFormData({
      originalUrl: "",
      customAlias: "",
      title: "",
      description: "",
      tagsString: "",
      generateQR: true,
      fetchMetadata: true,
      password: "",
      enablePassword: false,
      enableExpiration: false,
      customExpirationDate: "",
      qrSettings: {
        size: 256,
        primaryColor: "#000000",
        backgroundColor: "#FFFFFF",
        format: "png",
        margin: 4,
        errorCorrectionLevel: "M",
      },
      privacySettings: {
        isPublic: true,
        allowPreview: true,
        enableStats: true,
        enableTracking: true,
      },
    });
    setErrors({});
    setCreatedUrl(null);
    setShowSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Create New URL"
        description="Create and customize your shortened URLs with advanced settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="btn-ghost p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBulkMode(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !bulkMode
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Single URL
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBulkMode(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  bulkMode
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bulk Create
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className="btn-ghost p-2 rounded-lg"
            title="Reset form"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && createdUrl && (
            <SuccessMessage
              createdUrl={createdUrl}
              onDismiss={() => setShowSuccess(false)}
              theme={theme}
            />
          )}
        </AnimatePresence>

        {/* Error Messages */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-700 dark:text-red-400">{errors.general}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {bulkMode ? (
          <BulkCreateMode
            bulkUrls={bulkUrls}
            setBulkUrls={setBulkUrls}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            errors={errors}
            onSubmit={handleBulkSubmit}
            theme={theme}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CreateUrlForm
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                errors={errors}
                setErrors={setErrors}
                onSubmit={handleSubmit}
                theme={theme}
              />
            </div>

            <div>
              <CreateUrlSidebar theme={theme} />
            </div>
          </div>
        )}
      </DashboardLayout>
    </motion.div>
  );
};

export default CreateNewUrlContent;
