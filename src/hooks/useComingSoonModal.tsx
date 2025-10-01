/**
 * Context and hook for managing "Coming Soon" modal notifications
 * Provides global access to show coming soon messages for features under development
 */
"use client";

import { ComingSoonModal } from "@/components/modals/ComingSoonModal";
import { createContext, useContext, useState, ReactNode, FC } from "react";

interface ComingSoonContextType {
  showComingSoon: (title?: string, description?: string) => void;
  hideComingSoon: () => void;
}

const ComingSoonContext = createContext<ComingSoonContextType | undefined>(
  undefined
);

interface ComingSoonProviderProps {
  children: ReactNode;
}

export const ComingSoonProvider: FC<ComingSoonProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const showComingSoon = (
    customTitle = "Coming Soon",
    customDescription = "This feature is under development and will be available soon. Stay tuned for updates!"
  ) => {
    setTitle(customTitle);
    setDescription(customDescription);
    setIsOpen(true);
  };

  const hideComingSoon = () => {
    setIsOpen(false);
  };

  return (
    <ComingSoonContext.Provider value={{ showComingSoon, hideComingSoon }}>
      {children}
      <ComingSoonModal
        isOpen={isOpen}
        onClose={hideComingSoon}
        title={title}
        description={description}
      />
    </ComingSoonContext.Provider>
  );
};

export const useComingSoon = () => {
  const context = useContext(ComingSoonContext);
  if (context === undefined) {
    throw new Error("useComingSoon must be used within a ComingSoonProvider");
  }
  return context;
};
