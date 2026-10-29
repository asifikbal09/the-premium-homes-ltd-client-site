import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fluid size that equals `max` px on the 1600px Figma canvas, scales with the
 * viewport below it and never drops under `min` px.
 */
export function fluid(max: number, min: number) {
  return `clamp(${min}px, ${(max / 1600) * 100}vw, ${max}px)`;
}

/*
 * Motion language. Movement is physical: bounce-free springs for anything
 * that travels, a long expo-out tween for anything that only settles.
 */
export const SPRING = { type: "spring", bounce: 0, duration: 1.1 } as const;
export const SPRING_SLOW = { type: "spring", bounce: 0, duration: 1.6 } as const;
export const SPRING_SOFT = { type: "spring", bounce: 0.18, duration: 1 } as const;
export const SETTLE = [0.22, 1, 0.36, 1] as const;
