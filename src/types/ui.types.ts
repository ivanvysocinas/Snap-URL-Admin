import { ReactNode, ComponentType } from "react";

/**
 * Chart data point structure for analytics visualizations
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  fill?: string;
  [key: string]: any;
}

/**
 * Modal component props structure
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
}

/**
 * Table column configuration structure
 */
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: T) => ReactNode;
  className?: string;
}

/**
 * Filter dropdown option structure
 */
export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

/**
 * Form field configuration structure
 */
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: { label: string; value: string | number }[];
}

/**
 * Form validation rule structure
 */
export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern" | "url";
  value?: number | string;
  message: string;
}

/**
 * Form error state structure
 */
export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Theme configuration options
 */
export type Theme = "light" | "dark";

/**
 * Complete theme configuration structure
 */
export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}

/**
 * Navigation menu item structure
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<any>;
  requiredRole?: string[];
  children?: NavigationItem[];
  badge?: string;
}