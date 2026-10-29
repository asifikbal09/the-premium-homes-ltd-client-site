"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GreenPill } from "@/components/ui/primitives";
import { SectionIntro } from "@/components/section/shared/section_intro";
import { cn, SETTLE } from "@/lib/utils";

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
  { id: "job-1", title: "Business Analysts", department: "Analytics & Strategy", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "100k - 150k", deadline: "Feb 28, 2025" },
  { id: "job-2", title: "Accounts", department: "Finance & Accounts", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "100k - 150k", deadline: "Feb 28, 2025" },
  { id: "job-3", title: "Executive Assistant", department: "Executive Office", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "100k - 150k", deadline: "Feb 28, 2025" },
  { id: "job-4", title: "Administration", department: "Operations & Admin", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "100k - 150k", deadline: "Feb 28, 2025" },
];

const ADDITIONAL_JOBS: JobVacancy[] = [
  { id: "job-5", title: "Architectural Project Lead", department: "Design & Planning", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "140k - 180k", deadline: "Mar 15, 2025" },
  { id: "job-6", title: "Senior Sales Consultant", department: "Client Relations", location: "Gulshan, Dhaka", jobType: "Full Time", salaryRange: "90k - 130k", deadline: "Mar 20, 2025" },
];

/** `null` means "no filter": the pill then shows its own label. */
const FILTERS = {
  department: {
    label: "Department",
    options: ["Analytics & Strategy", "Finance & Accounts", "Executive Office", "Operations & Admin", "Design & Planning", "Client Relations"],
  },
  jobType: { label: "Employment Type", options: ["Full Time", "Part Time", "Contract"] },
} as const;
type FilterKey = keyof typeof FILTERS;

const META: { label: string; key: keyof JobVacancy }[] = [
  { label: "Location", key: "location" },
  { label: "Job type", key: "jobType" },
  { label: "Salary Range", key: "salaryRange" },
  { label: "Deadline", key: "deadline" },
];

const EMPTY_FORM = { name: "", email: "", phone: "", resume: "", note: "" };

/** Outlined filter pill with a menu; the chevron turns while it is open. */
function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const choose = (option: string | null) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "press flex h-12 items-center gap-6 rounded-full border px-6 text-[14px] font-medium uppercase tracking-[2px]",
          value || open ? "border-green text-green" : "border-chip text-sage hover:border-green/40",
        )}
      >
        <span className="trim leading-[1.7]">{value ?? label}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/career/icons/chevron-down.svg"
          alt=""
          className={cn("transition-transform duration-300 ease-out-expo", open ? "-rotate-90" : "rotate-90")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: SETTLE }}
            className="absolute left-0 top-full z-40 mt-2 w-60 origin-top-left overflow-hidden rounded-2xl border border-chip bg-white py-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.2)]"
          >
            {[null, ...options].map((option) => (
              <li key={option ?? "all"}>
                <button
                  type="button"
                  onClick={() => choose(option)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-warm",
                    option === value ? "font-medium text-green" : "text-sage",
                  )}
                >
                  {option ?? `All ${label.toLowerCase()}s`}
                  {option === value && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Figma job row: title over four label / value columns, "Apply now" at the far right. */
function JobCard({ job, index, onApply }: { job: JobVacancy; index: number; onApply: () => void }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ type: "spring", bounce: 0, duration: 0.9, delay: index * 0.08 }}
      className="group flex flex-col gap-7 bg-white p-6 transition-shadow duration-500 hover:shadow-[0_18px_40px_-20px_rgba(5,75,60,0.25)]"
    >
      <h3 className="font-display text-[clamp(24px,1.75vw,28px)] font-medium capitalize leading-[1.1] text-green">{job.title}</h3>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:flex md:gap-[clamp(32px,8.75vw,140px)]">
          {META.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-4 md:w-[170px]">
              <dt className="trim text-[14px] uppercase leading-[1.7] tracking-[2px] text-[#727679]">{label}</dt>
              <dd className="trim text-[18px] font-medium capitalize leading-[0.7] tracking-[-0.36px] text-ink">{job[key]}</dd>
            </div>
          ))}
        </dl>
        <GreenPill onClick={onApply} arrow className="h-12 w-[164px] justify-center px-[29px] text-[16px] text-white">
          apply now
        </GreenPill>
      </div>
    </motion.li>
  );
}

const FIELD_LABEL = "text-[12px] font-medium uppercase tracking-[1.5px] text-sage";
const FIELD_CONTROL =
  "w-full rounded-lg border border-chip px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-green";

function Field({
  label,
  className,
  ...input
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className={FIELD_LABEL}>{label}</span>
      <input {...input} className={FIELD_CONTROL} />
    </label>
  );
}

