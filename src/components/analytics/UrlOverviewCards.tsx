/**
 * Overview cards component displaying key URL performance metrics
 * Features value formatting for large numbers and time units
 * Provides responsive grid layout and change indicators with color coding
 */
"use client";

import { motion } from "framer-motion";
import {
  MousePointer,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { FC } from "react";

interface UrlOverviewCardsProps {
  overview?:
    | {
        totalClicks: number;
        uniqueClicks: number;
        uniqueVisitors: number;
        averageLoadTime: number;
        conversionRate: number;
        engagementScore: number;
      }
    | undefined;
  performance?:
    | {
        clicksPerDay: number;
        conversionRate: number;
        engagementScore: number;
        peakHour: number;
        trendDirection: "up" | "down" | "stable";
        growthRate: number;
      }
    | undefined;
  theme: string;
  loading: boolean;
  uniqueVisitors: number;
}

export const UrlOverviewCards: FC<UrlOverviewCardsProps> = ({
  overview,
  performance,
  theme,
  loading,
  uniqueVisitors,
}) => {
  const cards = [
    {
      title: "Total Clicks",
      value: overview?.totalClicks || 0,
      change: performance?.growthRate || 0,
      icon: MousePointer,
      color: "blue",
      suffix: "",
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors || 0,
      change: 0,
      icon: Users,
      color: "green",
      suffix: "",
    },
    {
      title: "Unique Clicks",
      value: overview?.uniqueClicks || 0,
      change: 0,
      icon: Eye,
      color: "purple",
      suffix: "",
    },
    {
      title: "Avg Load Time",
      value: overview?.averageLoadTime || 0,
      change: 0,
      icon: Clock,
      color: "orange",
      suffix: "ms",
    },
    {
      title: "Engagement Score",
      value: overview?.engagementScore || 0,
      change: 0,
      icon: TrendingUp,
      color: "indigo",
      suffix: "%",
    },
    {
      title: "Conversion Rate",
      value: overview?.conversionRate || 0,
      change: 0,
      icon: Target,
      color: "pink",
      suffix: "%",
    },
  ];

  /**
   * Get color classes for card icons based on predefined color scheme
   */
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  /**
   * Format numeric values with appropriate units and abbreviations
   * Handles milliseconds to seconds conversion and large number abbreviations
   */
  const formatValue = (value: number, suffix: string): string => {
    if (suffix === "ms" && value > 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`card p-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } ${loading ? "animate-pulse" : ""}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${getColorClasses(card.color)}`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>

            {/* Change indicator with color coding */}
            {card.change !== 0 && (
              <div
                className={`text-xs ${
                  card.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.change >= 0 ? "+" : ""}
                {card.change.toFixed(1)}%
              </div>
            )}
          </div>

          <div>
            <p
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {loading
                ? "..."
                : `${formatValue(card.value, card.suffix)}${card.suffix}`}
            </p>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {card.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
