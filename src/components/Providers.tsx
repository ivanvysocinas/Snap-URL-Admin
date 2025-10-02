"use client";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { ComingSoonProvider } from "@/hooks/useComingSoonModal";
import { NotificationsProvider } from "@/hooks/useNotifications";
import { DemoRestrictionProvider } from "@/hooks/useDemoRestrictionModal";
import { AccessControlProvider } from "@/context/AccessControlProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component that wraps the app with all context providers
 * Must be a client component to use React context
 */
export default function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoRestrictionProvider>
          <NotificationsProvider>
            <AccessControlProvider>
              <ComingSoonProvider>{children}</ComingSoonProvider>
            </AccessControlProvider>
          </NotificationsProvider>
        </DemoRestrictionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
