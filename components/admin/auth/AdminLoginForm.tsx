"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseProject {
  id: string;
  category: string;
  title: string;
  location: string;
  description: string;
  cardImage: string;
  bgImage: string;
  cardAlt: string;
  bgAlt: string;
  href: string;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "lumina",
    category: "COMMERCIAL",
    title: "The Premium Lumina",
    location: "10/23 Bashundhara Residential Area",
    description:
      "Your fairytale honeymoon awaits at our luxurious hotel. Book now for an unforgettable experience.",
    cardImage: "/image/lumina.png",
    bgImage: "/image/studio6.png",
    cardAlt: "The Premium Lumina luxury commercial estate architectural view",
    bgAlt: "Architectural facade backdrop",
    href: "/projects",
  },
  {
    id: "studio6",
    category: "RESIDENTIAL",
    title: "The Premium Studio Suite 6.0",
    location: "Sector 11, Uttara, Dhaka",
    description:
      "A masterpiece of contemporary architecture featuring luxury suites with panoramic city vistas and private balconies.",
    cardImage: "/image/studio6.png",
    bgImage: "/image/lumina.png",
    cardAlt: "The Premium Studio Suite 6.0 modern residential tower",
    bgAlt: "Architectural facade backdrop",
    href: "/projects",
  },
];

export function AdminLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? SHOWCASE_PROJECTS.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === SHOWCASE_PROJECTS.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your administrative email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail, password);
      if (result.success) {
        // Save remember state if needed
        try {
          if (rememberMe) {
            localStorage.setItem("admin_remember_email", trimmedEmail);
          } else {
            localStorage.removeItem("admin_remember_email");
          }
        } catch {
          // ignore storage error
        }
        router.push("/admin/dashboard");
      } else {
        setErrorMessage(
          result.message || "Invalid credentials. Please verify your email and password."
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Unable to reach the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restore remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("admin_remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const currentProject = SHOWCASE_PROJECTS[activeSlide];

  // Full-page loading state while checking initial authentication
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-[#044133]">
        <div className="relative w-44 h-12 mb-6 animate-pulse">
          <Image
            src="/image/logo/LOGO-GREEN.png"
            alt="The Premium Homes Ltd."
            fill
            priority
            sizes="180px"
            className="object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#044133]" />
          <span className="text-xs uppercase tracking-widest font-normal text-stone-600">
            Loading Admin Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-[#044133] selection:text-white">
      {/* ========================================================= */}
      {/* LEFT PANEL: AUTH FORM (Matches screenshot exactly)        */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-10 xl:px-16 py-10 bg-white z-10 lg:border-r lg:border-stone-100">
        <div className="w-full max-w-[420px] mx-auto flex flex-col">
          {/* Brand Logo */}
          <div className="flex justify-center mb-5">
            <Link
              href="/"
              className="inline-block transition-transform duration-200 hover:scale-[1.02]"
              aria-label="The Premium Homes Home"
            >
              <div className="relative w-48 sm:w-52 h-14">
                <Image
                  src="/image/logo/LOGO-GREEN.png"
                  alt="The Premium Homes Ltd."
                  fill
                  priority
                  sizes="210px"
                  className="object-contain object-center"
                />
              </div>
            </Link>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="font-[family-name:var(--font-heading)] font-serif text-3xl sm:text-[34px] font-normal text-[#044133] tracking-tight leading-snug">
              Log In To Your Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
              Welcome Back! Please Enter Your Details.
            </p>
          </div>

          {/* Error Alert Box */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="error-box"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 font-normal">{errorMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 rounded-lg border border-[#d6e4f7] text-sm text-stone-900 placeholder:text-stone-400 bg-[#edf3fc] focus:bg-white focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/15 transition-all outline-none disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-[#7b9ac2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 pr-11 rounded-lg border border-[#d6e4f7] text-sm text-stone-900 placeholder:text-stone-400 bg-[#edf3fc] focus:bg-white focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/15 transition-all outline-none disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-[#7b9ac2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7b9ac2] hover:text-[#044133] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label
                htmlFor="adminRememberMe"
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  id="adminRememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-stone-300 text-[#044133] focus:ring-[#044133] accent-[#044133] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-stone-600 font-normal">
                  Remember for 30 days
                </span>
              </label>

              <Link
                href="/contact"
                className="text-xs sm:text-sm font-normal text-[#044133] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#044133] hover:bg-[#033026] active:scale-[0.99] text-white text-xs sm:text-sm font-normal uppercase tracking-[0.18em] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>
            </div>

            {/* Admin Footer Badge / Return to Home */}
            <div className="text-center pt-4 border-t border-stone-100">
              <div className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                <ShieldAlert className="w-3.5 h-3.5 text-[#044133]" />
                <span>Protected Administrator Portal</span>
              </div>
              <div className="mt-2">
                <Link
                  href="/"
                  className="text-xs text-stone-500 hover:text-[#044133] font-normal transition-colors"
                >
                  ← Return to Public Website
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: VISUAL SHOWCASE SLIDER (Exact match)        */}
      {/* ========================================================= */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden bg-stone-900 select-none z-20 shadow-2xl">
        {/* Dynamic Background Image with Smooth Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.bgImage}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentProject.bgImage}
              alt={currentProject.bgAlt}
              fill
              priority
              sizes="50vw"
              className="object-cover object-center"
            />
            {/* Subtle luxury vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Showcase Project Card */}
        <div className="absolute bottom-8 xl:bottom-10 right-8 xl:right-10 z-30 w-[340px] xl:w-[370px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 xl:p-6 shadow-2xl border border-white/60 text-[#1f2723]"
          >
            {/* Category */}
            <div className="text-center">
              <span className="text-[10px] xl:text-[11px] font-normal tracking-[0.2em] uppercase text-[#055b4b]">
                {currentProject.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-heading)] font-serif text-xl xl:text-2xl font-normal text-stone-900 text-center mt-1 leading-snug">
              {currentProject.title}
            </h3>

            {/* Location */}
            <p className="text-[11px] xl:text-xs text-stone-500 text-center mt-0.5">
              {currentProject.location}
            </p>

            {/* Thumbnail Image Container */}
            <div className="relative w-full h-[155px] xl:h-[170px] rounded-xl overflow-hidden mt-3.5 shadow-sm bg-stone-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.cardImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentProject.cardImage}
                    alt={currentProject.cardAlt}
                    fill
                    sizes="350px"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Slider Bar: < 1 —— 2 > */}
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous project"
                className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 flex-1 px-3">
                <span className="text-[11px] font-normal text-stone-700 w-2 text-center">
                  1
                </span>

                {/* Progress Bar Indicator */}
                <div className="relative flex-1 h-[2px] bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-[#044133] transition-all duration-300 rounded-full",
                      activeSlide === 0 ? "w-1/2" : "w-full"
                    )}
                  />
                </div>

                <span className="text-[11px] font-normal text-stone-700 w-2 text-center">
                  {SHOWCASE_PROJECTS.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next project"
                className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] xl:text-xs text-stone-600 text-center mt-2.5 leading-relaxed line-clamp-2">
              {currentProject.description}
            </p>

            {/* View Project Button */}
            <div className="mt-3.5">
              <Link
                href={currentProject.href}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ece6dc] hover:bg-[#e2dacb] text-stone-800 text-[11px] xl:text-xs font-normal uppercase tracking-[0.14em] transition-colors duration-200 text-center block shadow-sm"
              >
                VIEW PROJECT
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
