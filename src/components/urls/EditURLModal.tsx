"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import { X, Check, Loader2, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import type { ShortUrl, UpdateUrlRequest } from "../../types";

interface EditURLModalProps {
  url: ShortUrl;
  onClose: () => void;
  onSuccess: (updates: UpdateUrlRequest) => void;
  theme: string;
}

/**
 * Enhanced Edit URL Modal Component with improved validation and UX
 */
export const EditURLModal: FC<EditURLModalProps> = ({
  url,
  onClose,
  onSuccess,
  theme,
}) => {
  const [formData, setFormData] = useState({
    title: url.title || "",
    description: url.description || "",
    isActive: url.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotifications();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const updates: UpdateUrlRequest = {};

      // Only include fields that have changed
      if (formData.title !== (url.title || "")) {
        updates.title = formData.title;
      }
      if (formData.description !== (url.description || "")) {
        updates.description = formData.description;
      }
      if (formData.isActive !== url.isActive) {
        updates.isActive = formData.isActive;
      }

      // Validate
      if (formData.title && formData.title.length > 100) {
        setErrors({ title: "Title must be less than 100 characters" });
        return;
      }
      if (formData.description && formData.description.length > 500) {
        setErrors({
          description: "Description must be less than 500 characters",
        });
        return;
      }

      onSuccess(updates);
      addNotification(
        "URL updated Successfully!",
        `Short URL has been updated: ${url.shortUrl}`
      );
    } catch (err) {
      setErrors({ general: "Failed to update URL" });
    } finally {
      setLoading(false);
    }
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
        className={`max-w-lg w-full rounded-lg shadow-xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Edit URL
          </h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`input-base ${errors.title ? "border-red-500" : ""}`}
              placeholder="Enter URL title"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={`input-base ${errors.description ? "border-red-500" : ""}`}
              rows={3}
              placeholder="Enter description"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label
              htmlFor="isActive"
              className={`ml-2 text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              URL is active
            </label>
          </motion.div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.general}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-end space-x-3 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};