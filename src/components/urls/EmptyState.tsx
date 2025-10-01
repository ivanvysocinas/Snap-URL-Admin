"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Plus } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onCreateClick: () => void;
}

/**
 * Empty State Component
 */
export const EmptyState: FC<EmptyStateProps> = ({
  searchQuery,
  onCreateClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <LinkIcon className="w-12 h-12 text-gray-400" />
    </div>

    <h3 className="text-xl font-semibold mb-2 dark:text-white">
      {searchQuery ? "No URLs found" : "No URLs yet"}
    </h3>

    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {searchQuery
        ? `No URLs match "${searchQuery}". Try adjusting your search or filters.`
        : "Get started by creating your first shortened URL. It only takes a few seconds!"}
    </p>

    {!searchQuery && (
      <button
        onClick={onCreateClick}
        className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        <span>Create Your First URL</span>
      </button>
    )}
  </motion.div>
);