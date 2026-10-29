"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { submitContact, type ContactInput } from "@/app/actions/contact";
import { Appear } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import { cn, SETTLE } from "@/lib/utils";

const SUBJECTS = ["Sales Inquiry", "Customer Support", "Project Consultation", "General Inquiry"];

// Figma fields: 18px ink labels 20px above 64px boxes with a #E6E6E6 hairline and 16px text.
const BOX =
  "w-full border border-[#e6e6e6] bg-transparent px-5 text-[16px] leading-[1.5] text-ink transition-colors duration-300 placeholder:text-[#727679] hover:border-sage/50 focus:border-green focus:outline-none";

const fieldId = (name: keyof ContactInput) => `contact-${name}`;

function Field({
  name,
  label,
  delay,
  className,
  children,
}: {
  name: keyof ContactInput;
  label: string;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Appear preset="lift" delay={delay} className={cn("flex flex-col gap-5", className)}>
      <label htmlFor={fieldId(name)} className="trim text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-ink">
        {label}
      </label>
      {children}
    </Appear>
  );
}

/**
 * Figma "Send Us a Message": a warm card on a sand band. Fields fade up one after another; the
 * message goes to POST /contacts and the form clears once it is accepted, with the answer shown
 * under the button and in a toast.
 */
export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Omit<ContactInput, "source">;
    setStatus(null);
    startTransition(async () => {
      const result = await submitContact({ ...values, source: "contact_page" });
      if (result.success) {
        form.reset();
        toast.success(result.message);
        setStatus({ ok: true, text: result.message });
      } else {
        toast.error(result.error);
        setStatus({ ok: false, text: result.error });
      }
    });
  };

  return (
    <section aria-label="Send us a message" className="bg-[#e0d1b6] py-[clamp(48px,5vw,80px)]">
      <div className="shell">
        <Appear
          preset="rise"
          className="mx-auto flex max-w-[1195px] flex-col gap-[clamp(32px,3.5vw,56px)] bg-warm px-[clamp(20px,3vw,48px)] py-[clamp(28px,2.5vw,40px)]"
        >
          <Heading size={48} min={32} leading={1.1} mask>
            Send us a message
          </Heading>

          <form onSubmit={onSubmit} className="relative grid gap-6 md:grid-cols-2">
            <Field name="name" label="Name*" delay={0.1}>
              <input id={fieldId("name")} name="name" type="text" required autoComplete="name" placeholder="Enter your Name" className={cn(BOX, "h-16")} />
            </Field>
            <Field name="email" label="Email Address*" delay={0.16}>
              <input id={fieldId("email")} name="email" type="email" required autoComplete="email" placeholder="Enter your Email Address" className={cn(BOX, "h-16")} />
            </Field>
            <Field name="phone" label="Phone*" delay={0.22}>
              <input id={fieldId("phone")} name="phone" type="tel" required autoComplete="tel" placeholder="Enter your phone number" className={cn(BOX, "h-16")} />
            </Field>
            <Field name="subject" label="Subject*" delay={0.28}>
              <div className="relative">
                <select id={fieldId("subject")} name="subject" required defaultValue={SUBJECTS[0]} className={cn(BOX, "peer h-16 cursor-pointer appearance-none pr-14")}>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <Image
                  src="/contact/icons/chevron-down.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none absolute right-5 top-1/2 size-6 -translate-y-1/2 transition-transform duration-500 ease-out-expo peer-focus:rotate-180"
                />
              </div>
            </Field>
            <Field name="message" label="Message" delay={0.34} className="md:col-span-2">
              <textarea id={fieldId("message")} name="message" rows={5} placeholder="Write your message here" className={cn(BOX, "h-[172px] resize-y py-4")} />
            </Field>

            <Appear preset="lift" delay={0.4} className="flex flex-col gap-4 md:col-span-2">
              <GreenPill type="submit" disabled={pending} size="lg" arrow className="w-full justify-center">
                {pending ? "Sending…" : "Send your message"}
              </GreenPill>
              <div aria-live="polite">
                <AnimatePresence>
                  {status && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: SETTLE }}
                      className={cn("text-center text-[14px] leading-[1.5]", status.ok ? "text-green" : "text-red-700")}
                    >
                      {status.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Appear>
          </form>
        </Appear>
      </div>
    </section>
  );
}
