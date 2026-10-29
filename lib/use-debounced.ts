import { useEffect, useState } from "react";

/** `value` once it has held still for `ms`, so a search field filters after typing pauses. */
export function useDebounced<T>(value: T, ms = 280) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return settled;
}
