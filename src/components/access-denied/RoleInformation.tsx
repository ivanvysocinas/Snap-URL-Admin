"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Shield, Crown, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface RoleInformationProps {
  requiredRoles: string[];
  theme: string;
}

/**
 * Role Information component
 * Displays current user role and required roles for the page
 */
export const RoleInformation: FC<RoleInformationProps> = ({
  requiredRoles,
  theme,
}) => {
  const { user } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return Crown;
      case "demo":
        return Shield;
      case "user":
        return User;
      default:
        return Shield;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return theme === "dark" ? "text-purple-400" : "text-purple-600";
      case "demo":
        return theme === "dark" ? "text-blue-400" : "text-blue-600";
      case "user":
        return theme === "dark" ? "text-green-400" : "text-green-600";
      default:
        return theme === "dark" ? "text-gray-400" : "text-gray-600";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return theme === "dark"
          ? "bg-purple-900/30 border-purple-800 text-purple-300"
          : "bg-purple-100 border-purple-300 text-purple-700";
      case "demo":
        return theme === "dark"
          ? "bg-blue-900/30 border-blue-800 text-blue-300"
          : "bg-blue-100 border-blue-300 text-blue-700";
      case "user":
        return theme === "dark"
          ? "bg-green-900/30 border-green-800 text-green-300"
          : "bg-green-100 border-green-300 text-green-700";
      default:
        return theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={`p-5 rounded-lg ${
        theme === "dark"
          ? "bg-gray-700/50 border border-gray-600"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      {/* Current Role */}
      <div className="mb-4">
        <p
          className={`text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Your current role:
        </p>
        <div className="flex items-center gap-2">
          {user?.role && (
            <>
              {(() => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <RoleIcon
                    className={`w-5 h-5 ${getRoleColor(user.role)}`}
                  />
                );
              })()}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Required Roles */}
      <div>
        <p
          className={`text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          This page requires:
        </p>
        <div className="flex flex-wrap gap-2">
          {requiredRoles.map((role) => {
            const RoleIcon = getRoleIcon(role);
            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <RoleIcon className={`w-5 h-5 ${getRoleColor(role)}`} />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                    role
                  )}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};