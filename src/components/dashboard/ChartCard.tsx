"use client";

import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  theme: string;
  action?: ReactNode;
}

/**
 * Chart card wrapper component for analytics visualizations
 * Provides consistent styling and animation for chart containers
 */
export const ChartCard: FC<ChartCardProps> = ({
  title,
  children,
  theme,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 pb-12 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Card header with title and optional actions */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>

      {/* Chart content area */}
      <div>{children}</div>
    </motion.div>
  );
};
