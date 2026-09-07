import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation the way a
 * traditional multi-page site does — without this, landing on a new route
 * while scrolled down (e.g. after submitting a tall form) leaves the new
 * page rendered mid-scroll, which reads as broken, especially on mobile.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
