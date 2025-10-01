"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function HomePage(): JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Fallback timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading timeout reached - forcing redirect");
        setLoadingTimeout(true);
        router.replace("/auth/login");
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading, router]);

  useEffect(() => {
    if (!loading && !loadingTimeout) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, loading, loadingTimeout, router]);

  // Show loader while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <div>Redirecting...</div>;
}