"use client";

import { CheckCircle, FileUp, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Appear, Shutter } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import { cn, fluid } from "@/lib/utils";

// Figma fields: 24px Vazirmatn labels and values, 24px padding, #E6E6E6 hairline.
const TEXT = { fontSize: fluid(24, 16) };
const LABEL = "block leading-[1.2] text-green";
const BOX = "w-full border border-[#e6e6e6] bg-white p-[clamp(14px,1.5vw,24px)] leading-[1.2] text-green transition-colors duration-300";

function Field({
  id,
  label,
  delay,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; delay: number }) {
  return (
    <Appear preset="lift" delay={delay} className="flex flex-1 flex-col gap-[clamp(10px,1.25vw,20px)]">
      <label htmlFor={id} className={LABEL} style={TEXT}>
        {label}
      </label>
      <input
        id={id}
        required
        {...input}
        className={cn(BOX, "placeholder:text-sage hover:border-sage/60 focus:border-green focus:outline-none")}
        style={TEXT}
      />
    </Appear>
  );
}

/** Figma "Join the team": portrait on the left, application form on the right. */
export function LifeAtTphlJoinTeam() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setResumeFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please attach your resume (PDF/DOC) before submitting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Application submitted successfully! Our HR team will review your resume and contact you soon.");
      setFullName("");
      setPhone("");
      setEmail("");
      setResumeFile(null);
    }, 1000);
  };

  return (
    <section id="join-team" aria-label="Join the team" className="bg-white py-[clamp(56px,6.25vw,100px)]">
      <div className="shell flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <Shutter className="relative aspect-[537/719] w-full max-w-[537px] max-lg:aspect-[4/3] max-lg:max-w-none lg:w-[37.3%] lg:shrink-0">
          <div className="absolute inset-0">
            <Image src="/image/life-at-tphl/tphl-team07.png" alt="Two TPHL colleagues reviewing notes together" fill sizes="(min-width: 1024px) 537px, 92vw" className="object-cover" />
          </div>
        </Shutter>

        <form ref={formRef} onSubmit={handleSubmit} className="flex min-w-0 flex-1 flex-col items-start gap-[clamp(28px,3vw,48px)]">
          <Heading size={64} min={40} leading={1.1} mask>
            Join the team
          </Heading>

          <div className="flex w-full">
            <Field id="full-name" label="Full Name*" placeholder="Enter full name*" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} delay={0.1} />
          </div>
          <div className="flex w-full flex-col gap-[clamp(28px,3vw,48px)] sm:flex-row sm:gap-3">
            <Field id="phone-number" label="Phone Number*" placeholder="+880 435 615 6873" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} delay={0.18} />
            <Field id="email-address" label="E-mail Address*" placeholder="Enter your e-mail address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} delay={0.26} />
          </div>

          <Appear preset="lift" delay={0.34} className="flex w-full flex-col gap-[clamp(10px,1.25vw,20px)]">
            <span className={LABEL} style={TEXT}>
              Upload Resume*
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                BOX,
                "group flex h-[clamp(96px,7.5vw,120px)] cursor-pointer items-center justify-center gap-2.5 hover:border-green",
                isDragging && "border-green bg-green/5",
              )}
              style={TEXT}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])} className="hidden" />
              {resumeFile ? (
                <>
                  <CheckCircle className="size-6 shrink-0 md:size-8" />
                  <span className="truncate">{resumeFile.name}</span>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="p-1 transition-colors hover:text-[#e5262b]"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <FileUp className="size-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 md:size-8" strokeWidth={1.5} />
                  <span>Drop your resume here</span>
                </>
              )}
            </div>
          </Appear>

          <Appear preset="lift" delay={0.42}>
            <GreenPill onClick={() => !isSubmitting && formRef.current?.requestSubmit()} arrow className="h-12">
              {isSubmitting ? "submitting…" : "submit application"}
            </GreenPill>
          </Appear>
        </form>
      </div>
    </section>
  );
}
