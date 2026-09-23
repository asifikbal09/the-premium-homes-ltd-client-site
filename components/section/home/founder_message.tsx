import React from "react";
import Image from "next/image";

export function FounderMessage() {
  return (
    <section
      id="team"
      aria-label="Founder Statement"
      className="w-full relative overflow-hidden bg-[#06211a] bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,#0f4334_0%,#08271f_60%,#051c16_100%)] text-[#fdfdf8] selection:bg-[#d0a65b]/30 selection:text-white py-10 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12">
        {/* Top Editorial Quote */}
        <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <blockquote className="font-heading font-light text-[#fdfdf8] text-base sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[42px] leading-[1.22] sm:leading-[1.25] tracking-tight">
            {/* Inline Gold Quotation Icon */}
            <span
              className="inline-flex items-center align-baseline text-[#d0a65b] mr-2 sm:mr-3.5 pl-4 sm:pl-10 md:pl-16 lg:pl-24"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 40 32"
                fill="currentColor"
                className="w-4 h-3.5 sm:w-7 sm:h-6 md:w-9 md:h-7 lg:w-10 lg:h-8 shrink-0"
              >
                <path d="M0 19.2C0 8.6 6.8 2 16.4 0l2.6 4.8c-6 1.4-9.6 4.8-10.4 8.6h8.2V32H0V19.2zm23.2 0c0-10.6 6.8-17.2 16.4-19.2l2.6 4.8c-6 1.4-9.6 4.8-10.4 8.6h8.2V32H23.2V19.2z" />
              </svg>
            </span>
            Our Commitment Goes Beyond Delivering Homes. We Are Here To Shape
            Environments Where Families Grow, Connections Thrive, And Legacies
            Are Built.
          </blockquote>
        </div>

        {/* Bottom Section: 2-Column Side-by-Side layout on Desktop AND Mobile */}
        <div className="grid grid-cols-12 gap-3 sm:gap-6 md:gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Founder narrative, signature & designation */}
          <div className="col-span-7 flex flex-col items-start text-left">
            <span className="text-[#d0a65b] font-semibold text-[8px] sm:text-[11px] md:text-xs tracking-[0.2em] uppercase mb-1.5 sm:mb-3 md:mb-4">
              FROM THE FOUNDER
            </span>

            <h2 className="font-heading text-[18px] sm:text-3xl md:text-4xl lg:text-[50px] xl:text-[56px] font-normal text-[#fdfdf8] leading-[1.12] tracking-tight mb-2 sm:mb-4 md:mb-6">
              Built For Trust.
              <br />
              Designed For Life
            </h2>

            <p className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base font-light text-[#e2e8e5]/85 leading-relaxed max-w-lg mb-3 sm:mb-5 md:mb-7">
              At Premium Homes, we believe a home is more than architecture,
              it’s a promise. Every brick we lay, every detail we refine, is
              rooted in craftsmanship, transparency, and a long-term vision for
              thriving communities.
            </p>

            {/* Subtle Divider Line */}
            <div className="w-full max-w-[160px] sm:max-w-[240px] md:max-w-[320px] h-px bg-[#d0a65b]/40 mb-2 sm:mb-3.5 md:mb-5" />

            {/* Founder Signature */}
            <span className="font-signature font-[family-name:var(--font-seaweed-script)] text-[#d0a65b] text-xl sm:text-3xl md:text-4xl lg:text-[42px] leading-none mb-0.5 sm:mb-1 select-none">
              Mainul Hasan Dulon
            </span>

            {/* Founder Designation */}
            <span className="font-sans text-[8px] sm:text-xs md:text-sm font-normal text-[#f5f7f6]/90 tracking-wide">
              Managing Director &amp; CEO
            </span>
          </div>

          {/* Right Column: Framed CEO Portrait */}
          <div className="col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[430px] aspect-[406/524] overflow-hidden shadow-2xl">
              <Image
                src="/image/dolonsir.png"
                alt="Mainul Hasan Dulon - Managing Director & CEO"
                fill
                sizes="(max-width: 768px) 42vw, (max-width: 1200px) 40vw, 430px"
                className="object-cover object-[center_12%]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
