"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { ProjectDetail } from "@/lib/projects";
import { submitContact } from "@/app/actions/contact";
import { Appear, Shutter } from "@/components/ui/motion";
import { Heading, GreenPill } from "@/components/ui/primitives";

interface ProjectContactSectionProps {
  project: ProjectDetail;
}

export function ProjectContactSection({ project }: ProjectContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const contactLocation =
    project.location ||
    "House 15, Road 7, Block B\nBashundhara R/A, Dhaka 1229";
  const contactPhone = project.contact_phone || "+971 54 308 6000";
  const contactEmail = project.contact_email || "hello@premiumhomes.com.bd";
  const sideImage = "/image/prediction/predictionBg.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: "Project Consultation",
        message:
          formData.message ||
          `Hello, I am interested in learning more about ${project.name}. Please connect with me.`,
        property_id: String(project.id),
        property_name: project.name,
        source: "project_detail",
      });

      if (result.success) {
        toast.success(result.message);
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <section
      id="contact"
      aria-label="Get in touch"
      className="w-full bg-white py-20 lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-0">
        {/* Top Header + Contact Info Row */}
        <div className="mb-10 lg:mb-12">
          <Heading size={64} min={36} mask className="mb-8 text-green">
            Get in touch
          </Heading>

          <Appear preset="lift">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin
                  className="mt-1 h-8 w-8 shrink-0 text-[#546360] lg:h-10 lg:w-10"
                  strokeWidth={1.5}
                />
                <p className="whitespace-pre-line font-sans text-lg leading-[1.35] text-[#546360] lg:text-[24px] lg:leading-[28.8px]">
                  {contactLocation}
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <Phone
                  className="h-8 w-8 shrink-0 text-[#546360] lg:h-10 lg:w-10"
                  strokeWidth={1.5}
                />
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="font-sans text-lg leading-[1.35] text-[#546360] transition-colors hover:text-green lg:text-[24px] lg:leading-[28.8px]"
                >
                  {contactPhone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <Mail
                  className="h-8 w-8 shrink-0 text-[#546360] lg:h-10 lg:w-10"
                  strokeWidth={1.5}
                />
                <a
                  href={`mailto:${contactEmail}`}
                  className="break-all font-sans text-lg leading-[1.35] text-[#546360] transition-colors hover:text-green lg:text-[24px] lg:leading-[28.8px]"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </Appear>
        </div>

        {/* Horizontal Divider Rule */}
        <div className="mb-12 h-px w-full bg-[#5C5451] lg:mb-16" />

        {/* Bottom 2-Column Layout: Image (537×719) + Form (855px) */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Architectural / Interior Image */}
          <div className="lg:col-span-5">
            <Shutter className="relative aspect-[537/719] w-full max-w-[537px] overflow-hidden bg-[#f4efe8]">
              <Image
                src={sideImage}
                alt={`${project.name} contact showcase`}
                fill
                sizes="(max-width: 1024px) 100vw, 537px"
                className="object-cover"
              />
            </Shutter>
          </div>

          {/* Right Column: "Let's talk" Form */}
          <div className="lg:col-span-7">
            <Heading size={64} min={36} mask className="mb-8 text-green">
              Let’s talk
            </Heading>

            {submitted ? (
              <Appear preset="lift">
                <div className="border border-[#E6E6E6] bg-[#FAF8F5] p-8 sm:p-12">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green" />
                  <h4 className="font-heading text-[32px] font-medium text-green">
                    Inquiry Received
                  </h4>
                  <p className="mt-2 max-w-md font-sans text-base leading-relaxed text-[#546360]">
                    Thank you for your interest in {project.name}. Our property
                    advisory team will connect with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 cursor-pointer font-sans text-sm font-medium uppercase tracking-[0.14em] text-green underline underline-offset-4 hover:text-gold"
                  >
                    Send another message
                  </button>
                </div>
              </Appear>
            ) : (
              <Appear preset="lift" delay={0.08}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2.5 block font-sans text-lg font-normal text-green lg:text-[24px] lg:leading-[28.8px]"
                    >
                      Full Name*
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter full name*"
                      className="h-[60px] w-full border border-[#E6E6E6] bg-white px-5 font-sans text-base text-[#1E1E1E] placeholder:text-[#767676] focus:border-green focus:outline-none lg:h-[67px] lg:text-[18px]"
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-2.5 block font-sans text-lg font-normal text-green lg:text-[24px] lg:leading-[28.8px]"
                      >
                        Phone Number*
                      </label>
                      <div className="flex h-[60px] w-full items-center border border-[#E6E6E6] bg-white focus-within:border-green lg:h-[67px]">
                        <span className="flex h-full items-center gap-2 border-r border-[#E6E6E6] px-4 font-sans text-sm text-[#546360]">
                          <span aria-hidden="true">🇧🇩</span>
                          <span>+880</span>
                        </span>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="01XXX-XXXXXX"
                          className="h-full w-full bg-transparent px-4 font-sans text-base text-[#1E1E1E] placeholder:text-[#767676] focus:outline-none lg:text-[18px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2.5 block font-sans text-lg font-normal text-green lg:text-[24px] lg:leading-[28.8px]"
                      >
                        E-mail Address*
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter your e-mail address"
                        className="h-[60px] w-full border border-[#E6E6E6] bg-white px-5 font-sans text-base text-[#1E1E1E] placeholder:text-[#767676] focus:border-green focus:outline-none lg:h-[67px] lg:text-[18px]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2.5 block font-sans text-lg font-normal text-green lg:text-[24px] lg:leading-[28.8px]"
                    >
                      Message*
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Enter your message"
                      className="h-[180px] w-full resize-none border border-[#E6E6E6] bg-white p-5 font-sans text-base text-[#1E1E1E] placeholder:text-[#767676] focus:border-green focus:outline-none lg:h-[214px] lg:text-[18px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <GreenPill type="submit" disabled={pending} arrow>
                      {pending ? "Sending…" : "send your message"}
                    </GreenPill>
                  </div>
                </form>
              </Appear>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

