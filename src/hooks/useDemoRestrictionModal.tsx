/**
 * Context and hook for managing demo account restriction notifications
 * Shows modal alerts when users attempt to access restricted features in demo mode
 */
"use client";

import { DemoRestrictionModal } from "@/components/modals/DemoRestrictionModal";
import { createContext, useContext, useState, ReactNode, FC } from "react";

interface DemoRestrictionContextType {
  showDemoRestriction: (
    title?: string,
    description?: string,
    feature?: string
  ) => void;
  hideDemoRestriction: () => void;
}

const DemoRestrictionContext = createContext<
  DemoRestrictionContextType | undefined
>(undefined);

interface DemoRestrictionProviderProps {
  children: ReactNode;
}

export const DemoRestrictionProvider: FC<DemoRestrictionProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [feature, setFeature] = useState<string>("");

  const showDemoRestriction = (
    customTitle = "Demo Account Restriction",
    customDescription = "This action is not available in demo mode. Please use a full account to access all features.",
    customFeature = "this feature"
  ) => {
    setTitle(customTitle);
    setDescription(customDescription);
    setFeature(customFeature);
    setIsOpen(true);
  };

  const hideDemoRestriction = () => {
    setIsOpen(false);
  };

  return (
    <DemoRestrictionContext.Provider
      value={{ showDemoRestriction, hideDemoRestriction }}
    >
      {children}
      <DemoRestrictionModal
        isOpen={isOpen}
        onClose={hideDemoRestriction}
        title={title}
        description={description}
        feature={feature}
      />
    </DemoRestrictionContext.Provider>
  );
};

export const useDemoRestriction = () => {
  const context = useContext(DemoRestrictionContext);
  if (context === undefined) {
    throw new Error(
      "useDemoRestriction must be used within a DemoRestrictionProvider"
    );
  }
  return context;
};
