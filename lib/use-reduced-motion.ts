import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * The visitor's reduced-motion setting. Replaces motion's hook, which logs a warning in
 * development whenever the setting is on. The server snapshot is `false`, so the first client
 * render matches the server HTML and the real value arrives right after hydration. Use it for
 * timing only; put any visual difference in CSS (`motion-reduce:`), never in rendered markup.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
