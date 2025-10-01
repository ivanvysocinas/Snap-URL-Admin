"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PrivacySectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  theme: string;
}

/**
 * Privacy section wrapper component
 * Provides consistent styling and animation for privacy policy sections
 * with icon headers and theme-aware prose styling
 */
export const PrivacySection: FC<PrivacySectionProps> = ({
  id,
  title,
  icon: Icon,
  children,
  theme,
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h2
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
      </div>

      <div
        className={`prose prose-sm max-w-none ${
          theme === "dark"
            ? "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white"
            : "prose-gray"
        }`}
      >
        {children}
      </div>
    </motion.section>
  );
};
