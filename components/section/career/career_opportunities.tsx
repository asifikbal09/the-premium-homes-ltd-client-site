"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  salaryRange: string;
  deadline: string;
}

const INITIAL_JOBS: JobVacancy[] = [
  {
    id: "job-1",
    title: "Business Analysts",
    department: "Analytics & Strategy",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "100k - 150k",
    deadline: "Feb 28, 2025",
  },
  {
    id: "job-2",
    title: "Accounts",
    department: "Finance & Accounts",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "100k - 150k",
    deadline: "Feb 28, 2025",
  },
  {
    id: "job-3",
    title: "Executive Assistant",
    department: "Executive Office",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "100k - 150k",
    deadline: "Feb 28, 2025",
  },
  {
    id: "job-4",
    title: "Administration",
    department: "Operations & Admin",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "100k - 150k",
    deadline: "Feb 28, 2025",
  },
];

const ADDITIONAL_JOBS: JobVacancy[] = [
  {
    id: "job-5",
    title: "Architectural Project Lead",
    department: "Design & Planning",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "140k - 180k",
    deadline: "Mar 15, 2025",
  },
  {
    id: "job-6",
    title: "Senior Sales Consultant",
    department: "Client Relations",
    location: "Gulshan, Dhaka",
    jobType: "Full Time",
    salaryRange: "90k - 130k",
    deadline: "Mar 20, 2025",
  },
];

const DEPARTMENTS = [
  "ALL DEPARTMENTS",
  "Analytics & Strategy",
  "Finance & Accounts",
  "Executive Office",
  "Operations & Admin",
  "Design & Planning",
  "Client Relations",
];

const EMPLOYMENT_TYPES = ["ALL TYPES", "Full Time", "Part Time", "Contract"];

