"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { SearchX, Rocket, Satellite, Star } from "lucide-react";

interface NotFoundHeroProps {
  theme: string;
}

/**
 * 404 Hero component with animated astronaut illustration
 * Features floating stars, orbiting satellite, and rocket with flames
 * Provides humorous and friendly error messaging
 */
export const NotFoundHero: FC<NotFoundHeroProps> = ({ theme }) => {
  return (
    <div className="text-center mb-10">
      {/* Animated Astronaut Scene */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          type: "spring",
          stiffness: 150,
        }}
        className="flex justify-center mb-8 relative"
      >
        <div className="relative w-64 h-64">
          {/* Floating stars with staggered animations */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
              }}
            >
              <Star
                className={`w-3 h-3 ${
                  theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                }`}
                fill="currentColor"
              />
            </motion.div>
          ))}

          {/* Orbiting satellite animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Satellite
              className={`absolute top-4 right-12 w-8 h-8 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </motion.div>

          {/* Central astronaut/rocket with floating animation - wrapper for positioning */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Circular rocket container */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-40 h-40 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-blue-900/40 to-purple-800/40 border-2 border-blue-700"
                    : "bg-gradient-to-br from-blue-100 to-purple-200 border-2 border-blue-300"
                } shadow-2xl`}
              >
                <Rocket
                  className={`w-24 h-24 rotate-[-57deg] ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Animated rocket flames */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              >
                <div
                  className={`w-8 h-12 rounded-full blur-md ${
                    theme === "dark"
                      ? "bg-orange-500/60"
                      : "bg-orange-400/80"
                  }`}
                />
              </motion.div>

              {/* Search X badge with rotation */}
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
                    theme === "dark" ? "bg-purple-600" : "bg-purple-500"
                  } shadow-lg`}
                >
                  <SearchX className="w-5 h-5 text-white" strokeWidth={2} />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Large 404 Text with gradient */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <h1
          className={`text-8xl md:text-9xl font-bold bg-gradient-to-r ${
            theme === "dark"
              ? "from-blue-400 via-purple-500 to-blue-400"
              : "from-blue-600 via-purple-700 to-blue-600"
          } bg-clip-text text-transparent`}
          style={{ backgroundSize: "200% auto" }}
        >
          404
        </h1>
      </motion.div>

      {/* Humorous title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Houston, We Have a Problem!
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`text-lg md:text-xl ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        } max-w-2xl mx-auto mb-2`}
      >
        This page got lost in space and floated away... 
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`text-base ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        } max-w-xl mx-auto`}
      >
        Don't worry though, our mission control is here to help you navigate back!
      </motion.p>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className={`h-1 w-32 mx-auto mt-6 rounded-full ${
          theme === "dark"
            ? "bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-blue-600 to-transparent"
        }`}
      />
    </div>
  );
};