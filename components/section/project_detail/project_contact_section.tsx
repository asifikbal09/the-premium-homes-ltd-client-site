"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Send, CheckCircle2 } from "lucide-react";

interface ProjectContactSectionProps {
  projectName: string;
}

export function ProjectContactSection({
  projectName,
}: ProjectContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello, I am interested in learning more about ${projectName}. Please connect with me.`,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      aria-label="Get In Touch"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            REACH OUR EXPERTS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1 tracking-tight">
            Get In Touch
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Artistic Sculpture / Interior Decor Image */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] max-h-[560px] rounded-3xl overflow-hidden bg-[#f4efe8] shadow-md border border-[#ede7dc]">
            <Image
              src="/image/prediction/predictionBg.png"
              alt="Artistic luxury living element"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: "Let's Talk" Form */}
          <div className="lg:col-span-7 bg-[#fbf9f5] border border-[#ede7dc] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm">
            <h3 className="font-heading text-3xl sm:text-4xl text-[#044133] font-normal mb-2">
              Let&apos;s Talk
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light mb-8">
              Speak directly with our dedicated real estate concierge regarding
              pricing, unit availability, and on-site visits.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#044133]/20 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#044133] mx-auto" />
                <h4 className="font-heading text-2xl text-[#044133]">
                  Inquiry Received
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for your interest in {projectName}. Our executive
                  team will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#ede7dc] focus:border-[#044133] focus:outline-none text-xs sm:text-sm transition-colors text-gray-800"
                  />
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#ede7dc] focus:border-[#044133] focus:outline-none text-xs sm:text-sm transition-colors text-gray-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#ede7dc] focus:border-[#044133] focus:outline-none text-xs sm:text-sm transition-colors text-gray-800"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
                  >
                    Message / Preferred Visit Time
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#ede7dc] focus:border-[#044133] focus:outline-none text-xs sm:text-sm transition-colors text-gray-800 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#044133] hover:bg-[#055b4b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Submit Request</span>
                    <Send className="w-4 h-4 text-[#d0a65b]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
