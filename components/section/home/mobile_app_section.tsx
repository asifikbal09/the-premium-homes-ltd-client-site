import React from "react";
import Image from "next/image";
import appImage from "@/public/image/apps/apps_showcase.png";

function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 170"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.43-5.67-8.6-10.1-18.49-13.29-29.68-3.19-11.19-4.79-22.1-4.79-32.74 0-14.56 3.69-26.68 11.06-36.36 7.37-9.68 16.89-14.65 28.56-14.92 5.03 0 10.51 1.34 16.44 4.02 5.93 2.68 9.77 4.07 11.52 4.17 1.48 0 5.43-1.42 11.85-4.26 6.42-2.84 12.02-4.06 16.8-3.66 12.55.93 22.42 5.48 29.62 13.65-10.98 6.64-16.32 15.73-16.03 27.27.3 9.4 3.96 17.26 10.99 23.58 7.02 6.32 15.35 10.02 24.98 11.1-2.22 6.77-5.01 13.91-8.35 21.43zM119.22 33.64c0-7.3 2.66-14.07 7.98-20.31 5.32-6.24 11.83-10.23 19.53-11.97.98 7.33-1.29 14.28-6.8 20.85-5.51 6.57-12.41 10.51-20.71 11.43z" />
    </svg>
  );
}

function GooglePlayIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path
        fill="#00C3FF"
        d="M38.6 13.6C34.7 17.8 32.5 24.2 32.5 32.6v446.8c0 8.4 2.2 14.8 6.1 19l243.3-242.7L38.6 13.6z"
      />
      <path
        fill="#00E676"
        d="M362.4 179.6l-80.4 76.1 80.4 76.1 107-61.9c16.3-9.4 16.3-24.8 0-34.2l-107-56.1z"
      />
      <path
        fill="#FF3D00"
        d="M282 255.7L38.6 498.4c5.9 6.2 15.4 7 26.6.6l297.2-167.2-80.4-76.1z"
      />
      <path
        fill="#FFD600"
        d="M282 255.7l80.4-76.1L65.2 12.4c-11.2-6.4-20.7-5.6-26.6.6L282 255.7z"
      />
    </svg>
  );
}

export function MobileAppSection() {
  return (
    <section
      aria-labelledby="mobile-app-heading"
      className="w-full relative overflow-hidden py-14 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 selection:bg-[#d0a65b]/20"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAF1E2 20%, #EED5AA 55%, #CFA564 100%)",
      }}
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Luxury Rounded Dark Emerald Card */}
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[52px] bg-[#07241c] shadow-[0_25px_60px_rgba(0,0,0,0.22)] overflow-hidden lg:overflow-visible lg:min-h-[500px] xl:min-h-[540px] flex flex-col lg:flex-row lg:items-end">
          {/* Subtle Ambient Background Highlight behind Phone */}
          <div
            className="absolute top-0 right-0 w-full lg:w-3/5 h-full pointer-events-none rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[52px] overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, #0e5a47 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Left Content: Editorial Heading & App Store Badges */}
          <div className="w-full lg:w-[48%] xl:w-[45%] p-6 sm:p-10 md:p-12 lg:p-14 xl:p-16 lg:pb-14 xl:pb-16 z-10 flex flex-col justify-end">
            <h2
              id="mobile-app-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-normal text-[#cfa564] leading-[1.12] tracking-tight font-serif"
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
              }}
            >
              Your Dream Home
              <br />
              Is Just A Tap Away
            </h2>

            {/* Store Download Badges */}
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Apple App Store */}
              <a
                href="https://apps.apple.com/us/app/tphl-premium-homes-ltd/id6752620266"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#dadedd] hover:bg-white text-[#1f2723] transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm group select-none cursor-pointer"
                aria-label="Download on the App Store"
              >
                <AppleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1f2723] shrink-0 transition-transform duration-300 group-hover:scale-105" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] sm:text-[9px] font-medium leading-none text-[#1f2723]/80">
                    Download on the
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-tight text-[#1f2723] font-sans -tracking-tight mt-0.5">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.premium_homes.tech&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#dadedd] hover:bg-white text-[#1f2723] transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm group select-none cursor-pointer"
                aria-label="Get it on Google Play"
              >
                <GooglePlayIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-300 group-hover:scale-105" />
                <div className="flex flex-col text-left">
                  <span className="text-[7px] sm:text-[8px] font-semibold leading-none text-[#1f2723]/80 uppercase tracking-wider">
                    GET IT ON
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-tight text-[#1f2723] font-sans -tracking-tight mt-0.5">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Content: Hand holding phone mockup */}
          <div className="w-full lg:w-[52%] xl:w-[55%] flex justify-center lg:justify-end items-end px-4 sm:px-8 lg:px-0 pt-4 lg:pt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] lg:absolute lg:bottom-3 xl:bottom-4 pointer-events-none select-none">
              <Image
                src={appImage}
                alt="Premium Homes Mobile Application Interface"
                width={1200}
                height={978}
                priority
                className="w-full h-auto object-contain md:rounded-br-[54px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
