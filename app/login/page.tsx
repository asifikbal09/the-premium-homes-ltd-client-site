"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ProjectShowcase {
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

const SHOWCASE_PROJECTS: ProjectShowcase[] = [
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

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const currentProject = SHOWCASE_PROJECTS[activeSlide];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? SHOWCASE_PROJECTS.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === SHOWCASE_PROJECTS.length - 1 ? 0 : prev + 1,
    );
  };

  const onSubmit = async (values: LoginFormInputs) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.dpremiumhomes.com/api"
      ).replace(/\/+$/, "");

      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        const errorMsg =
          data?.message ||
          "Invalid email or password. Please verify your details.";
        setApiError(errorMsg);
        return;
      }

      setApiSuccess(
        data?.message || "Login successful! Redirecting to dashboard...",
      );

      try {
        const token = data?.token || data?.access_token || "";
        const userId =
          data?.user?.id ||
          data?.user_id ||
          data?.id ||
          data?.data?.id ||
          data?.data?.user?.id ||
          "";

        if (token) {
          localStorage.setItem("tphl_auth_token", token);
          localStorage.setItem("token", token);
        }
        if (userId) {
          localStorage.setItem("tphl_user_id", String(userId));
          localStorage.setItem("user_id", String(userId));
        }
        if (data?.user) {
          localStorage.setItem("tphl_user", JSON.stringify(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data) {
          localStorage.setItem("tphl_auth_data", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to save credentials in localStorage:", err);
      }

      // Smooth redirection to client dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setApiError(
        err?.message ||
          "Unable to connect to the authentication server. Please check your connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#ffffff] text-[#1f2723]">
      {/* ========================================================= */}
      {/* LEFT COLUMN: AUTHENTICATION FORM                          */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-12 xl:px-20 py-12 min-h-screen bg-white">
        <div className="w-full max-w-[420px] mx-auto flex flex-col">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            <Link
              href="/"
              className="inline-block transition-transform duration-200 hover:scale-[1.02]"
              aria-label="The Premium Homes Home"
            >
              <div className="relative w-44 sm:w-48 h-12">
                <Image
                  src="/image/logo/LOGO-GREEN.png"
                  alt="The Premium Homes Ltd."
                  fill
                  priority
                  sizes="200px"
                  className="object-contain object-center"
                />
              </div>
            </Link>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-heading)] font-serif text-3xl sm:text-[36px] font-normal text-[#044133] tracking-tight leading-snug">
              Log In To Your Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              Welcome Back! Please Enter Your Details.
            </p>
          </div>

          {/* Feedback Alerts */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{apiError}</div>
            </motion.div>
          )}

          {apiSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[#044133] text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#044133]" />
              <div className="flex-1 font-medium">{apiSuccess}</div>
            </motion.div>
          )}

          {/* React Hook Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none",
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={cn(
                    "w-full px-4 py-3 pr-11 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none",
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="rememberMe"
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-stone-300 text-[#044133] focus:ring-[#044133] accent-[#044133] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-stone-600 font-normal">
                  Remember for 30 days
                </span>
              </label>

              <Link
                href="/contact"
                className="text-xs sm:text-sm font-semibold text-[#044133] hover:underline transition-colors"
              >
                Forgot password
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-[#f7e7cb] text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#f7e7cb]" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>
            </div>

            {/* User Request Requirement: Don't have account. Register now. */}
            <div className="text-center pt-3">
              <p className="text-xs sm:text-sm text-stone-600 font-normal">
                Don&apos;t have account?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-[#044133] hover:underline transition-colors"
                >
                  Register now.
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: ARCHITECTURAL VISUAL WITH FLOATING CARD     */}
      {/* ========================================================= */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden bg-stone-900 select-none">
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
            {/* Subtle gradient vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Showcase Project Card */}
        <div className="absolute bottom-8 right-8 xl:bottom-10 xl:right-10 z-20 w-[340px] xl:w-[370px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 xl:p-6 shadow-2xl border border-white/50 text-[#1f2723]"
          >
            {/* Category */}
            <div className="text-center">
              <span className="text-[10px] xl:text-[11px] font-bold tracking-[0.2em] uppercase text-[#055b4b]">
                {currentProject.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-heading)] font-serif text-xl xl:text-2xl font-medium text-stone-900 text-center mt-1 leading-snug">
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
                <span className="text-[11px] font-semibold text-stone-700 w-2 text-center">
                  1
                </span>

                {/* Progress Bar Indicator */}
                <div className="relative flex-1 h-[2px] bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-[#044133] transition-all duration-300 rounded-full",
                      activeSlide === 0 ? "w-1/2" : "w-full",
                    )}
                  />
                </div>

                <span className="text-[11px] font-semibold text-stone-700 w-2 text-center">
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

            {/* Project Short Description */}
            <p className="text-[11px] xl:text-xs text-stone-600 text-center leading-relaxed mt-2.5 px-1 line-clamp-2">
              {currentProject.description}
            </p>

            {/* VIEW PROJECT CTA Button */}
            <div className="mt-3.5">
              <Link
                href={currentProject.href}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full bg-[#ede6d9] hover:bg-[#e2d8c7] active:scale-[0.99] text-[#1f2723] text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-sm"
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
