import Image from "next/image";
import { IconCard, type IconCardItem } from "@/components/section/shared/icon_card";
import { Appear } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";

type Department = IconCardItem & { email: string; phone: string };

const DEPARTMENTS: Department[] = [
  {
    icon: "/contact/icons/chat-bubble-user.svg",
    title: "Client Experience Department",
    email: "experience@dpremiumhomes.com",
    phone: "+880 1958-253342",
  },
  {
    icon: "/contact/icons/human-resources.svg",
    title: "Human Resources Department",
    email: "career@dpremiumhomes.com",
    phone: "+880 1335-258340",
  },
  {
    icon: "/contact/icons/legal.svg",
    title: "Land & Legal Affairs Department",
    email: "legal.affairs@dpremiumhomes.com",
    phone: "+8801958253300",
  },
];

/** One mail or phone line of a department card: a 24px icon and a link that greens on hover. */
function ContactLine({ icon, href, children }: { icon: string; href: string; children: string }) {
  return (
    <a href={href} className="flex items-center gap-3 text-[16px] leading-[1.6] text-sage transition-colors duration-300 hover:text-green">
      <Image src={icon} alt="" width={24} height={24} className="size-6 shrink-0" />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </a>
  );
}

/** Figma "Find the Right Department": a heading row over three department cards with direct lines. */
export function ContactDepartments() {
  return (
    <section aria-label="Departments" className="bg-warm pb-[clamp(64px,7.5vw,120px)] pt-[clamp(56px,5vw,80px)]">
      <div className="shell flex flex-col gap-[clamp(32px,3.5vw,56px)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow className="text-green">Departments</Eyebrow>
            <Heading size={64} min={36} leading={1.1} mask>
              Find the right department
            </Heading>
          </div>
          <Appear as="p" preset="lift" delay={0.3} className="max-w-[480px] text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-sage">
            Contact the relevant team directly for faster and more personalised assistance.
          </Appear>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          {DEPARTMENTS.map((dept, i) => (
            // Figma: white cards straight on the warm band, so no warm hover fill.
            <IconCard key={dept.title} item={dept} index={i} className="border-transparent hover:bg-white">
              <div className="flex flex-col gap-3">
                <ContactLine icon="/contact/icons/mail.svg" href={`mailto:${dept.email}`}>
                  {dept.email}
                </ContactLine>
                <ContactLine icon="/faq/icons/call.svg" href={`tel:${dept.phone.replace(/[^\d+]/g, "")}`}>
                  {dept.phone}
                </ContactLine>
              </div>
            </IconCard>
          ))}
        </div>
      </div>
    </section>
  );
}
