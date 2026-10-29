import { HomeCta } from "@/components/section/home/home_cta";

const PHOTO = "/image/life-at-tphl/tphl-team07.png";

/** Figma "CTA" on the About page: the home call-to-action card, pointed at careers. */
export function AboutCareerCta() {
  return (
    <HomeCta
      id="career"
      eyebrow="Career"
      title="Start Your Career Journey With Us"
      cta={{ label: "join the team", href: "/careers" }}
      background={{ src: PHOTO, alt: "", className: "object-cover object-[center_35%]" }}
      card={{ src: PHOTO, alt: "TPHL executives discussing career plans", className: "object-cover object-[center_42%]" }}
    />
  );
}
