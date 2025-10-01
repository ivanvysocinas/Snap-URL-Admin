"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SuccessStepProps {
  theme: string;
}

/**
 * Success Step Component
 * Displays successful password reset confirmation with navigation to login
 */
export const SuccessStep: FC<SuccessStepProps> = ({ theme }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      key="success-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-md mx-auto text-center"
    >
      <motion.div variants={itemVariants}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h1
          className={`text-2xl sm:text-3xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Password Reset Successful!
        </h1>

        <p
          className={`text-sm sm:text-base mb-8 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/auth/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Continue to Login</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
