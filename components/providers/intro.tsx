"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Intro = { done: boolean; finish: () => void };

const IntroContext = createContext<Intro>({ done: true, finish: () => {} });

/** `done` flips to true when the preloader starts lifting; entrance animations wait for it. */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return <IntroContext.Provider value={{ done, finish }}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
