/**
 * Site-wide navigation, contact details and social links, shared by the
 * header menu, the footer and the chat widget.
 */

export interface SiteLink {
  name: string;
  href: string;
}

export const MENU_ITEMS: SiteLink[] = [
  { name: "Home", href: "/" },
  { name: "About TPHL", href: "/about" },
  { name: "Leadership Team", href: "/team" },
  { name: "Projects", href: "/projects" },
  { name: "Projects Progress", href: "/project-progress" },
  { name: "Life At TPHL", href: "/life-at-premium-homes" },
  { name: "Careers", href: "/careers" },
  { name: "News & Events", href: "/blogs" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
];

export const FOOTER_COLUMNS: { title: string; w: number; links: SiteLink[] }[] = [
  {
    title: "Company",
    w: 92,
    links: [
      { name: "Home", href: "/" },
      { name: "Projects", href: "/projects" },
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "News", href: "/blogs" },
    ],
  },
  {
    title: "Links",
    w: 99,
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "FAQ", href: "/faq" },
      { name: "Policies", href: "/company-policy" },
    ],
  },
];

export const LEGAL_LINKS: SiteLink[] = [
  { name: "Terms", href: "/terms-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export const CONTACT = {
  hotline: { label: "+880 1900-000000", href: "tel:+8801900000000" },
  inquiries: { label: "info@thepremiumhomes.com", href: "mailto:info@thepremiumhomes.com" },
  phone: { label: "+971 54 308 6000", href: "tel:+971543086000" },
  phoneLocal: { label: "+8801794 - 621 487", href: "tel:+8801794621487" },
  support: { label: "+8801958253300", href: "tel:+8801958253300" },
  email: { label: "hello@premiumhomes.com.bd", href: "mailto:hello@premiumhomes.com.bd" },
  office: ["House 15, Road 7, Block B", "Bashundhara R/A, Dhaka 1229"],
} as const;

const WHATSAPP_NUMBER = "8801958253301";

/** WhatsApp chat link, optionally with a pre-filled message. */
export function whatsappUrl(message?: string) {
  const text = message?.trim();
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Icon paths drawn on a 24×24 grid. */
export const SOCIALS: { label: string; href: string; d: string }[] = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    d: "M14 8.5h-1.6c-.5 0-.9.4-.9.9V11H14l-.3 2.6h-2.2V21H8.8v-7.4H6.8V11h2V9.1C8.8 6.9 10 5.5 12.3 5.5H14v3Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    d: "M8.5 4h7A4.5 4.5 0 0 1 20 8.5v7a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 15.5v-7A4.5 4.5 0 0 1 8.5 4Zm0 1.6a2.9 2.9 0 0 0-2.9 2.9v7a2.9 2.9 0 0 0 2.9 2.9h7a2.9 2.9 0 0 0 2.9-2.9v-7a2.9 2.9 0 0 0-2.9-2.9h-7ZM12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Zm0 1.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.1-2.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    d: "M21.3 7.6a2.4 2.4 0 0 0-1.7-1.7C18.1 5.5 12 5.5 12 5.5s-6.1 0-7.6.4A2.4 2.4 0 0 0 2.7 7.6C2.3 9.1 2.3 12 2.3 12s0 2.9.4 4.4a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.6.4 7.6.4s6.1 0 7.6-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.4.4-4.4s0-2.9-.4-4.4ZM10.1 14.8V9.2l5 2.8-5 2.8Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    d: "M6.9 9.5h2.6V19H6.9V9.5ZM8.2 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3 4.5h2.5v1.3h.1c.3-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4V19h-2.6v-4.1c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-2.6V9.5Z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    d: "M16.6 4h-2.8v11.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .4 0 .6.1V10a5.2 5.2 0 1 0 4.6 5.2V9.4a6.6 6.6 0 0 0 3.9 1.3V7.9A3.9 3.9 0 0 1 16.6 4Z",
  },
];
