"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  FileCheck2,
  BookmarkCheck,
  Activity,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrincipleStep {
  id: number;
  badge: string;
  name: string;
  desktopX: number; // percentage (0 - 100)
  desktopY: number; // percentage (0 - 100)
  tagline: string;
  description: string;
  highlights: string[];
  icon: React.ElementType;
}

const PRINCIPLES: PrincipleStep[] = [
  {
    id: 1,
    badge: "1",
    name: "Discover",
    desktopX: 7,
    desktopY: 28,
    tagline: "Exploring Your Future Lifestyle",
    description:
      "Every lasting journey starts with true clarity. We introduce you to thoughtfully selected locations, architectural visions, and tailored home specifications designed around real family living.",
    highlights: ["Prime Architectural Sites", "Transparent Unit Briefs", "Feasibility Consultations"],
    icon: Compass,
  },
  {
    id: 2,
    badge: "2",
    name: "Decide",
    desktopX: 18,
    desktopY: 76,
    tagline: "Total Legal & Financial Transparency",
    description:
      "Confidence is born of integrity. We provide verified ownership documentation, transparent cost breakdowns, zero hidden clauses, and flexible payment milestones tailored to your pace.",
    highlights: ["100% Clear Land Titles", "Fixed Price Commitment", "Tailored Installment Plans"],
    icon: FileCheck2,
  },
  {
    id: 3,
    badge: "3",
    name: "Book",
    desktopX: 47,
    desktopY: 30,
    tagline: "Official Reservation & Legal Trust",
    description:
      "A seamless, legally certified reservation experience. Our streamlined documentation ensures complete peace of mind with authenticated agreements and immediate digital confirmation.",
    highlights: ["Certified Documentation", "Digital Record Archival", "Priority Selection"],
    icon: BookmarkCheck,
  },
  {
    id: 4,
    badge: "4",
    name: "Track",
    desktopX: 68,
    desktopY: 76,
    tagline: "Live Construction & Milestone Updates",
    description:
      "The TPHL relationship thrives on accountability. Access real-time construction logs, structural milestone reports, scheduled site walkthroughs, and photographic engineering updates.",
    highlights: ["Real-time Progress Tracker", "On-site Quality Inspections", "Dedicated Relationship Manager"],
    icon: Activity,
  },
  {
    id: 5,
    badge: "5",
    name: "Belong",
    desktopX: 84,
    desktopY: 48,
    tagline: "Keys Handover & Lifelong Community",
    description:
      "Handing over the keys is only the beginning. Experience lifetime structural assurance, active facility management, and a thriving neighborhood crafted for generations to flourish.",
    highlights: ["Celebrated Handover Ceremony", "Post-Handover Warranty", "Thriving Community Network"],
    icon: HeartHandshake,
  },
];

