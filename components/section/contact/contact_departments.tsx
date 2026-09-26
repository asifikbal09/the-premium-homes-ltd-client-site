import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Department {
  title: string;
  iconSrc: string;
  email: string;
  phone: string;
}

const DEPARTMENTS: Department[] = [
  {
    title: "Client Experience Department",
    iconSrc: "/icons/contact/chat-bubble-user.png",
    email: "experience@dpremiumhomes.com",
    phone: "+880 1958-253342",
  },
  {
    title: "Human Resources Department",
    iconSrc: "/icons/contact/human-resources.svg",
    email: "career@dpremiumhomes.com",
    phone: "+880 1335-258340",
  },
  {
    title: "Land & Legal Affairs Department",
    iconSrc: "/icons/contact/Vector.svg",
    email: "legal.affairs@dpremiumhomes.com",
    phone: "+8801958253300",
  },
];

export function ContactDepartments() {
  return (
    <section
      aria-label="Departments"
      className="w-full bg-[#f6f2ea] pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-12 border-b border-[#e5dfd2]">
          <div>
            <span className="block text-xs sm:text-[13px] font-semibold tracking-[0.22em] uppercase text-[#083327] mb-3">
              DEPARTMENTS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#083327] tracking-tight leading-[1.12]">
              Find The Right Department
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#55635c] font-light leading-relaxed max-w-sm">
            Contact the relevant team directly for faster and more personalised assistance.
          </p>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.title}
              className="bg-white rounded-xl sm:rounded-2xl p-7 sm:p-9 shadow-sm border border-[#e8e2d4] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Department Icon */}
                <div className="relative h-12 w-12 flex items-center justify-start">
                  <Image
                    src={dept.iconSrc}
                    alt={dept.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl sm:text-[26px] text-[#083327] font-normal leading-snug mt-6 mb-6">
                  {dept.title}
                </h3>
              </div>

              {/* Contact Info Rows */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#ede7dc]">
                {/* Email */}
                <Link
                  href={`mailto:${dept.email}`}
                  className="flex items-center gap-3 text-xs sm:text-sm text-[#44524b] hover:text-[#083327] transition-colors group"
                >
                  <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                    <Image
                      src="/icons/contact/mail.svg"
                      alt="Email icon"
                      width={16}
                      height={13}
                      className="opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="truncate">{dept.email}</span>
                </Link>

                {/* Phone */}
                <Link
                  href={`tel:${dept.phone}`}
                  className="flex items-center gap-3 text-xs sm:text-sm text-[#44524b] hover:text-[#083327] transition-colors group"
                >
                  <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                    <Image
                      src="/icons/contact/call.svg"
                      alt="Phone icon"
                      width={15}
                      height={15}
                      className="opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span>{dept.phone}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
