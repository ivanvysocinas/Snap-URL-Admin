/**
 * QR Code configuration tab with preview generation and download functionality
 * Features temporary URL creation for preview, comprehensive QR customization options (mostly coming soon),
 * and direct download capability with proper file naming
 */
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, RefreshCw, Loader2, Download } from "lucide-react";
import api from "../../lib/api";

interface QRTabProps {
  formData: any;
  setFormData: (data: any) => void;
  theme: string;
  onComingSoon: (feature: string) => void;
}

export const QRTab: FC<QRTabProps> = ({
  formData,
  setFormData,
  onComingSoon,
}) => {
  const [previewQR, setPreviewQR] = useState<string | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  /**
   * Generate QR code preview by creating temporary URL
   * Creates a temporary shortened URL, generates QR code, then cleans up
   */
  const generateQRPreview = async () => {
    if (!formData.originalUrl) return;

    setGeneratingQR(true);
    try {
      const tempUrlData = {
        originalUrl: formData.originalUrl,
        generateQR: false,
        fetchMetadata: false,
        title: "Preview URL",
      };

      const createResponse = await api.urls.create(tempUrlData);

      if (createResponse.success && createResponse.data) {
        const qrResponse = await api.urls.generateQR(
          createResponse.data.url._id,
          {
            size: formData.qrSettings.size as 128 | 256 | 512 | 1024,
            primaryColor: formData.qrSettings.primaryColor,
            backgroundColor: formData.qrSettings.backgroundColor,
            format: formData.qrSettings.format as "png" | "svg",
          }
        );

        if (qrResponse.success && qrResponse.data?.qrCode?.dataURL) {
          setPreviewQR(qrResponse.data.qrCode.dataURL);
        }

        // Clean up temporary URL
        await api.urls.delete(createResponse.data.url._id, true);
      }
    } catch (error) {
      console.error("Failed to generate QR preview:", error);
    } finally {
      setGeneratingQR(false);
    }
  };

  /**
   * Download QR code with proper filename generation
   * Creates descriptive filename based on domain and timestamp
   */
  const downloadQRCode = async () => {
    if (!previewQR) return;

    try {
      const link = document.createElement("a");
      link.href = previewQR;

      const timestamp = new Date().toISOString().slice(0, 10);
      const domain = formData.originalUrl
        ? new URL(formData.originalUrl).hostname
        : "url";
      const filename = `qr-${domain}-${timestamp}.${formData.qrSettings.format}`;

      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <motion.div
      key="qr"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">
          QR Code Settings
        </h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.generateQR}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                generateQR: e.target.checked,
              }))
            }
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm dark:text-gray-300">
            Generate QR Code
          </span>
        </label>
      </div>

      {formData.generateQR && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QR Size Settings - Coming Soon */}
          <div onClick={() => onComingSoon("Custom QR Size")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Size
            </label>
            <select
              value={formData.qrSettings.size}
              className="input-base cursor-pointer opacity-50"
              disabled
            >
              <option value={256}>256x256 (Coming Soon)</option>
            </select>
          </div>

          {/* QR Format Settings - Coming Soon */}
          <div onClick={() => onComingSoon("Custom QR Format")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Format
            </label>
            <select
              value={formData.qrSettings.format}
              className="input-base cursor-pointer opacity-50"
              disabled
            >
              <option value="png">PNG (Coming Soon)</option>
            </select>
          </div>

          {/* Primary Color Customization - Coming Soon */}
          <div onClick={() => onComingSoon("Custom QR Colors")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Foreground Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={formData.qrSettings.primaryColor}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer opacity-50"
                disabled
              />
              <input
                type="text"
                value="#000000 (Coming Soon)"
                className="input-base flex-1 cursor-pointer opacity-50"
                disabled
              />
            </div>
          </div>

          {/* Background Color Customization - Coming Soon */}
          <div onClick={() => onComingSoon("Custom QR Colors")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Background Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={formData.qrSettings.backgroundColor}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer opacity-50"
                disabled
              />
              <input
                type="text"
                value="#FFFFFF (Coming Soon)"
                className="input-base flex-1 cursor-pointer opacity-50"
                disabled
              />
            </div>
          </div>

          {/* Error Correction Level - Coming Soon */}
          <div onClick={() => onComingSoon("QR Error Correction")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Error Correction
            </label>
            <select
              value={formData.qrSettings.errorCorrectionLevel}
              className="input-base cursor-pointer opacity-50"
              disabled
            >
              <option value="M">Medium (Coming Soon)</option>
            </select>
          </div>

          {/* QR Margin Settings - Coming Soon */}
          <div onClick={() => onComingSoon("QR Margin Settings")}>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 cursor-pointer">
              Margin: {formData.qrSettings.margin}px (Coming Soon)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={formData.qrSettings.margin}
              className="w-full cursor-pointer opacity-50"
              disabled
            />
          </div>
        </div>
      )}

      {/* QR Code Preview Section */}
      {formData.generateQR && (
        <div className="border-t pt-4 border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium dark:text-white">Preview</h4>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateQRPreview}
              disabled={generatingQR || !formData.originalUrl}
              className="btn-secondary px-3 py-1 text-sm rounded-md flex items-center space-x-1"
            >
              {generatingQR ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Generate Preview</span>
            </motion.button>
          </div>

          <div className="flex justify-center">
            {previewQR ? (
              <div className="relative">
                <img
                  src={previewQR}
                  alt="QR Code Preview"
                  className="border border-gray-200 dark:border-gray-600 rounded"
                  style={{
                    width: Math.min(formData.qrSettings.size, 200),
                    height: Math.min(formData.qrSettings.size, 200),
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={downloadQRCode}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded shadow-md"
                  title="Download QR Code"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center"
                style={{ width: 200, height: 200 }}
              >
                <div className="text-center">
                  <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    QR code preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
