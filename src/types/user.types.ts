/**
 * User account and profile data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "moderator" | "demo";
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  subscription?: UserSubscription;
}

/**
 * User settings and preferences configuration
 */
export interface UserPreferences {
  defaultQRSize: 128 | 256 | 512 | 1024;
  defaultQRColor: string;
  emailNotifications: boolean;
  darkMode?: boolean;
  language?: string;
}

/**
 * User subscription and plan information
 */
export interface UserSubscription {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "inactive" | "cancelled";
  expiresAt?: string;
  features: string[];
}

/**
 * Login form data structure
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration form data structure
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Authentication API response structure
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?:
    | {
        user: User;
        token: string;
      }
    | undefined;
  error?: string | undefined;
}

/**
 * Profile update API response structure
 */
export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
  error?: string;
}

/**
 * Password change form data structure
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
