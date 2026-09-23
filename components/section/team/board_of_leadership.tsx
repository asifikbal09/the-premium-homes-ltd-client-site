import React from "react";
import Image from "next/image";

interface LeaderMember {
  id: string;
  name: string;
  role: string;
  image: string;
  isSpacer?: false;
}

interface SpacerSlot {
  id: string;
  isSpacer: true;
}

type GridSlot = LeaderMember | SpacerSlot;

// 16-slot grid replicating the luxury staggered layout in Image 2
const LEADERSHIP_GRID: GridSlot[] = [
  // --- ROW 1 ---
  {
    id: "lead-1",
    name: "Md. Mainul Hasan Dulon",
    role: "Managing Director & CEO",
    image: "/image/team/MdMaminulHasanDulon.png",
  },
  {
    id: "lead-2",
    name: "Md. Ejaj-Ur-Rahman",
    role: "Deputy CEO & Director",
    image: "/image/team/MdEjazUrRahman.png",
  },
  {
    id: "spacer-r1-c3",
    isSpacer: true,
  },
  {
    id: "lead-3",
    name: "Md. Rayhan Bhuiyan",
    role: "COO & Director",
    image: "/image/team/MdRayhanBhuiyan.png",
  },

  // --- ROW 2 ---
  {
    id: "spacer-r2-c1",
    isSpacer: true,
  },
  {
    id: "lead-4",
    name: "Mahbuba Reza, CPA",
    role: "Director",
    image: "/image/team/MahbubaRezaCPA.png",
  },
  {
    id: "lead-5",
    name: "Monsur Alam Munna",
    role: "Director, P&D",
    image: "/image/team/MonsurAlamMunna.png",
  },
  {
    id: "lead-6",
    name: "Mahfuza Shikder Tanha",
    role: "Director",
    image: "/image/team/MahfuzaShikderTanha.png",
  },

  // --- ROW 3 ---
  {
    id: "lead-7",
    name: "Brigadier General Md. Muniruzzaman, ndc, psc (Retd)",
    role: "Project Director",
    image: "/image/team/BrigadierGeneralMdMuniruzzamanNdcPscRetd.png",
  },
  {
    id: "spacer-r3-c2",
    isSpacer: true,
  },
  {
    id: "lead-8",
    name: "Mehedi H. Jony",
    role: "Head of IT & Digital Marketing",
    image: "/image/team/MehediHJonyBoss.png",
  },
  {
    id: "lead-9",
    name: "Alfesani Shuvo",
    role: "Head of Operations & Control",
    image: "/image/team/AlfaaniShuvo.png",
  },

  // --- ROW 4 ---
  {
    id: "spacer-r4-c1",
    isSpacer: true,
  },
  {
    id: "lead-10",
    name: "M Tawhidur Rahman",
    role: "Head of Human Resources",
    image: "/image/team/MdTawhidurRahman.png",
  },
  {
    id: "lead-11",
    name: "Md. Golam Imran",
    role: "Head of Client Experience",
    image: "/image/team/MdGolamImam.png",
  },
  {
    id: "lead-12",
    name: "Md. Ejaj-Ur-Rahman",
    role: "Deputy CEO & Director",
    image: "/image/team/MdEjazUrRahman.png",
  },
];

export function BoardOfLeadership() {
  return (
    <section
      aria-label="Board Of Leadership"
      className="w-full bg-[#ffffff] text-[#1f2723] py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal text-[#044133] leading-tight tracking-tight">
            Board Of Leadership
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#526058] font-light leading-relaxed mt-2.5 sm:mt-3 max-w-md mx-auto">
            Dedicated professionals committed to delivering excellence in every
            project we undertake.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 md:gap-x-10 gap-y-10 sm:gap-y-12 md:gap-y-14">
          {LEADERSHIP_GRID.map((slot) => {
            if (slot.isSpacer) {
              return (
                <div
                  key={slot.id}
                  aria-hidden="true"
                  className="hidden lg:block select-none pointer-events-none"
                />
              );
            }

            return (
              <div
                key={slot.id}
                className="group flex flex-col items-start text-left"
              >
                {/* Portrait Card */}
                <div className="relative w-full aspect-[4/5] bg-[#ece5da] overflow-hidden shadow-xs">
                  <Image
                    src={slot.image}
                    alt={slot.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Leader Name */}
                <h3 className="font-heading text-base sm:text-lg md:text-[19px] font-semibold text-[#044133] leading-snug tracking-tight mt-3 sm:mt-3.5 group-hover:text-[#065e49] transition-colors">
                  {slot.name}
                </h3>

                {/* Leader Designation */}
                <p className="font-sans text-[11px] sm:text-xs text-[#526058] font-normal leading-tight mt-1">
                  {slot.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

