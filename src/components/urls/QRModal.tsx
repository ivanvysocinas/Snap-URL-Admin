"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";

interface QRModalProps {
  qrCode: {
    data: object;
    dataURL: string;
    errorCorrectionLevel: string;
    format: string;
    generatedAt: string;
    margin: number;
    size: number;
  };
  shortUrl: string;
  title?: string;
  onClose: () => void;
  theme: string;
}

/**
 * Enhanced QR Code Modal Component with better animations
 */
export const QRModal: FC<QRModalProps> = ({
  qrCode,
  shortUrl,
  title,
  onClose,
  theme,
}) => {
  const [downloading, setDownloading] = useState(false);

  const downloadQR = async () => {
    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = qrCode.dataURL;
      link.download = `qr-${shortUrl.replace(/[^a-zA-Z0-9]/g, "")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`max-w-md w-full rounded-lg shadow-xl p-6 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            QR Code
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-1 rounded-lg ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg inline-block mb-4"
          >
            {qrCode.dataURL ? (
              <img src={qrCode.dataURL} alt="QR Code" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            )}
          </motion.div>

          <p
            className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {title || "Scan to visit"}
          </p>

          <p className="font-mono text-sm text-blue-500 mb-4">{shortUrl}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadQR}
            disabled={downloading}
            className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloading ? "Downloading..." : "Download QR Code"}</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};