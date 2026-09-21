"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-[#05261e] text-[#fdfdf8] selection:bg-[#d0a65b]/30 selection:text-white font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 sm:pb-12">
        {/* Top Section: Newsletter & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Newsletter Subscription */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h3 className="text-xs sm:text-[13px]  tracking-[0.18em] uppercase text-[#d0a65b]">
              SUBSCRIBE NEWSLETTER
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="mt-4 sm:mt-5 max-w-md w-full"
            >
              <div className="relative flex items-center w-full rounded-full bg-[#07352b] border border-[#124d3f] p-1.5 focus-within:border-[#d0a65b]/70 transition-all duration-300 shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Enter your email"
                  className="w-full bg-transparent pl-4 sm:pl-5 pr-3 py-2 text-xs sm:text-sm text-[#fdfdf8] placeholder:text-white/40 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="shrink-0 inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#0e3b32] hover:bg-[#145043] border border-white/10 hover:border-white/25 shadow-sm transition-all duration-300 cursor-pointer active:scale-95"
                >
                  {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                </button>
              </div>
            </form>

            <p className="mt-3.5 text-xs text-white/55 font-light">
              By subscribing you agree with our{" "}
              <Link
                href="#privacy"
                className="underline underline-offset-4 hover:text-[#d0a65b] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Right Columns: Navigation Links & Contact */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {/* SOCIALS */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#d0a65b] mb-4 sm:mb-5">
                SOCIALS
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70">
                {[
                  "Facebook",
                  "Instagram",
                  "X (Twitter)",
                  "TikTok",
                  "Youtube",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-light"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#d0a65b] mb-4 sm:mb-5">
                COMPANY
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70">
                {[
                  { name: "Home", href: "#home" },
                  { name: "Projects", href: "#projects" },
                  { name: "About Us", href: "#about" },
                  { name: "NRB Buyers", href: "#nrb-buyers" },
                  { name: "Investors", href: "#investors" },
                  { name: "News", href: "#news" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-light"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LINKS */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#d0a65b] mb-4 sm:mb-5">
                LINKS
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70">
                {[
                  { name: "Contact Us", href: "#contact" },
                  { name: "Partnerships", href: "#partnerships" },
                  { name: "Careers", href: "#careers" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-light"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT & OFFICE */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#d0a65b] mb-4 sm:mb-5">
                CONTACT
              </h4>
              <div className="space-y-2 text-xs sm:text-[13px] text-white/70 font-light">
                <p>
                  <a
                    href="tel:+971543086000"
                    className="hover:text-[#d0a65b] transition-colors block"
                  >
                    +971 54 308 6000
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:hello@premiumhomes.com.bd"
                    className="hover:text-[#d0a65b] transition-colors block break-all"
                  >
                    hello@premiumhomes.com.bd
                  </a>
                </p>
              </div>

              <h4 className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#d0a65b] mt-5 sm:mt-6 mb-2">
                OFFICE:
              </h4>
              <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light">
                House 15, Road 7, Block B<br />
                Bashundhara R/A, Dhaka 1229
              </p>
            </div>
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="my-12 sm:my-16 border-t border-[#0e483b]" />

        {/* Middle Section: Big Logo & TPH Properties Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Brand Logo */}
          <div className="lg:col-span-7">
            <div className="relative h-12 sm:h-14 md:h-16 w-56 sm:w-64 md:w-80">
              <Image
                src="/image/logo.png"
                alt="Premium Homes"
                fill
                sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 320px"
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Right: TPH Properties & Direct Inquiries (Left-aligned as in reference) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <h3 className="text-xl sm:text-2xl font-normal tracking-[0.06em] text-[#d0a65b]">
              TPH PROPERTIES
            </h3>
            <p className="text-xs sm:text-sm text-white/75 mt-1.5 max-w-lg font-light leading-relaxed">
              A Regional Real Estate Developer Building Communities With Vision,
              Precision, And Purpose.
            </p>

            <a
              href="mailto:hello@premiumhomes.com.bd"
              className="text-xl sm:text-2xl md:text-3xl text-[#fdfdf8] hover:text-[#d0a65b] transition-colors duration-300 mt-3 sm:mt-4 block tracking-tight"
            >
              hello@premiumhomes.com.bd
            </a>
            <a
              href="tel:+8801794621487"
              className="text-sm sm:text-base text-white/85 hover:text-[#d0a65b] transition-colors duration-300 mt-1 block"
            >
              +8801794 - 621 487
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-[#0e483b]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45 font-light">
          <p>© 2026 TPH. All right reserved</p>
          <div className="flex items-center gap-6">
            <Link
              href="#terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms
            </Link>
            <span>,</span>
            <Link
              href="#privacy"
              className="hover:text-white transition-colors duration-200 -ml-4"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