export function CareerOpportunities() {
  const [selectedDept, setSelectedDept] = useState("ALL DEPARTMENTS");
  const [selectedType, setSelectedType] = useState("ALL TYPES");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Apply Modal state
  const [activeJob, setActiveJob] = useState<JobVacancy | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    note: "",
  });

  const deptRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setIsDeptOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allVacancies = showAll
    ? [...INITIAL_JOBS, ...ADDITIONAL_JOBS]
    : INITIAL_JOBS;

  const filteredJobs = allVacancies.filter((job) => {
    const matchesDept =
      selectedDept === "ALL DEPARTMENTS" || job.department === selectedDept;
    const matchesType =
      selectedType === "ALL TYPES" || job.jobType === selectedType;
    return matchesDept && matchesType;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveJob(null);
      setFormData({ name: "", email: "", phone: "", resume: "", note: "" });
    }, 2500);
  };

  return (
    <section
      id="open-positions"
      aria-label="Current Opportunities"
      className="w-full bg-[#f4f5f6] text-[#1f2723] py-16 sm:py-24 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title matching Image 3 */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-tight tracking-tight">
            Current Opportunities
          </h2>
        </div>

        {/* Filter Pills matching Image 3 */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          {/* Department Filter */}
          <div ref={deptRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDeptOpen((prev) => !prev);
                setIsTypeOpen(false);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer shadow-xs",
                isDeptOpen || selectedDept !== "ALL DEPARTMENTS"
                  ? "bg-white border-[#044133] text-[#044133]"
                  : "bg-white/90 hover:bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400",
              )}
            >
              <span>
                {selectedDept === "ALL DEPARTMENTS"
                  ? "DEPARTMENT"
                  : selectedDept.toUpperCase()}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isDeptOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isDeptOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-40"
                >
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setSelectedDept(dept);
                        setIsDeptOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-medium tracking-wide flex items-center justify-between transition-colors",
                        selectedDept === dept
                          ? "bg-[#f7f5f0] text-[#044133] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      <span>{dept}</span>
                      {selectedDept === dept && (
                        <Check className="w-3.5 h-3.5 text-[#044133]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Employment Type Filter */}
          <div ref={typeRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTypeOpen((prev) => !prev);
                setIsDeptOpen(false);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer shadow-xs",
                isTypeOpen || selectedType !== "ALL TYPES"
                  ? "bg-white border-[#044133] text-[#044133]"
                  : "bg-white/90 hover:bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400",
              )}
            >
              <span>
                {selectedType === "ALL TYPES"
                  ? "EMPLOYMENT TYPE"
                  : selectedType.toUpperCase()}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isTypeOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-40"
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedType(type);
                        setIsTypeOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-medium tracking-wide flex items-center justify-between transition-colors",
                        selectedType === type
                          ? "bg-[#f7f5f0] text-[#044133] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      <span>{type}</span>
                      {selectedType === type && (
                        <Check className="w-3.5 h-3.5 text-[#044133]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Job Cards List matching Image 3 */}
        <div className="space-y-4 sm:space-y-4 md:space-y-5">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center text-neutral-500">
              <p className="text-sm font-light">
                No vacancies found matching your current filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("ALL DEPARTMENTS");
                  setSelectedType("ALL TYPES");
                }}
                className="mt-3 text-xs uppercase tracking-wider font-semibold text-[#044133] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-7 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Title & Metadata columns */}
                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="font-heading text-2xl sm:text-[27px] font-normal text-[#044133] tracking-tight mb-4 sm:mb-5">
                    {job.title}
                  </h3>

                  {/* 4 Metadata Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {/* LOCATION */}
                    <div>
                      <span className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-1">
                        LOCATION
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-neutral-800">
                        {job.location}
                      </span>
                    </div>

                    {/* JOB TYPE */}
                    <div>
                      <span className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-1">
                        JOB TYPE
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-neutral-800">
                        {job.jobType}
                      </span>
                    </div>

                    {/* SALARY RANGE */}
                    <div>
                      <span className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-1">
                        SALARY RANGE
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-neutral-800">
                        {job.salaryRange}
                      </span>
                    </div>

                    {/* DEADLINE */}
                    <div>
                      <span className="block text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-1">
                        DEADLINE
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-neutral-800">
                        {job.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Apply Now Button */}
                <div className="shrink-0 pt-2 lg:pt-0">
                  <Button
                    type="button"
                    onClick={() => setActiveJob(job)}
                    className="inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#03362a] hover:bg-[#054b3c] shadow-xs active:scale-95 transition-all cursor-pointer h-auto border-0"
                  >
                    APPLY NOW
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom: See More Vacancies Button */}
        {!showAll && (
          <div className="text-center mt-10 sm:mt-12">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#3c342b] bg-[#ecddc8] hover:bg-[#e4ceb2] border border-[#d9c4aa] shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>SEE MORE VACANCIES</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Apply Modal Dialog with Framer Motion */}
      <AnimatePresence>
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 border border-neutral-200 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                aria-label="Close modal"
                className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {formSubmitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#044133]/10 text-[#044133] flex items-center justify-center mb-4">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading text-2xl font-normal text-[#044133]">
                    Application Submitted!
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light max-w-xs">
                    Thank you for applying for the {activeJob.title} position.
                    Our HR team will review your application shortly.
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#d0a65b]">
                    APPLY FOR POSITION
                  </span>
                  <h4 className="font-heading text-2xl sm:text-3xl text-[#044133] font-normal mt-1">
                    {activeJob.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">
                    {activeJob.location} • {activeJob.jobType} •{" "}
                    {activeJob.salaryRange}
                  </p>

                  <form
                    onSubmit={handleApplySubmit}
                    className="mt-5 space-y-3.5"
                  >
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-[#044133] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-[#044133] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+880 1700 000000"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-[#044133] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                        Resume / Portfolio Link *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.resume}
                          onChange={(e) =>
                            setFormData({ ...formData, resume: e.target.value })
                          }
                          placeholder="Google Drive link or portfolio URL"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 pl-9 rounded-lg border border-neutral-300 focus:border-[#044133] focus:outline-none"
                        />
                        <Upload className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                        Cover Note (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.note}
                        onChange={(e) =>
                          setFormData({ ...formData, note: e.target.value })
                        }
                        placeholder="Brief note about why you are interested in this role..."
                        className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-neutral-300 focus:border-[#044133] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full py-3 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#044133] hover:bg-[#065b4b] text-white shadow-md cursor-pointer transition-all active:scale-[0.98]"
                      >
                        SUBMIT APPLICATION
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
