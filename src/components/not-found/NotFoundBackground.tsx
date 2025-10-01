"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface NotFoundBackgroundProps {
  theme: string;
}

/**
 * Animated background with floating particles and gradient
 * Space theme for 404 page with blue and purple gradient transitions
 * Features 20 floating star particles and large blur shapes for depth
 */
export const NotFoundBackground: FC<NotFoundBackgroundProps> = ({ theme }) => {
  // Generate random particles with varied properties
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Animated gradient background with radial transitions */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            theme === "dark"
              ? [
                  "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                ]
              : [
                  "radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.08) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(167, 139, 250, 0.08) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 100%, rgba(96, 165, 250, 0.08) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 0%, rgba(167, 139, 250, 0.08) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.08) 0%, transparent 50%)",
                ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles (stars) with varied animations */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            theme === "dark" ? "bg-blue-400/30" : "bg-blue-500/40"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large floating shapes for depth and atmosphere */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full blur-3xl ${
          theme === "dark" ? "bg-blue-600/5" : "bg-blue-400/10"
        }`}
        style={{ top: "10%", left: "10%" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute w-80 h-80 rounded-full blur-3xl ${
          theme === "dark" ? "bg-purple-500/5" : "bg-purple-300/10"
        }`}
        style={{ bottom: "10%", right: "10%" }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};