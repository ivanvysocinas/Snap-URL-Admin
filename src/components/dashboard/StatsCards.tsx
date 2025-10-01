"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  theme: string;
  suffix?: string;
  prefix?: string;
}

/**
 * Statistics card component with trend indicator and icon
 * Displays key metrics with animated counters and change indicators
 */
export const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  theme,
  suffix = "",
  prefix = "",
}) => {
  const isPositive = change ? change >= 0 : false;

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  /**
   * Format numerical values with appropriate suffixes
   */
  const formatValue = (num: number): string => {
    if (suffix === "%") {
      return num.toFixed(1);
    }

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }

    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }

    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card card-hover p-6 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Icon container with colored background */}
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Trend indicator - only shown if change value is provided */}
        {change !== undefined && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Value and title section */}
      <div>
        <h3
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } mb-1`}
        >
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            formatValue={formatValue}
          />
        </h3>

        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {title}
        </p>
      </div>
    </motion.div>
  );
};
