"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Sales Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Sales Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <section
      aria-label="Contact Form Section"
      className="w-full bg-[#d8c7b5] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#faf8f5] rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-14 lg:p-16 shadow-lg border border-[#ede7dc]"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[42px] font-normal text-[#083327] tracking-tight mb-8 sm:mb-10">
            Send Us A Message
          </h2>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-lg bg-[#083c2f]/10 border border-[#083c2f]/20 text-[#083c2f] text-sm"
              >
                Thank you! Your message has been sent successfully. We will get back to you shortly.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 sm:gap-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-[13px] font-medium text-[#1f2723] mb-2"
              >
                Name*
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your Name"
                className="w-full rounded-md bg-[#f4f1ea]/80 border border-[#e4ded2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#1f2723] placeholder:text-[#8a948e] focus:outline-none focus:border-[#083327] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-[13px] font-medium text-[#1f2723] mb-2"
              >
                Email Address*
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your Email Address"
                className="w-full rounded-md bg-[#f4f1ea]/80 border border-[#e4ded2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#1f2723] placeholder:text-[#8a948e] focus:outline-none focus:border-[#083327] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-[13px] font-medium text-[#1f2723] mb-2"
              >
                Phone*
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full rounded-md bg-[#f4f1ea]/80 border border-[#e4ded2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#1f2723] placeholder:text-[#8a948e] focus:outline-none focus:border-[#083327] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-xs sm:text-[13px] font-medium text-[#1f2723] mb-2"
              >
                Subject*
              </label>
              <div className="relative">
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-md bg-[#f4f1ea]/80 border border-[#e4ded2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#1f2723] focus:outline-none focus:border-[#083327] focus:bg-white transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="Sales Inquiry">Sales Inquiry</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Project Consultation">Project Consultation</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#4a5550]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="message"
                className="block text-xs sm:text-[13px] font-medium text-[#1f2723] mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here"
                className="w-full rounded-md bg-[#f4f1ea]/80 border border-[#e4ded2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#1f2723] placeholder:text-[#8a948e] focus:outline-none focus:border-[#083327] focus:bg-white transition-all resize-y"
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-2 sm:mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-4 px-6 bg-[#083c2f] hover:bg-[#062c22] text-[#d0a65b] text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
              >
                {loading ? "SENDING..." : "SEND YOUR MESSAGE"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
