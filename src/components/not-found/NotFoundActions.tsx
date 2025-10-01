"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

interface NotFoundActionsProps {
  theme: string;
}

/**
 * 404 Actions component
 * Navigation buttons for redirecting user back to safety
 * Features animated icons and hover effects
 */
export const NotFoundActions: FC<NotFoundActionsProps> = ({ theme }) => {
  const router = useRouter();

  /**
   * Navigate to dashboard
   */
  const handleGoHome = () => {
    router.push("/dashboard");
  };

  /**
   * Go back to previous page
   */
  const handleGoBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      {/* Go Back Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoBack}
        className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
          theme === "dark"
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-gray-700/50"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-gray-400/50"
        }`}
      >
        <motion.div
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.div>
        <span>Go Back</span>
      </motion.button>

      {/* Go to Dashboard Button with shine effect */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoHome}
        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl font-semibold overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />

        <Home className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Return to Dashboard</span>
      </motion.button>
    </motion.div>
  );
};