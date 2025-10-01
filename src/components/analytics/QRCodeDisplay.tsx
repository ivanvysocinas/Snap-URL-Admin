/**
 * QR Code generation and management component
 * Features dynamic size selection, download functionality, and clipboard copying
 * Handles API calls for QR generation with error handling and loading states
 * Provides animated UI feedback for user interactions
 */
"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Copy, RefreshCw } from "lucide-react";
import api from "../../lib/api";

interface QRCodeDisplayProps {
  url?:
    | {
        id: string;
        shortUrl: string;
        title?: string;
        qrCode?: string;
      }
    | undefined;
  theme: string;
}

export const QRCodeDisplay: FC<QRCodeDisplayProps> = ({ url, theme }) => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(url?.qrCode || null);
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState(256);

  /**
   * Generate or regenerate QR code with specified size
   * Handles API communication and error states
   */
  const handleGenerateQR = async (size: number = selectedSize) => {
    if (!url?.id) return;

    try {
      setLoading(true);
      const response = await api.urls.generateQR(url.id, {
        size: size as 128 | 256 | 512 | 1024,
        format: "png",
      });

      if (response.success && response.data?.qrCode) {
        setQrCode(response.data.qrCode.dataURL);
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download QR code as PNG file with sanitized filename
   */
  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.download = `qr-code-${url?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || url?.id || "url"}.png`;
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Copy QR code data URL to clipboard with user feedback
   */
  const handleCopy = async () => {
    if (!qrCode) return;

    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy QR code:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header with regenerate option */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-blue-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            QR Code
          </h3>
        </div>

        {qrCode && !loading && (
          <button
            onClick={() => handleGenerateQR()}
            className={`p-2 rounded-lg transition-colors hover:scale-105 ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
            }`}
            title="Regenerate QR code"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* QR Code Display Area */}
        <div className="text-center">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <QrCode className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
              </div>
            </div>
          ) : qrCode ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* QR Code Image with white background */}
              <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className={`mx-auto transition-all duration-300 ${
                    selectedSize === 128
                      ? "w-32 h-32"
                      : selectedSize === 256
                        ? "w-40 h-40"
                        : selectedSize === 512
                          ? "w-48 h-48"
                          : "w-40 h-40"
                  }`}
                />
              </div>

              {/* URL Information */}
              <div className="space-y-2">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {url?.title || "URL QR Code"}
                </p>
                <p
                  className={`text-xs font-mono ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {url?.shortUrl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="btn-secondary flex items-center px-4 py-2 text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`btn-secondary flex items-center px-4 py-2 text-sm transition-colors ${
                    copied
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : ""
                  }`}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div
                className={`w-40 h-40 mx-auto rounded-xl border-2 border-dashed flex items-center justify-center ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700/30"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <QrCode className="w-12 h-12 text-gray-400" />
              </div>

              <div className="space-y-3">
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  No QR code available
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenerateQR()}
                  disabled={loading}
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Generate QR Code
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Size Selection Options */}
        <div className="space-y-4">
          <div>
            <p
              className={`text-sm font-medium mb-3 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Size Options
            </p>
            <div className="flex justify-center space-x-2">
              {[128, 256, 512].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    if (qrCode) handleGenerateQR(size);
                  }}
                  disabled={loading}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    selectedSize === size
                      ? "bg-blue-600 text-white shadow-sm"
                      : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
