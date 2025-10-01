"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  available: boolean;
  theme: string;
}

/**
 * Contact card component with availability status and action button
 * Features hover animations and disabled state handling
 */
export const ContactCard: FC<ContactCardProps> = ({
  icon: Icon,
  title,
  description,
  action,
  available,
  theme,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`card card-hover p-6 cursor-pointer ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon container */}
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content section */}
        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mb-3 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {description}
          </p>

          {/* Action section with availability indicator */}
          <div className="flex items-center justify-between">
            <button
              className={`text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors ${
                !available ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!available}
            >
              {action}
            </button>

            {available && (
              <span className="flex items-center text-xs text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Available
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
