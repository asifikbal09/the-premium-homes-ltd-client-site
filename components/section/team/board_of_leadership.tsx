"use client";

import Image from "next/image";
import { Appear, Shutter } from "@/components/ui/motion";
import { SectionIntro } from "@/components/section/shared/section_intro";

type Leader = { name: string; role: string; image: string };

/** `null` is an empty cell of the staggered 4-column desktop grid. */
const GRID: (Leader | null)[] = [
  // Row 1
  { name: "Md. Mainul Hasan Dulon", role: "Managing Director & CEO", image: "/image/team/MdMaminulHasanDulon.png" },
  { name: "Md. Ejaj-Ur-Rahman", role: "Deputy CEO & Director", image: "/image/team/MdEjazUrRahman.png" },
  null,
  { name: "Md. Rayhan Bhuiyan", role: "COO & Director", image: "/image/team/MdRayhanBhuiyan.png" },
  // Row 2
  null,
  { name: "Mahbuba Reza, CPA", role: "Director", image: "/image/team/MahbubaRezaCPA.png" },
  { name: "Monsur Alam Munna", role: "Director, P&D", image: "/image/team/MonsurAlamMunna.png" },
  { name: "Mahfuza Shikder Tanha", role: "Director", image: "/image/team/MahfuzaShikderTanha.png" },
  // Row 3
  { name: "Brigadier General Md. Muniruzzaman, ndc, psc (Retd)", role: "Project Director", image: "/image/team/BrigadierGeneralMdMuniruzzamanNdcPscRetd.png" },
  null,
  { name: "Mehedi H. Jony", role: "Head of IT & Digital Marketing", image: "/image/team/MehediHJonyBoss.png" },
  { name: "Alfesani Shuvo", role: "Head of Operations & Control", image: "/image/team/AlfaaniShuvo.png" },
  // Row 4
  null,
  { name: "M Tawhidur Rahman", role: "Head of Human Resources", image: "/image/team/MdTawhidurRahman.png" },
  { name: "Md. Golam Imran", role: "Head of Client Experience", image: "/image/team/MdGolamImam.png" },
];

/** Portrait opens with the shutter, then name and role fade up. Staggered by column so a row reads left to right. */
function LeaderCard({ leader, column }: { leader: Leader; column: number }) {
  const delay = column * 0.1;
  return (
    <div className="group flex flex-col gap-5">
      <Shutter delay={delay} className="relative aspect-[315/372] w-full bg-[#e9e1d6]">
        <div className="zoom-frame relative size-full">
          <div className="absolute inset-0">
            <Image
              src={leader.image}
              alt={leader.name}
              fill
              sizes="(min-width: 1024px) 20vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Shutter>
      <Appear preset="lift" delay={delay + 0.35} className="flex flex-col gap-4">
        <h3 className="trim font-display text-[clamp(18px,1.5vw,24px)] font-medium leading-[1.5] text-green">
          {leader.name}
        </h3>
        <p className="text-[clamp(14px,1vw,16px)] leading-[1.2] text-sage">{leader.role}</p>
      </Appear>
    </div>
  );
}

export function BoardOfLeadership() {
  return (
    <section aria-label="Board of Leadership" className="bg-white py-[clamp(64px,5vw,80px)]">
      <div className="shell flex flex-col gap-[clamp(56px,7.5vw,120px)]">
        <SectionIntro
          title="Board of Leadership"
          copy="Dedicated professionals committed to delivering excellence in every project we undertake."
          copyWidth={442}
        />
        {/* Figma: four 315px columns across 1440 with 60px gutters; rows 80px apart. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-[clamp(24px,3.75vw,60px)] lg:gap-y-[clamp(48px,5vw,80px)]">
          {GRID.map((leader, i) =>
            leader ? (
              <LeaderCard key={leader.name} leader={leader} column={i % 4} />
            ) : (
              <div key={`gap-${i}`} aria-hidden className="hidden lg:block" />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
