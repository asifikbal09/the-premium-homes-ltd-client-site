"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Video, RefreshCw, Maximize2, ShieldCheck, Play } from "lucide-react";

export function CameraTab() {
  const [activeCam, setActiveCam] = useState("cam-1");

  const cameras = [
    { id: "cam-1", name: "Tower East Camera 1", angle: "10th Floor Structural Deck", status: "LIVE" },
    { id: "cam-2", name: "Tower West Camera 2", angle: "Basement Parking Entry", status: "LIVE" },
    { id: "cam-3", name: "Ground Plaza Camera 3", angle: "Landscape & Lobby Gate", status: "LIVE" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Live Site Surveillance Feed
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          24/7 high-definition encrypted video streaming for onboard clients at The Premium Green Valley.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Stream Player */}
        <div className="lg:col-span-3 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-xl relative aspect-video flex flex-col justify-between">
          <div className="relative w-full h-full">
            <Image
              src="/image/progress/live_camera.png"
              alt="Live Construction Stream"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
            />
            {/* Top Stream Info Bar */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white text-xs z-10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="font-bold tracking-wider uppercase text-red-500 font-mono text-[11px]">
                  LIVE STREAM • 1080P 60FPS
                </span>
                <span className="hidden sm:inline text-white/60">|</span>
                <span className="hidden sm:inline text-white/80">
                  The Premium Green Valley (Gulshan 2)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono">
                  AES-256 ENCRYPTED
                </span>
              </div>
            </div>

            {/* Bottom Stream Controls */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs z-10">
              <span className="font-mono text-white/70">
                CAM 01 — Lat: 23.7925° N, Long: 90.4078° E
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reload feed"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Selector Sidebar */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#044133]">
            <Video className="w-4 h-4" />
            <h3 className="font-serif font-bold text-base">Select Camera</h3>
          </div>

          <div className="space-y-2">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                type="button"
                onClick={() => setActiveCam(cam.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  activeCam === cam.id
                    ? "border-[#044133] bg-[#044133]/5 text-[#044133] font-semibold"
                    : "border-stone-200 hover:bg-stone-50 text-stone-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{cam.name}</span>
                  <span className="text-[10px] font-bold text-red-600 font-mono">● LIVE</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">{cam.angle}</p>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Exclusively accessible to registered client accounts. Recordings are archived every 30 days.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
