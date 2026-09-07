import { useEffect, useRef, useState } from "react";

/**
 * Returns true for a brief moment right after `value` changes, so a
 * component can play a "bump"/"pop" animation as instant feedback for an
 * action (favoriting, cart count changing) instead of relying on the
 * network round-trip to be visible.
 */
export function useBumpOnChange<T>(value: T, durationMs = 350): boolean {
  const [bumping, setBumping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    setBumping(true);
    const timer = setTimeout(() => setBumping(false), durationMs);
    return () => clearTimeout(timer);
  }, [value, durationMs]);

  return bumping;
}
