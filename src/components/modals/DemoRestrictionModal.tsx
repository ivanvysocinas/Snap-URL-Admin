"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Crown, Zap } from "lucide-react";

interface DemoRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

/**
 * Demo restriction modal for blocked actions in demo accounts
 * Features gradient header, feature highlighting, and upgrade suggestions
 */
export const DemoRestrictionModal: FC<DemoRestrictionModalProps> = ({
  isOpen,
  onClose,
  title = "Demo Account Restriction",
  description = "This action is not available in demo mode. Please use a full account to access all features.",
  feature = "this feature",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
          >
            {/* Header with gradient */}
            <ModalHeader title={title} onClose={onClose} />

            {/* Content */}
            <div className="px-6 py-6">
              <div className="text-center">
                {/* Icon and description */}
                <IconSection description={description} />

                {/* Feature highlight */}
                <FeatureHighlight feature={feature} />

                {/* Action buttons */}
                <ActionButtons onClose={onClose} />

                {/* Additional info */}
                <AdditionalInfo />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal header with gradient background and close button
 */
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/20 rounded-full">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-orange-100">Demo Account</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  </div>
);

/**
 * Icon section with crown and description
 */
interface IconSectionProps {
  description: string;
}

const IconSection: FC<IconSectionProps> = ({ description }) => (
  <div className="mb-4">
    <div className="inline-flex p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
      <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
    </div>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      {description}
    </p>
  </div>
);

/**
 * Feature highlight box showing attempted action
 */
interface FeatureHighlightProps {
  feature: string;
}

const FeatureHighlight: FC<FeatureHighlightProps> = ({ feature }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Zap className="w-4 h-4 text-orange-500" />
      <span>
        You tried to access:{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {feature}
        </span>
      </span>
    </div>
  </div>
);

/**
 * Action buttons section
 */
interface ActionButtonsProps {
  onClose: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ onClose }) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClose}
      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors"
    >
      Continue Demo
    </motion.button>
  </div>
);

/**
 * Additional information section
 */
const AdditionalInfo: FC = () => (
  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Demo accounts have limited functionality. Create own to unlock all
      features.
    </p>
  </div>
);
