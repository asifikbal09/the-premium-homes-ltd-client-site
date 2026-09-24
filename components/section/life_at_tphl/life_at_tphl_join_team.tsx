"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FileUp, CheckCircle, X } from "lucide-react";

export function LifeAtTphlJoinTeam() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFullName("");
      setPhone("");
      setEmail("");
      setResumeFile(null);
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section
      aria-label="Join The Team Application"
      className="relative w-full bg-white text-[#1f2723] py-14 sm:py-20 md:py-24 lg:py-28 overflow-hidden select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Photo of Two Executives Discussing Plans */}
          <div className="lg:col-span-5 w-full">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 shadow-sm">
              <Image
                src="/image/life-at-tphl/tphl-team07.png"
                alt="Two senior TPHL executives collaborating in office"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            {/* Title */}
            <h2 className="font-heading font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#054b3c] leading-[1.08] tracking-tight mb-6 sm:mb-8">
              Join The Team
            </h2>

            {/* Application Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4 sm:space-y-5"
            >
              {/* Full Name Field */}
              <div className="w-full">
                <label
                  htmlFor="full-name"
                  className="block text-xs sm:text-[13px] font-medium text-[#054b3c] mb-1.5"
                >
                  Full Name*
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name*"
                  className="w-full px-4 py-2.5 sm:py-3 bg-white border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#054b3c] transition-colors rounded-none"
                />
              </div>

              {/* Phone Number & E-mail Address (Two Columns on sm+) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Phone Number */}
                <div className="w-full">
                  <label
                    htmlFor="phone-number"
                    className="block text-xs sm:text-[13px] font-medium text-[#054b3c] mb-1.5"
                  >
                    Phone Number*
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 435 615 6873"
                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#054b3c] transition-colors rounded-none"
                  />
                </div>

                {/* E-mail Address */}
                <div className="w-full">
                  <label
                    htmlFor="email-address"
                    className="block text-xs sm:text-[13px] font-medium text-[#054b3c] mb-1.5"
                  >
                    E-mail Address*
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your e-mail address"
                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#054b3c] transition-colors rounded-none"
                  />
                </div>
              </div>

              {/* Upload Resume Dropzone Field */}
              <div className="w-full">
                <label className="block text-xs sm:text-[13px] font-medium text-[#054b3c] mb-1.5">
                  Upload Resume*
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full h-20 sm:h-24 border ${
                    isDragging
                      ? "border-[#054b3c] bg-[#054b3c]/5"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  } flex items-center justify-center cursor-pointer transition-colors duration-200 px-4`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFile ? (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#054b3c]">
                      <CheckCircle className="w-4 h-4 text-[#054b3c]" />
                      <span className="truncate max-w-[240px] sm:max-w-xs font-medium">
                        {resumeFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="p-1 hover:text-red-500 transition-colors ml-1"
                        aria-label="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-[#054b3c]">
                      <FileUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#054b3c]" />
                      <span className="text-xs sm:text-sm font-normal">
                        Drop your resume here
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#d0a65b] bg-[#054b3c] hover:bg-[#075947] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  <span>
                    {isSubmitted
                      ? "APPLICATION SUBMITTED"
                      : "SUBMIT APPLICATION"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
