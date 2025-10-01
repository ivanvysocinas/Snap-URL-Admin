"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Link, QrCode, BarChart3, Settings, Zap, Shield } from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoonModal";

interface QuickGuidesProps {
  theme: string;
}

interface Guide {
  icon: typeof Link;
  title: string;
  description: string;
  time: string;
  category: string;
}

/**
 * Quick guides component with clickable guide cards
 * Features staggered animations and coming soon modal integration
 */
export const QuickGuides: FC<QuickGuidesProps> = ({ theme }) => {
  const guides: Guide[] = [
    {
      icon: Link,
      title: "Creating Your First Short URL",
      description:
        "Learn how to create and customize your first shortened link",
      time: "2 min read",
      category: "Getting Started",
    },
    {
      icon: QrCode,
      title: "Generating QR Codes",
      description: "Create and customize QR codes for your shortened URLs",
      time: "3 min read",
      category: "Features",
    },
    {
      icon: BarChart3,
      title: "Understanding Analytics",
      description: "Track clicks, locations, and performance metrics",
      time: "5 min read",
      category: "Analytics",
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile, preferences, and API keys",
      time: "4 min read",
      category: "Account",
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Integrate SnapURL into your applications",
      time: "10 min read",
      category: "Advanced",
    },
    {
      icon: Shield,
      title: "Security Best Practices",
      description: "Keep your account and links secure",
      time: "6 min read",
      category: "Security",
    },
  ];

  const { showComingSoon } = useComingSoon();

  const handleGuideClick = () => {
    showComingSoon(
      "Quick Guides",
      "This feature is under development and will be available soon. Stay tuned for updates!"
    );
  };

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Quick Start Guides
      </h3>

      {/* Guide cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide, index) => (
          <GuideCard
            key={guide.title}
            guide={guide}
            index={index}
            theme={theme}
            onClick={handleGuideClick}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual guide card with animation and hover effects
 */
interface GuideCardProps {
  guide: Guide;
  index: number;
  theme: string;
  onClick: () => void;
}

const GuideCard: FC<GuideCardProps> = ({ guide, index, theme, onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
      theme === "dark"
        ? "border-gray-700 hover:border-gray-600 hover:bg-gray-700/50"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    <div className="flex items-start space-x-3">
      {/* Icon container */}
      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md">
        <guide.icon className="w-4 h-4 text-blue-600" />
      </div>

      {/* Content section */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium text-sm mb-1 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {guide.title}
        </h4>
        <p
          className={`text-xs mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {guide.description}
        </p>

        {/* Metadata section */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {guide.category}
          </span>
          <span
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {guide.time}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);
