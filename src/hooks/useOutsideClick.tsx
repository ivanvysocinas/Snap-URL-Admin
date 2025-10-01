/**
 * Detects clicks outside a referenced element
 * Commonly used for closing dropdowns, modals, and overlay components
 */
import { useEffect, useRef } from "react";

/**
 * Hook for detecting clicks outside a specified element
 * Supports both mouse and touch events for mobile compatibility
 *
 * @param handler - Callback executed when outside click is detected
 * @param enabled - Whether the detection is active
 * @returns ref - Attach this ref to the element you want to monitor
 */
export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  enabled: boolean = true
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Support both mouse and touch events
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler, enabled]);

  return ref;
};
