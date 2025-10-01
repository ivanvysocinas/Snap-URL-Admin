import { FC, useState } from "react";
import { motion } from "framer-motion";
import { User, Save, Loader2, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import api from "../../lib/api";

/**
 * Profile information tab component
 * Handles user profile updates with demo account restrictions
 */
interface ProfileTabProps {
  variants: any;
  loading: Record<string, boolean>;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  success: Record<string, boolean>;
  setSuccess: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const ProfileTab: FC<ProfileTabProps> = ({
  variants,
  loading,
  setLoading,
  errors,
  setErrors,
  success,
  setSuccess,
}) => {
  const { user, updateProfile } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || null,
  });

  /**
   * Handle profile update with demo restriction check
   */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for demo account restriction
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "Profile update is not available in demo mode. Please use a full account to access all features.",
        "Update Profile"
      );
      return;
    }

    setLoading((prev) => ({ ...prev, profile: true }));
    setErrors({});

    try {
      const response = await api.auth.updateProfile({
        name: profileData.name,
        // Note: avatar upload would need separate handling
      });

      if (response.success && response.data) {
        updateProfile(response.data.user);
        setSuccess((prev) => ({ ...prev, profile: true }));
        setTimeout(
          () => setSuccess((prev) => ({ ...prev, profile: false })),
          3000
        );
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      setErrors({
        profile:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="card p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold dark:text-white">
          Profile Information
        </h3>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div>
            <h4 className="font-medium dark:text-white">Profile Picture</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avatar customization coming soon
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="input-base"
            required
            minLength={2}
            maxLength={50}
            disabled={loading.profile}
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            className="input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Account Type
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="capitalize font-medium dark:text-white">
                {user?.subscription?.plan || "Free"}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Member Since
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {errors.profile && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.profile}</span>
          </div>
        )}

        {success.profile && (
          <div className="flex items-center space-x-2 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading.profile}
            className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading.profile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