function ApplyModal({ job, onClose }: { job: JobVacancy; onClose: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const bind = (key: keyof typeof EMPTY_FORM) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(onClose, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-lenis-prevent>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-green-deep/70 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${job.title}`}
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.35, ease: SETTLE }}
        className="relative w-full max-w-lg bg-white p-6 sm:p-8"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 text-sage transition-colors hover:text-green">
          <X className="size-5" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="mb-4 grid size-14 place-items-center rounded-full bg-green/10 text-green">
              <Check className="size-7" />
            </span>
            <h4 className="font-display text-[28px] font-medium text-green">Application Submitted!</h4>
            <p className="mt-2 max-w-xs text-[14px] text-sage">
              Thank you for applying for the {job.title} position. Our HR team will review your application shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[14px] font-medium uppercase tracking-[2px] text-gold">Apply for position</p>
            <h4 className="mt-1 font-display text-[clamp(24px,2vw,32px)] font-medium text-green">{job.title}</h4>
            <p className="mt-1 text-[13px] text-sage">
              {job.location} • {job.jobType} • {job.salaryRange}
            </p>
            <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name *" required placeholder="John Doe" className="sm:col-span-2" {...bind("name")} />
              <Field label="Email Address *" type="email" required placeholder="john@example.com" {...bind("email")} />
              <Field label="Phone Number *" type="tel" required placeholder="+880 1700 000000" {...bind("phone")} />
              <div className="relative sm:col-span-2">
                <Field label="Resume / Portfolio Link *" required placeholder="Google Drive link or portfolio URL" {...bind("resume")} />
                <Upload className="pointer-events-none absolute right-3.5 top-[38px] size-4 text-sage" />
              </div>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={FIELD_LABEL}>Cover Note (Optional)</span>
                <textarea
                  rows={3}
                  placeholder="Brief note about why you are interested in this role..."
                  className={cn(FIELD_CONTROL, "resize-none")}
                  {...bind("note")}
                />
              </label>
              <button
                type="submit"
                className="press mt-2 h-12 rounded-full bg-green text-[14px] font-medium uppercase tracking-[2px] text-gold sm:col-span-2"
              >
                Submit Application
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export function CareerOpportunities() {
  const [filters, setFilters] = useState<Record<FilterKey, string | null>>({ department: null, jobType: null });
  const [showAll, setShowAll] = useState(false);
  const [activeJob, setActiveJob] = useState<JobVacancy | null>(null);

  const jobs = (showAll ? [...INITIAL_JOBS, ...ADDITIONAL_JOBS] : INITIAL_JOBS).filter((job) =>
    (Object.keys(filters) as FilterKey[]).every((key) => !filters[key] || job[key] === filters[key]),
  );

  return (
    <section id="open-positions" aria-label="Current opportunities" className="scroll-mt-20 bg-[#f5f6f7] py-[clamp(64px,7.5vw,120px)]">
      <div className="shell flex flex-col items-center gap-12">
        <div className="flex w-full flex-col items-center gap-8">
          <SectionIntro title="Current Opportunities" />
          <div className="flex flex-wrap justify-center gap-4">
            {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
              <FilterDropdown
                key={key}
                {...FILTERS[key]}
                value={filters[key]}
                onChange={(value) => setFilters((f) => ({ ...f, [key]: value }))}
              />
            ))}
          </div>
        </div>

        <ul className="flex w-full flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i % 4} onApply={() => setActiveJob(job)} />
            ))}
          </AnimatePresence>
          {jobs.length === 0 && (
            <li className="bg-white p-10 text-center text-[16px] text-sage">
              No vacancies match these filters.{" "}
              <button
                type="button"
                onClick={() => setFilters({ department: null, jobType: null })}
                className="font-medium text-green underline-offset-4 hover:underline"
              >
                Reset filters
              </button>
            </li>
          )}
        </ul>

        {!showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="press relative h-14 rounded-full border border-gold bg-gold/15 px-10 text-[14px] font-medium uppercase tracking-[2px] text-[#2f3233] shadow-[0_12px_20px_0_rgba(108,73,19,0.1),inset_0_7px_21px_0_rgba(255,255,255,0.27),inset_0_-6px_21px_0_rgba(207,165,100,0.07)] backdrop-blur-[50px] hover:bg-gold/25 hover:tracking-[2.6px]"
          >
            <span className="trim leading-[1.7]">See more vacancies</span>
          </button>
        )}
      </div>

      <AnimatePresence>{activeJob && <ApplyModal key={activeJob.id} job={activeJob} onClose={() => setActiveJob(null)} />}</AnimatePresence>
    </section>
  );
}