export function AboutPrinciplesDna() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.9, y: 0.5 });
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Active step object
  const currentStep = PRINCIPLES.find((p) => p.id === activeStep) || PRINCIPLES[0];

  // Mouse interaction handler for interactive 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  }, []);

  // 3D DNA Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let startTime = performance.now();

    // Intersection Observer to stop drawing when scrolled off screen (battery/GPU saving)
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Dynamic DNA parameters
    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || canvas.width;
      const height = rect?.height || canvas.height;

      ctx.clearRect(0, 0, width, height);

      const elapsed = (now - startTime) / 1000;
      // Rotational speed of DNA
      const rotationSpeed = isHovering ? 0.95 : 0.75;
      const rotation = elapsed * rotationSpeed;

      // Mouse tilt offsets
      const tiltX = (mousePos.x - 0.5) * 0.25;
      const tiltY = (mousePos.y - 0.5) * 0.2;

      // Responsive configuration
      const centerY = height * 0.52 + tiltY * 30;
      // Amplitude matches the visual wave height in the reference image
      const amplitude = Math.min(height * 0.26, 85);
      // Number of base-pair rungs along the strand
      const numRungs = Math.max(48, Math.floor(width / 18));
      // Frequency: ~1.75 periods across width (matches the reference mockup waves)
      const wavelength = width / 0.8;

      interface StrandNode {
        x: number;
        y: number;
        z: number;
        isStrand1: boolean;
        rungIndex: number;
      }

      interface RungPair {
        index: number;
        x: number;
        p1: { x: number; y: number; z: number };
        p2: { x: number; y: number; z: number };
        avgZ: number;
      }

      const rungs: RungPair[] = [];
      const allNodes: StrandNode[] = [];

      for (let i = 0; i < numRungs; i++) {
        const u = i / (numRungs - 1);
        const x = u * width;

        // Helix phase along the X axis
        const phase = (x / wavelength) * Math.PI * 2 + rotation;

        // 3D double helix coordinates
        // Strand 1 is at phase, Strand 2 is exactly 180 degrees (PI) opposite
        const rawY1 = amplitude * Math.sin(phase);
        const rawZ1 = amplitude * Math.cos(phase);

        const rawY2 = -rawY1;
        const rawZ2 = -rawZ1;

        // Apply gentle perspective / 3D tilt
        const y1 = centerY + rawY1 + tiltX * (x - width / 2) * 0.08;
        const z1 = rawZ1;

        const y2 = centerY + rawY2 + tiltX * (x - width / 2) * 0.08;
        const z2 = rawZ2;

        const p1 = { x, y: y1, z: z1 };
        const p2 = { x, y: y2, z: z2 };
        const avgZ = (z1 + z2) / 2;

        rungs.push({ index: i, x, p1, p2, avgZ });

        allNodes.push({ x, y: y1, z: z1, isStrand1: true, rungIndex: i });
        allNodes.push({ x, y: y2, z: z2, isStrand1: false, rungIndex: i });
      }

      // Sort rungs and nodes by depth (z-index) for authentic 3D occlusion
      allNodes.sort((a, b) => a.z - b.z);
      rungs.sort((a, b) => a.avgZ - b.avgZ);

      // Determine active milestone X coordinate to highlight corresponding DNA segment
      const activePrinciple = PRINCIPLES.find((p) => p.id === activeStep);
      const activeCenterX = activePrinciple ? (activePrinciple.desktopX / 100) * width : -1;

      // 1. Draw connecting base-pair rungs (the structural rungs between Strand 1 and Strand 2)
      for (const rung of rungs) {
        const { p1, p2, x } = rung;

        // Proximity highlight to active milestone
        const distToActive = Math.abs(x - activeCenterX);
        const isNearActive = distToActive < width * 0.12;
        const activeGlow = isNearActive ? Math.max(0, 1 - distToActive / (width * 0.12)) : 0;

        // Depth alpha: rungs in front are clearer, rungs in back are subtle
        const normZ = (rung.avgZ + amplitude) / (2 * amplitude); // 0 (back) to 1 (front)
        const baseAlpha = 0.14 + normZ * 0.24 + activeGlow * 0.35;

        // Gradient for rung based on 3D depth of endpoints
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        const alpha1 = Math.max(0.12, (p1.z + amplitude) / (2 * amplitude));
        const alpha2 = Math.max(0.12, (p2.z + amplitude) / (2 * amplitude));

        if (activeGlow > 0.2) {
          gradient.addColorStop(0, `rgba(4, 65, 51, ${alpha1 * 0.8 + activeGlow * 0.2})`);
          gradient.addColorStop(0.5, `rgba(208, 166, 91, ${0.45 * activeGlow})`);
          gradient.addColorStop(1, `rgba(4, 65, 51, ${alpha2 * 0.8 + activeGlow * 0.2})`);
        } else {
          gradient.addColorStop(0, `rgba(4, 65, 51, ${alpha1 * 0.45})`);
          gradient.addColorStop(1, `rgba(4, 65, 51, ${alpha2 * 0.45})`);
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = isNearActive ? 1.4 : 1.0;
        ctx.stroke();

        // Intermediate base-pair bond dots along rung (mimics DNA chemical base-pair bonds)
        if (normZ > 0.35) {
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 1.2 * normZ, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(4, 65, 51, ${baseAlpha * 0.6})`;
          ctx.fill();
        }
      }

      // 2. Draw helical strand dots with 3D perspective sizing & depth sorting
      for (const node of allNodes) {
        const { x, y, z } = node;

        // 3D depth scaling: nodes closer to viewer (z > 0) are larger and darker
        const normZ = (z + amplitude) / (2 * amplitude); // 0 (furthest) to 1 (closest)
        const radius = 2.4 + normZ * 3.2; // 2.4px in back, up to 5.6px in front
        const opacity = 0.35 + normZ * 0.65; // 0.35 in back, 1.0 in front

        // Active segment highlight
        const distToActive = Math.abs(x - activeCenterX);
        const isNearActive = distToActive < width * 0.1;
        const activeStrength = isNearActive ? Math.max(0, 1 - distToActive / (width * 0.1)) : 0;

        ctx.beginPath();
        ctx.arc(x, y, radius + activeStrength * 1.5, 0, Math.PI * 2);

        if (activeStrength > 0.3 && normZ > 0.4) {
          // Highlight with warm golden-emerald accent when near active milestone
          ctx.fillStyle = `rgba(5, 91, 75, ${opacity})`;
          ctx.shadowColor = "rgba(4, 65, 51, 0.4)";
          ctx.shadowBlur = 6 * activeStrength;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          // Authentic deep forest green node `#044133` / `#054b3c`
          ctx.fillStyle = `rgba(4, 65, 51, ${opacity})`;
          ctx.fill();
        }

        // Tiny specular glint on prominent front nodes for realistic 3D sheen
        if (normZ > 0.75) {
          ctx.beginPath();
          ctx.arc(x - radius * 0.28, y - radius * 0.28, radius * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * normZ})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePos, isHovering, activeStep]);

  return (
    <section
      aria-label="The Principles Behind Every Promise"
      className="relative w-full bg-[#e0d1b6] text-[#044133] overflow-hidden py-16 sm:py-20 lg:py-28 select-none transition-colors duration-500"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* ========================================================= */}
        {/* SECTION HEADER                                            */}
        {/* Matches reference title typography & subtitle layout      */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] font-normal text-[#044133] leading-[1.08] tracking-tight"
          >
            The Principles Behind
            <br />
            Every Promise
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-xs sm:text-[13px] md:text-sm text-[#4a5951] leading-relaxed max-w-xl mx-auto mt-4 sm:mt-5 tracking-wide"
          >
            The TPHL Relationship Does Not End At Booking. It Continues Through
            Construction Progress, Handover, Support, And Long-Term Community Value.
          </motion.p>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP INTERACTIVE DNA HELIX CANVAS + MILESTONES (lg+)   */}
        {/* Exactly replicates the visual composition of the mockup   */}
        {/* ========================================================= */}
        <div
          ref={containerRef}
        
          className="hidden lg:block relative w-full h-[440px] xl:h-[480px] rounded-3xl"
        >
          {/* Background DNA Canvas Rendering 3D Rotating Helix */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* 5 Numbered Milestones Positioned Along the Wave */}
          {PRINCIPLES.map((principle) => {
            const isActive = activeStep === principle.id;

            return (
              <motion.button
                key={principle.id}
                onClick={() => setActiveStep(principle.id)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  left: `${principle.desktopX}%`,
                  top: `${principle.desktopY}%`,
                }}
                className={cn(
                  "absolute -translate-y-1/2 flex items-center gap-3.5 z-20 group cursor-pointer text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#044133]/40 rounded-full py-1.5 px-2",
                  isActive ? "scale-105" : "hover:opacity-90"
                )}
                aria-label={`Step ${principle.badge}: ${principle.name}`}
              >
                {/* Circular Badge */}
                <div
                  className={cn(
                    "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading text-lg sm:text-xl font-normal transition-all duration-300 shadow-sm",
                    isActive
                      ? "bg-[#044133] text-[#ffffff] shadow-[0_6px_20px_rgba(4,65,51,0.35)] ring-4 ring-[#044133]/15"
                      : "bg-[#ffffff] text-[#044133] border border-black/5 hover:bg-[#ffffff] hover:shadow-md"
                  )}
                >
                  {principle.badge}
                </div>

                {/* Milestone Label */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-heading text-2xl xl:text-[28px] font-normal leading-none transition-colors duration-300",
                      isActive
                        ? "text-[#044133] font-semibold"
                        : "text-[#044133] opacity-90 group-hover:opacity-100"
                    )}
                  >
                    {principle.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ACTIVE PRINCIPLE DETAIL DRAWER / HIGHLIGHT CARD           */}
        {/* Provides rich, engaging context when exploring each step  */}
        {/* ========================================================= */}
       

        {/* ========================================================= */}
        {/* MOBILE & TABLET STEPPER (lg:hidden)                       */}
        {/* Clean, touch-optimized horizontal tab selector            */}
        {/* ========================================================= */}
        <div className="lg:hidden mt-8">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:-mx-8 sm:px-8">
            {PRINCIPLES.map((principle) => {
              const isActive = activeStep === principle.id;

              return (
                <button
                  key={principle.id}
                  onClick={() => setActiveStep(principle.id)}
                  className={cn(
                    "shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-full font-sans text-xs font-semibold transition-all duration-300 shadow-xs cursor-pointer",
                    isActive
                      ? "bg-[#044133] text-[#ffffff] shadow-md"
                      : "bg-[#ffffff]/80 text-[#044133] hover:bg-[#ffffff]"
                  )}
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full text-[11px] font-heading flex items-center justify-center",
                      isActive ? "bg-[#ffffff]/20 text-[#ffffff]" : "bg-[#044133]/10 text-[#044133]"
                    )}
                  >
                    {principle.badge}
                  </span>
                  <span>{principle.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
