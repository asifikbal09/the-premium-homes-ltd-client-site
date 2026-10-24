"use client";

import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";

export function FloatingContactButtons() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const contactActions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      subtitle: "+880 1958-253301",
      href: "https://wa.me/8801958253301",
      isExternal: true,
      ariaLabel: "Chat on WhatsApp with Premium Homes",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 sm:w-5 sm:h-5 text-[#d0a65b]"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.68.46-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
        </svg>
      ),
      bgClass:
        "bg-[#05261e] hover:bg-[#083a2e] text-[#fdfdf8] border border-[#d0a65b]/40 hover:border-[#d0a65b] shadow-[#05261e]/50",
      accentBorder: "border-[#d0a65b]/30",
    },
    {
      id: "phone",
      label: "Call Us",
      subtitle: "+880 1958-253301",
      href: "tel:+8801958253301",
      isExternal: false,
      ariaLabel: "Call Premium Homes phone number",
      icon: <Phone className="w-5 h-5 sm:w-5 sm:h-5 text-[#d0a65b]" />,
      bgClass:
        "bg-[#05261e] hover:bg-[#083a2e] text-[#fdfdf8] border border-[#d0a65b]/40 hover:border-[#d0a65b] shadow-[#05261e]/50",
      accentBorder: "border-[#d0a65b]/30",
    },
    {
      id: "email",
      label: "Email",
      subtitle: "info@dpremiumhomes.com",
      href: "mailto:info@dpremiumhomes.com",
      isExternal: false,
      ariaLabel: "Send email to Premium Homes",
      icon: <Mail className="w-5 h-5 sm:w-5 sm:h-5 text-[#d0a65b]" />,
      bgClass:
        "bg-[#07352b] hover:bg-[#0c4e40] text-[#fdfdf8] border border-[#d0a65b]/40 hover:border-[#d0a65b] shadow-[#07352b]/50",
      accentBorder: "border-[#d0a65b]/30",
    },
  ];

  return (
    <div
      className="fixed bottom-12 sm:bottom-14 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 select-none pointer-events-auto"
      role="region"
      aria-label="Floating Contact Options"
    >
      {contactActions.map((action) => {
        const isHovered = activeTooltip === action.id;

        return (
          <div
            key={action.id}
            className="relative flex items-center justify-end group"
            onMouseEnter={() => setActiveTooltip(action.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {/* Tooltip on Desktop */}
            <div
              className={`absolute right-14 sm:right-16 whitespace-nowrap px-3.5 py-1.5 rounded-lg bg-[#05261e]/95 backdrop-blur-md border border-[#d0a65b]/30 text-white shadow-xl transition-all duration-300 pointer-events-none hidden md:flex flex-col items-end ${
                isHovered
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-2 scale-95"
              }`}
            >
              <span className="text-xs font-semibold text-[#d0a65b] tracking-wider uppercase">
                {action.label}
              </span>
              <span className="text-[11px] font-medium text-white/90">
                {action.subtitle}
              </span>
              {/* Arrow */}
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#05261e] border-t border-r border-[#d0a65b]/30" />
            </div>

            {/* Floating Action Button */}
            <a
              href={action.href}
              target={action.isExternal ? "_blank" : undefined}
              rel={action.isExternal ? "noopener noreferrer" : undefined}
              aria-label={action.ariaLabel}
              className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-300 transform active:scale-95 group-hover:scale-110 group-hover:shadow-2xl cursor-pointer ${action.bgClass}`}
            >
              {action.icon}
            </a>
          </div>
        );
      })}
    </div>
  );
}
