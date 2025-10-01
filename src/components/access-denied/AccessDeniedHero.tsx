"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { ShieldX, Lock, AlertTriangle } from "lucide-react";

interface AccessDeniedHeroProps {
  theme: string;
}

/**
 * Access Denied Hero component
 * Animated lock icon with title and description
 */
export const AccessDeniedHero: FC<AccessDeniedHeroProps> = ({ theme }) => {
  return (
    <div className="text-center mb-10">
      {/* Animated Lock Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          type: "spring",
          stiffness: 150,
        }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          {/* Pulsing rings */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full ${
              theme === "dark"
                ? "bg-red-500/20 border-2 border-red-500/30"
                : "bg-red-400/20 border-2 border-red-400/30"
            }`}
            style={{ padding: "40px" }}
          />

          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className={`absolute inset-0 rounded-full ${
              theme === "dark"
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-red-400/10 border border-red-400/20"
            }`}
            style={{ padding: "60px" }}
          />

          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              rotate: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
            animate={{
              y: [0, -5, 0],
            }}
            className={`relative p-8 rounded-full ${
              theme === "dark"
                ? "bg-gradient-to-br from-red-900/40 to-red-800/40 border-2 border-red-700"
                : "bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300"
            } shadow-2xl`}
            style={{
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <ShieldX
              className={`w-20 h-20 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
              strokeWidth={1.5}
            />

            {/* Small rotating lock */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-2 -right-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`p-2 rounded-full ${
                  theme === "dark" ? "bg-red-600" : "bg-red-500"
                } shadow-lg`}
              >
                <Lock className="w-5 h-5 text-white" strokeWidth={2} />
              </motion.div>
            </motion.div>

            {/* Warning triangle */}
            <motion.div
              animate={{
                y: [0, -3, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-2 -left-2"
            >
              <div
                className={`p-2 rounded-full ${
                  theme === "dark" ? "bg-yellow-600" : "bg-yellow-500"
                } shadow-lg`}
              >
                <AlertTriangle
                  className="w-4 h-4 text-white"
                  strokeWidth={2}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Title with gradient */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${
          theme === "dark"
            ? "from-red-400 via-red-500 to-red-400"
            : "from-red-600 via-red-700 to-red-600"
        } bg-clip-text text-transparent`}
        style={{ backgroundSize: "200% auto" }}
      >
        Access Denied
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`text-lg md:text-xl ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        } max-w-2xl mx-auto`}
      >
        You don't have permission to access this page
      </motion.p>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className={`h-1 w-32 mx-auto mt-6 rounded-full ${
          theme === "dark"
            ? "bg-gradient-to-r from-transparent via-red-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-red-600 to-transparent"
        }`}
      />
    </div>
  );
};