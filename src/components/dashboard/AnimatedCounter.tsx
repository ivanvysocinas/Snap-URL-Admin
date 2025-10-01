"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  formatValue: (num: number) => string;
}

/**
 * Animated counter component for smooth number transitions
 * Provides smooth animations when the displayed value changes
 */
export const AnimatedCounter: FC<AnimatedCounterProps> = ({
  value,
  prefix = "",
  suffix = "",
  formatValue,
}) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      {prefix}
      {formatValue(value)}
      {suffix}
    </motion.span>
  );
};
