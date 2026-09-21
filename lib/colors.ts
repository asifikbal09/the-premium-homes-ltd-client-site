/**
 * Brand Color Palette for The Premium Homes Limited.
 *
 * Direct hex values & roles:
 * - Deep Forest: #044133 (Primary brand hero tone, timeless British racing / pine green)
 * - Warm Gold:   #D0A65B (Luxurious metallic gold accent, highlights, badges)
 * - Emerald:     #055B4B (Deep spruce / emerald green secondary tone)
 * - Ivory Pearl: #FDFDF8 (Alabaster / warm pearl background and light base)
 * - Warm Cream:  #F7E7CB (Soft sand / champagne cream surface & card accent)
 * - Charcoal:    #1F2723 (Deep obsidian / slate forest for typography & dark surfaces)
 */

export interface BrandColorItem {
  name: string;
  hex: string;
  variable: string;
  tailwind: string;
  role: string;
  textColor: string;
  hasBorder?: boolean;
  row: number;
  col: number;
}

export const BRAND_COLORS: BrandColorItem[] = [
  {
    name: "Deep Forest",
    hex: "#044133",
    variable: "--brand-forest",
    tailwind: "forest",
    role: "Primary Brand / Hero",
    textColor: "#FDFDF8",
    hasBorder: false,
    row: 1,
    col: 2,
  },
  {
    name: "Warm Gold",
    hex: "#D0A65B",
    variable: "--brand-gold",
    tailwind: "gold",
    role: "Luxury Accent / Highlight",
    textColor: "#1F2723",
    hasBorder: false,
    row: 1,
    col: 3,
  },
  {
    name: "Emerald Green",
    hex: "#055B4B",
    variable: "--brand-emerald",
    tailwind: "emerald",
    role: "Secondary Brand / Depth",
    textColor: "#FDFDF8",
    hasBorder: false,
    row: 2,
    col: 1,
  },
  {
    name: "Ivory Pearl",
    hex: "#FDFDF8",
    variable: "--brand-ivory",
    tailwind: "ivory",
    role: "Primary Base / Background",
    textColor: "#1F2723",
    hasBorder: true,
    row: 2,
    col: 2,
  },
  {
    name: "Warm Cream",
    hex: "#F7E7CB",
    variable: "--brand-cream",
    tailwind: "cream",
    role: "Soft Surface / Card Accent",
    textColor: "#1F2723",
    hasBorder: false,
    row: 2,
    col: 3,
  },
  {
    name: "Obsidian Charcoal",
    hex: "#1F2723",
    variable: "--brand-charcoal",
    tailwind: "charcoal",
    role: "Text & Dark Container",
    textColor: "#FDFDF8",
    hasBorder: false,
    row: 2,
    col: 4,
  },
];

export const PALETTE = {
  forest: "#044133",
  gold: "#D0A65B",
  emerald: "#055B4B",
  ivory: "#FDFDF8",
  cream: "#F7E7CB",
  charcoal: "#1F2723",
} as const;

export type BrandColorKey = keyof typeof PALETTE;
