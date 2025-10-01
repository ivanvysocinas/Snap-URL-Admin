"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  Code,
  FileText,
  ExternalLink,
  Trash2,
} from "lucide-react";
import api from "../../lib/api";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

// Interface for stored API key
interface StoredApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

// Interface for confirmation modal state
interface ConfirmationState {
  isOpen: boolean;
  type: "single" | "all";
  keyId?: string;
  keyName?: string;
}

/**
 * API Access tab component
 * Handles API key generation, management, and documentation with localStorage persistence
 */
export const ApiAccessTab: FC = () => {
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState<string>("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  // Confirmation modal state
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: "single",
  });

  const { showDemoRestriction } = useDemoRestriction();
  const { user } = useAuth();

  // localStorage key for storing API keys
  const STORAGE_KEY = "snapurl_api_keys";

  /**
   * Load API keys from localStorage on component mount
   */
  useEffect(() => {
    loadApiKeysFromStorage();
  }, []);

  /**
   * Load saved API keys from localStorage
   */
  const loadApiKeysFromStorage = () => {
    try {
      const savedKeys = localStorage.getItem(STORAGE_KEY);
      if (savedKeys) {
        const parsedKeys: StoredApiKey[] = JSON.parse(savedKeys);
        setApiKeys(parsedKeys);
      }
    } catch (error) {
      console.error("Failed to load API keys from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Save API keys to localStorage
   */
  const saveApiKeysToStorage = (keys: StoredApiKey[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error("Failed to save API keys to localStorage:", error);
    }
  };

  /**
   * Generate new API key
   */
  const generateApiKey = async () => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "This action is not available in demo mode. Please use a full account to access all features.",
        "Generate API key"
      );
      return;
    }
    if (!newKeyName.trim()) {
      setErrors({ apiKey: "Please enter a name for the API key" });
      return;
    }

    setLoading((prev) => ({ ...prev, generateKey: true }));
    setErrors({});

    try {
      const response = await api.auth.generateApiKey(newKeyName);
      if (response.success && response.data) {
        const keyName = newKeyName.trim();
        setGeneratedKey(response.data.apiKey);
        setNewKeyName("");
        setSuccess((prev) => ({ ...prev, generateKey: true }));
        setTimeout(
          () => setSuccess((prev) => ({ ...prev, generateKey: false })),
          5000
        );

        // Create new key object
        const newKey: StoredApiKey = {
          id: Date.now().toString(),
          name: keyName,
          key: response.data.apiKey,
          createdAt: new Date().toISOString(),
          expiresAt: response.data.expiresAt,
          lastUsed: "",
        };

        // Update state and localStorage
        const updatedKeys = [...apiKeys, newKey];
        setApiKeys(updatedKeys);
        saveApiKeysToStorage(updatedKeys);
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
      setErrors({
        apiKey:
          error instanceof Error ? error.message : "Failed to generate API key",
      });
    } finally {
      setLoading((prev) => ({ ...prev, generateKey: false }));
    }
  };

  /**
   * Copy API key to clipboard
   */
  const copyApiKey = async (key: string) => {
    const success = await api.utils.copyToClipboard(key);
    if (success) {
      setSuccess((prev) => ({ ...prev, [`copy_${key}`]: true }));
      setTimeout(
        () => setSuccess((prev) => ({ ...prev, [`copy_${key}`]: false })),
        2000
      );
    }
  };

  /**
   * Show confirmation modal for removing single API key
   */
  const showRemoveKeyConfirmation = (keyId: string) => {
    const keyToRemove = apiKeys.find((key) => key.id === keyId);
    if (!keyToRemove) return;

    setConfirmation({
      isOpen: true,
      type: "single",
      keyId,
      keyName: keyToRemove.name,
    });
  };

  /**
   * Show confirmation modal for clearing all API keys
   */
  const showClearAllConfirmation = () => {
    setConfirmation({
      isOpen: true,
      type: "all",
    });
  };

  /**
   * Handle confirmation modal close
   */
  const handleConfirmationClose = () => {
    setConfirmation({ isOpen: false, type: "single" });
  };

  /**
   * Handle confirmed removal action
   */
  const handleConfirmedRemoval = () => {
    if (confirmation.type === "single" && confirmation.keyId) {
      removeApiKey(confirmation.keyId);
    } else if (confirmation.type === "all") {
      clearAllKeys();
    }
    handleConfirmationClose();
  };

  /**
   * Remove API key from localStorage and state
   */
  const removeApiKey = (keyId: string) => {
    const keyToRemove = apiKeys.find((key) => key.id === keyId);
    if (!keyToRemove) return;

    // Update state and localStorage
    const updatedKeys = apiKeys.filter((key) => key.id !== keyId);
    setApiKeys(updatedKeys);
    saveApiKeysToStorage(updatedKeys);

    // Clear any success states for this key
    setSuccess((prev) => {
      const newSuccess = { ...prev };
      delete newSuccess[`copy_${keyToRemove.key}`];
      return newSuccess;
    });

    // Clear show state for this key
    setShowApiKey((prev) => {
      const newShow = { ...prev };
      delete newShow[keyId];
      return newShow;
    });
  };

  /**
   * Clear all stored API keys
   */
  const clearAllKeys = () => {
    setApiKeys([]);
    saveApiKeysToStorage([]);
    setShowApiKey({});
    setSuccess({});
  };

  /**
   * Get first and last parts of API key for partial display
   */
  const getApiKeyParts = (key: string) => {
    const prefix = key.substring(0, 12); // Show first 12 chars
    const suffix = key.slice(-8); // Show last 8 chars
    return { prefix, suffix };
  };

  /**
   * Get modal content based on confirmation type
   */
  const getModalContent = () => {
    if (confirmation.type === "single") {
      return {
        title: "Remove API Key",
        message: `Are you sure you want to remove the API key "${confirmation.keyName}"? This action cannot be undone and any applications using this key will lose access.`,
        confirmText: "Remove Key",
      };
    } else {
      return {
        title: "Clear All API Keys",
        message: `Are you sure you want to remove all ${apiKeys.length} stored API keys? This action cannot be undone and any applications using these keys will lose access.`,
        confirmText: "Clear All",
      };
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmedRemoval}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        cancelText="Cancel"
        type="danger"
      />

      {/* API Keys Section */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <Key className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold dark:text-white">API Keys</h3>
          </div>

          {apiKeys.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={showClearAllConfirmation}
              className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20 transition-colors self-start sm:self-auto"
              title="Clear all stored keys"
            >
              Clear All ({apiKeys.length})
            </motion.button>
          )}
        </div>

        {/* Generate New Key */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium dark:text-white mb-3">
            Generate New API Key
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name (e.g., 'Mobile App')"
              className="input-base flex-1"
              disabled={loading.generateKey}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !loading.generateKey &&
                  newKeyName.trim()
                ) {
                  generateApiKey();
                }
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateApiKey}
              disabled={
                loading.generateKey || !newKeyName.trim() || apiKeys.length >= 5
              }
              className="btn-primary px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              {loading.generateKey ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </motion.button>
          </div>

          {errors.apiKey && (
            <div className="mt-2 flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.apiKey}</span>
            </div>
          )}
          {apiKeys.length >= 5 && (
            <div className="mt-2 flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>You have reached the maximum number of API keys (5)</span>
            </div>
          )}
        </div>

        {/* Generated Key Display */}
        {generatedKey && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-green-800 dark:text-green-200">
                API Key Generated Successfully
              </h4>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Your API key has been generated and saved locally. You can copy it
              again from the list below.
            </p>

            {/* Mobile-responsive token display */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-white dark:bg-gray-800 border rounded-lg">
                <div className="flex-1 min-w-0 order-2 sm:order-1">
                  <div className="font-mono text-xs break-all select-all p-2 bg-gray-50 dark:bg-gray-900 rounded border-dashed border-2 overflow-hidden">
                    {generatedKey}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyApiKey(generatedKey)}
                  className="btn-secondary p-2 rounded flex-shrink-0 order-1 sm:order-2 self-end sm:self-center"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stored Keys */}
        <div>
          <h4 className="font-medium dark:text-white mb-3">
            Your API Keys {apiKeys.length > 0 && `(${apiKeys.length})`}
          </h4>
          {apiKeys.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No API keys saved yet. Create your first key above.
            </p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => {
                const isVisible = showApiKey[key.id];
                const { prefix, suffix } = getApiKeyParts(key.key);

                return (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                      <h5 className="font-medium dark:text-white truncate">
                        {key.name}
                      </h5>
                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setShowApiKey((prev) => ({
                              ...prev,
                              [key.id]: !prev[key.id],
                            }))
                          }
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded"
                          title={isVisible ? "Hide key" : "Show key"}
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyApiKey(key.key)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded"
                          title="Copy to clipboard"
                        >
                          {success[`copy_${key.key}`] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => showRemoveKeyConfirmation(key.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title="Remove key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Responsive key display */}
                    <div className="space-y-2">
                      {isVisible ? (
                        <div className="font-mono text-xs p-3 bg-gray-50 dark:bg-gray-800 rounded border break-all select-all overflow-hidden">
                          {key.key}
                        </div>
                      ) : (
                        <div className="font-mono text-xs p-3 bg-gray-50 dark:bg-gray-800 rounded border flex items-center overflow-hidden">
                          <span className="text-gray-600 dark:text-gray-400 break-all">
                            {prefix}
                          </span>
                          <span className="mx-2 text-gray-400 flex-shrink-0">
                            {"•".repeat(12)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 break-all">
                            {suffix}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4">
                        <span>
                          Created:{" "}
                          {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                        {key.expiresAt && (
                          <span>
                            Expires:{" "}
                            {new Date(key.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        {key.lastUsed && (
                          <span>
                            Last used:{" "}
                            {new Date(key.lastUsed).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-blue-500">Stored locally</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* API Documentation */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold dark:text-white">
            API Documentation
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Getting Started
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Use your API key to authenticate requests to the SnapURL API.
            </p>

            {/* Responsive code block */}
            <div className="bg-white dark:bg-gray-800 rounded border overflow-hidden">
              {/* Mobile version */}
              <div className="block sm:hidden">
                <div className="p-3 text-xs font-mono space-y-1 overflow-x-auto">
                  <div className="text-gray-500 whitespace-nowrap">
                    curl -H "Authorization: Bearer YOUR_API_KEY" \
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap pl-4">
                    https://api.snapurl.dev/urls
                  </div>
                </div>
              </div>

              {/* Desktop version */}
              <div className="hidden sm:block">
                <div className="p-3 text-sm font-mono overflow-x-auto">
                  <div className="whitespace-pre">
                    curl -H "Authorization: Bearer YOUR_API_KEY" \
                    https://api.snapurl.dev/urls
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
              onClick={() =>
                window.open(
                  "https://snap-url-api-production.up.railway.app/api-docs/",
                  "_blank"
                )
              }
            >
              <FileText className="w-4 h-4" />
              <span>View Full Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
