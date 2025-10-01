"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Users } from "lucide-react";

interface PrivacyHighlightsProps {
  theme: string;
}

/**
 * Privacy highlights component
 * Displays key privacy commitments in an attractive grid layout
 * with animated cards and color-coded icons
 */
export const PrivacyHighlights: FC<PrivacyHighlightsProps> = ({ theme }) => {
  const highlights = [
    {
      icon: Shield,
      title: "Data Minimization",
      description: "We only collect data necessary to provide our service",
      color: "blue",
    },
    {
      icon: Lock,
      title: "Strong Security",
      description: "Industry-standard encryption and security measures",
      color: "green",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "Clear information about how we use your data",
      color: "purple",
    },
    {
      icon: Users,
      title: "No Data Sales",
      description: "We never sell your personal information to third parties",
      color: "orange",
    },
  ];

  /**
   * Get color classes for highlight card icons
   */
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
      green: "bg-green-100 dark:bg-green-900/20 text-green-600",
      purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
      orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="text-center mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Privacy at a Glance
        </h2>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Our commitment to protecting your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border text-center ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div
              className={`inline-flex p-3 rounded-lg mb-3 ${getColorClasses(highlight.color)}`}
            >
              <highlight.icon className="w-6 h-6" />
            </div>

            <h3
              className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {highlight.title}
            </h3>

            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {highlight.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
