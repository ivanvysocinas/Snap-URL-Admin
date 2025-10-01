"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoonModal";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  theme: string;
}

/**
 * Search bar component for help articles
 * Features animated entry, coming soon modal integration, and theme support
 */
export const SearchBar: FC<SearchBarProps> = ({
  query,
  onQueryChange,
  theme,
}) => {
  const { showComingSoon } = useComingSoon();

  const handleClick = () => {
    showComingSoon(
      "Search Bar",
      "This feature is under development and will be available soon. Stay tuned for updates!"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-8 text-center ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        How can we help you?
      </h2>

      {/* Search input with icon */}
      <div className="relative max-w-md mx-auto">
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="Search for help articles..."
          value={query}
          onClick={handleClick}
          onChange={(e) => onQueryChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
      </div>
    </motion.div>
  );
};
