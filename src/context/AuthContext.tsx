"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordChangeData,
} from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>;
  changePassword: (passwords: PasswordChangeData) => Promise<AuthResponse>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider component that manages user authentication state
 * Handles login, registration, logout, and profile management
 * Now uses real API calls instead of mock data
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Check authentication status on app load
   * Validates stored token and fetches user data from real API
   */
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      console.log("AuthContext: Starting auth check...");
      try {
        const token = localStorage.getItem("authToken");
        console.log("AuthContext: Token found:", !!token);

        if (!token) {
          console.log("AuthContext: No token, setting loading to false");
          setLoading(false);
          return;
        }

        // Validate token with real API
        console.log("AuthContext: Validating token with API...");
        const response = await api.auth.validate();

        if (response.success && response.data?.user) {
          console.log("AuthContext: Token valid, setting user data");
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          console.log("AuthContext: Token validation failed");
          localStorage.removeItem("authToken");
          setError("Session expired. Please login again.");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("authToken");

        if (err instanceof Error && !err.message.includes("401")) {
          setError("Authentication check failed. Please try again.");
        }
      } finally {
        console.log("AuthContext: Setting loading to false");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login user with credentials using real API
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Attempting login...");
      const response = await api.auth.login(credentials);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store token and update state
        localStorage.setItem("authToken", token);
        setUser(userData);
        setIsAuthenticated(true);

        console.log("AuthContext: Login successful, redirecting to dashboard");
        router.push("/dashboard");

        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      console.error("Login failed:", err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user using real API
   */
  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Attempting registration...");
      const { name, email, password } = userData;
      const response = await api.auth.register({ name, email, password });

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;

        // Store token and update state
        localStorage.setItem("authToken", token);
        setUser(newUser);
        setIsAuthenticated(true);

        console.log(
          "AuthContext: Registration successful, redirecting to dashboard"
        );
        router.push("/dashboard");

        return response;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      console.error("Registration failed:", err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear authentication state using real API
   */
  const logout = async (): Promise<void> => {
    try {
      // Call logout API endpoint to invalidate token on server
      await api.auth.logout();
    } catch (err) {
      console.error(
        "Logout API call failed, but continuing with client-side logout:",
        err
      );
    } finally {
      // Always clear client-side state
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      router.push("/auth/login");
    }
  };

  /**
   * Update user profile using real API
   */
  const updateProfile = async (
    updates: Partial<User>
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Updating profile...");
      const response = await api.auth.updateProfile(updates);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return {
          success: true,
          message: response.message || "Profile updated successfully",
        };
      } else {
        throw new Error(response.message || "Profile update failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Profile update failed";
      console.error("Profile update failed:", err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change user password using real API
   */
  const changePassword = async (
    passwords: PasswordChangeData
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Changing password...");
      const response = await api.auth.changePassword(passwords);

      if (response.success) {
        return {
          success: true,
          message: response.message || "Password changed successfully",
        };
      } else {
        throw new Error(response.message || "Password change failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Password change failed";
      console.error("Password change failed:", err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh user data from server using real API
   */
  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      console.log("AuthContext: Refreshing user data...");
      const response = await api.auth.getProfile();

      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      if (err instanceof Error && err.message.includes("401")) {
        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
        router.push("/auth/login");
      }
    }
  };

  /**
   * Clear authentication error
   */
  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
