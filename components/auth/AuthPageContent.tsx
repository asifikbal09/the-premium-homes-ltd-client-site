"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  KeyRound,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// INTERFACES & TYPES
// ==========================================

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormInputs {
  name: string;
  email: string;
  phone: string;
  password: string;
  purposes: string;
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

interface AuthPageContentProps {
  initialMode?: "login" | "register";
}

export default function AuthPageContent({
  initialMode = "login",
}: AuthPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode state: 'login' | 'register'
  const modeParam = searchParams?.get("mode");
  const [mode, setMode] = useState<"login" | "register">(
    modeParam === "register" ? "register" : initialMode,
  );

  const isRegister = mode === "register";

  // Check for desktop screen (lg >= 1024px) for sliding animation
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync mode state when URL param changes
  useEffect(() => {
    if (modeParam === "register") {
      setMode("register");
    } else if (modeParam === "login") {
      setMode("login");
    }
  }, [modeParam]);

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setApiError(null);
    setApiSuccess(null);
    // Smooth URL update without full navigation
    window.history.pushState(null, "", newMode === "register" ? "/register" : "/login");
  };

  // Dynamic Showcase Projects State (no hardcoded fallback)
  const [showcaseProjects, setShowcaseProjects] = useState<ProjectShowcase[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Common UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // Load real projects from API for the right side showcase
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/projects`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : data?.projects || data?.data || [];
          if (Array.isArray(list) && list.length > 0 && isMounted) {
            const mapped: ProjectShowcase[] = list.slice(4, 7).map((p: any) => {
              let img = p.image || "";
              if (img && !img.startsWith("http")) {
                img = `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${img.replace(
                  /^\/+/,
                  ""
                )}`;
              }

              let bgImg = p.image2 || p.image || "";
              if (bgImg && !bgImg.startsWith("http")) {
                bgImg = `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${bgImg.replace(
                  /^\/+/,
                  ""
                )}`;
              }
              if (!bgImg) bgImg = img;

              const location =
                p.location ||
                (typeof p.community === "object"
                  ? p.community?.name
                  : p.community) ||
                "Dhaka, Bangladesh";
              const category = (
                p.types ||
                p.type ||
                p.category ||
                "RESIDENTIAL"
              ).toUpperCase();
              const desc =
                p.hover_text ||
                p.description ||
                `${location} — an exquisite address designed for modern luxury living.`;

              return {
                id: String(p.id || p.slug),
                category,
                title: p.name || "Prestige Residence",
                location:
                  typeof location === "string"
                    ? location
                    : "Dhaka, Bangladesh",
                description: typeof desc === "string" ? desc : "",
                cardImage: img,
                bgImage: bgImg,
                cardAlt: p.name || "Project View",
                bgAlt: p.name || "Architectural Backdrop",
                href: `/projects/${p.slug || p.id}`,
              };
            });
            setShowcaseProjects(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load showcase projects:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    };
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // OTP Modal states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 3-Minute Timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (otpModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpModalOpen, timeLeft]);

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentProject: ProjectShowcase | null =
    showcaseProjects.length > 0
      ? showcaseProjects[activeSlide] || showcaseProjects[0]
      : null;

  // Forms setup
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      purposes: "Buying a property",
    },
    mode: "onBlur",
  });

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? showcaseProjects.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === showcaseProjects.length - 1 ? 0 : prev + 1
    );
  };

  // ==========================================
  // LOGIN SUBMIT HANDLER
  // ==========================================
  const onLogin = async (values: LoginFormInputs) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const baseUrl = getBaseUrl();
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
        const token = data?.token || data?.access_token || data?.data?.token || "";
        const user = data?.user || data?.data?.user || null;
        const userId =
          user?.id ||
          data?.user_id ||
          data?.id ||
          data?.data?.id ||
          "";

        if (token) {
          localStorage.setItem("tphl_auth_token", token);
          localStorage.setItem("token", token);
        }
        if (userId) {
          localStorage.setItem("tphl_user_id", String(userId));
          localStorage.setItem("user_id", String(userId));
        }
        if (user) {
          localStorage.setItem("tphl_user", JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));
        }
        if (data) {
          localStorage.setItem("tphl_auth_data", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to save credentials in localStorage:", err);
      }

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

  // ==========================================
  // REGISTER SUBMIT HANDLER
  // ==========================================
  const onRegister = async (values: RegisterFormInputs) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password,
          purposes: values.purposes || "Buying a property",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        const errorMsg =
          data?.message ||
          (data?.errors
            ? Object.values(data.errors).flat().join(" ")
            : "Registration failed. Please check your information.");
        setApiError(errorMsg);
        return;
      }

      const emailToVerify = data?.data?.email || values.email.trim();
      setRegisteredEmail(emailToVerify);
      setApiSuccess(
        data?.message ||
          "Registration successful. A 6-digit verification code has been sent to your email.",
      );

      // Open OTP Verification Modal and start 3-min timer
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError(null);
      setOtpSuccess(null);
      setTimeLeft(180);
      setOtpModalOpen(true);

      // Focus first OTP field after modal opens
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 300);
    } catch (err: any) {
      setApiError(
        err?.message ||
          "Unable to connect to the registration server. Please check your connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // OTP DIGIT CHANGE HANDLERS
  // ==========================================
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    const digit = cleanValue.slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    // Auto-advance to next input
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setOtpDigits(updated);

    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // ==========================================
  // VERIFY OTP HANDLER
  // ==========================================
  const handleVerifyOtp = async () => {
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: registeredEmail,
          otp: otpCode,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        setOtpError(
          data?.message || "Invalid or expired verification code. Please try again.",
        );
        return;
      }

      setOtpSuccess(data?.message || "Email verified successfully!");

      // Save user & token to localStorage
      try {
        const token = data?.data?.token || data?.token || "";
        const user = data?.data?.user || data?.user || null;
        const userId = user?.id || "";

        if (token) {
          localStorage.setItem("tphl_auth_token", token);
          localStorage.setItem("token", token);
        }
        if (userId) {
          localStorage.setItem("tphl_user_id", String(userId));
          localStorage.setItem("user_id", String(userId));
        }
        if (user) {
          localStorage.setItem("tphl_user", JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));
        }
        if (data) {
          localStorage.setItem("tphl_auth_data", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to store credentials after OTP verification:", err);
      }

      // Smooth redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setOtpError(
        err?.message ||
          "Network error while verifying OTP. Please check your connection.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ==========================================
  // RESEND OTP HANDLER (After 3-min cooldown)
  // ==========================================
  const handleResendOtp = async () => {
    if (timeLeft > 0 || isResendingOtp) return;

    setIsResendingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: registeredEmail,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        setOtpError(
          data?.message || "Could not resend verification code. Please try again.",
        );
        return;
      }

      setOtpSuccess(
        data?.message ||
          "A fresh 6-digit verification code has been sent to your email.",
      );
      // Restart the 3-minute timer (180 seconds)
      setTimeLeft(180);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setOtpError(
        err?.message ||
          "Failed to resend verification code. Please check your connection.",
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white text-[#1f2723]">
      {/* Container holding the sliding 50/50 panels on desktop */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
        {/* ========================================================= */}
        {/* FORM PANEL (Slides from Left to Right when in Register)   */}
        {/* ========================================================= */}
        <motion.div
          animate={{
            x: isDesktop ? (isRegister ? "100%" : "0%") : "0%",
          }}
          transition={{
            duration: 0.75,
            ease: [0.32, 0.72, 0, 1],
          }}
          className={cn(
            "w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-10 xl:px-16 py-10 bg-white z-10",
            // When transformed to the right, keep borders clean
            isRegister ? "lg:border-l lg:border-stone-100" : "lg:border-r lg:border-stone-100",
          )}
        >
          <div className="w-full max-w-[440px] mx-auto flex flex-col">
            {/* Brand Logo */}
            <div className="flex justify-center mb-5">
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

            {/* Global API Feedback Messages */}
            <AnimatePresence mode="wait">
              {apiError && (
                <motion.div
                  key="error-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1 font-normal">{apiError}</div>
                </motion.div>
              )}

              {apiSuccess && (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[#044133] text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
                  role="status"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#044133]" />
                  <div className="flex-1 font-normal">{apiSuccess}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cross-fading Form Content between Login and Register */}
            <AnimatePresence mode="wait" initial={false}>
              {!isRegister ? (
                // ==========================================
                // LOGIN FORM VIEW
                // ==========================================
                <motion.div
                  key="login-form-container"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="w-full flex flex-col"
                >
                  {/* Heading & Subtitle */}
                  <div className="text-center mb-6">
                    <h1 className="font-[family-name:var(--font-heading)] font-serif text-3xl sm:text-[34px] font-normal text-[#044133] tracking-tight leading-snug">
                      Log In To Your Account
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
                      Welcome Back! Please Enter Your Details.
                    </p>
                  </div>

                  <form
                    onSubmit={handleLoginSubmit(onLogin)}
                    noValidate
                    className="space-y-4"
                  >
                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="login-email"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          disabled={isSubmitting}
                          {...registerLogin("email", {
                            required: "Email address is required",
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 sm:py-3 pl-10 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none",
                            loginErrors.email
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {loginErrors.email && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="login-password"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                          {...registerLogin("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 sm:py-3 pl-10 pr-11 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none",
                            loginErrors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between pt-0.5">
                      <label
                        htmlFor="rememberMe"
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          id="rememberMe"
                          type="checkbox"
                          {...registerLogin("rememberMe")}
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
                        className="w-full py-3.5 px-6 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-[#f7e7cb] text-xs sm:text-sm font-normal uppercase tracking-[0.16em] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
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

                    {/* Switch to Register link */}
                    <div className="text-center pt-3">
                      <p className="text-xs sm:text-sm text-stone-600 font-normal">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("register")}
                          className="font-normal text-[#044133] hover:underline transition-colors cursor-pointer inline-flex items-center gap-0.5"
                        >
                          Register now.
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              ) : (
                // ==========================================
                // REGISTER FORM VIEW
                // ==========================================
                <motion.div
                  key="register-form-container"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="w-full flex flex-col"
                >
                  {/* Heading & Subtitle */}
                  <div className="text-center mb-5">
                    <h1 className="font-[family-name:var(--font-heading)] font-serif text-3xl sm:text-[34px] font-normal text-[#044133] tracking-tight leading-snug">
                      Create Your Account
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
                      Join The Premium Homes for exclusive luxury real estate access.
                    </p>
                  </div>

                  <form
                    onSubmit={handleRegisterSubmit(onRegister)}
                    noValidate
                    className="space-y-3.5"
                  >
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="register-name"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="register-name"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. John Doe"
                          disabled={isSubmitting}
                          {...registerRegister("name", {
                            required: "Full name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none pl-10",
                            registerErrors.name
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {registerErrors.name && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {registerErrors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="register-email"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          placeholder="john@example.com"
                          disabled={isSubmitting}
                          {...registerRegister("email", {
                            required: "Email address is required",
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none pl-10",
                            registerErrors.email
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {registerErrors.email && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {registerErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="register-phone"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          id="register-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+8801XXXXXXXXX"
                          disabled={isSubmitting}
                          {...registerRegister("phone", {
                            required: "Phone number is required",
                            minLength: {
                              value: 7,
                              message: "Please enter a valid phone number",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none pl-10",
                            registerErrors.phone
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {registerErrors.phone && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {registerErrors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="register-password"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="register-password"
                          type={showRegPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                          {...registerRegister("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 pl-10 pr-11 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all outline-none",
                            registerErrors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        />
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword((prev) => !prev)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                          aria-label={
                            showRegPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {registerErrors.password && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {registerErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Purposes Field */}
                    <div>
                      <label
                        htmlFor="register-purposes"
                        className="block text-xs sm:text-sm font-normal text-stone-700 mb-1"
                      >
                        Primary Purpose
                      </label>
                      <div className="relative">
                        <select
                          id="register-purposes"
                          disabled={isSubmitting}
                          {...registerRegister("purposes", {
                            required: "Please select your primary purpose",
                          })}
                          className={cn(
                            "w-full px-4 py-2.5 pl-10 rounded-lg border text-sm text-stone-900 bg-white transition-all outline-none appearance-none cursor-pointer",
                            registerErrors.purposes
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-stone-200 focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10",
                          )}
                        >
                          <option value="Buying a property">Buying a property</option>
                          <option value="Investment opportunities">
                            Investment opportunities
                          </option>
                          <option value="Commercial space">Commercial space</option>
                          <option value="Selling a property">Selling a property</option>
                          <option value="Architectural consultation">
                            Architectural consultation
                          </option>
                          <option value="General inquiry">General inquiry</option>
                        </select>
                        <Briefcase className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                          ▼
                        </div>
                      </div>
                      {registerErrors.purposes && (
                        <p className="mt-1 text-xs text-red-600 font-normal">
                          {registerErrors.purposes.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-[#f7e7cb] text-xs sm:text-sm font-normal uppercase tracking-[0.16em] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#f7e7cb]" />
                            <span>CREATING ACCOUNT...</span>
                          </>
                        ) : (
                          <span>REGISTER NOW</span>
                        )}
                      </button>
                    </div>

                    {/* Switch to Login link */}
                    <div className="text-center pt-2">
                      <p className="text-xs sm:text-sm text-stone-600 font-normal">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("login")}
                          className="font-normal text-[#044133] hover:underline transition-colors cursor-pointer inline-flex items-center gap-0.5"
                        >
                          Log in.
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* VISUAL SHOWCASE PANEL (Slides from Right to Left)         */}
        {/* ========================================================= */}
        <motion.div
          animate={{
            x: isDesktop ? (isRegister ? "-100%" : "0%") : "0%",
          }}
          transition={{
            duration: 0.75,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden bg-stone-900 select-none z-20 shadow-2xl"
        >
          {isLoadingProjects || !currentProject ? (
            /* Skeleton Loading State (No mock/fallback data) */
            <div className="absolute inset-0 w-full h-full">
              {/* Shimmering backdrop skeleton */}
              <div className="absolute inset-0 w-full h-full bg-stone-900 animate-pulse" />

              {/* Floating Skeleton Card */}
              <div
                className={cn(
                  "absolute bottom-8 xl:bottom-10 z-30 w-[340px] xl:w-[370px]",
                  isRegister ? "left-8 xl:left-10" : "right-8 xl:right-10",
                )}
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 xl:p-6 shadow-2xl border border-white/60 animate-pulse">
                  {/* Category skeleton */}
                  <div className="h-3 w-24 bg-stone-200 rounded-full mx-auto" />

                  {/* Title skeleton */}
                  <div className="h-6 w-48 bg-stone-200 rounded-md mx-auto mt-2.5" />

                  {/* Location skeleton */}
                  <div className="h-3 w-36 bg-stone-200 rounded-md mx-auto mt-2" />

                  {/* Thumbnail Image Skeleton */}
                  <div className="w-full h-[155px] xl:h-[170px] rounded-xl bg-stone-200 mt-3.5" />

                  {/* Slider bar indicator skeleton */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="w-4 h-4 rounded-full bg-stone-200" />
                    <div className="flex-1 mx-3 h-1.5 rounded-full bg-stone-200" />
                    <div className="w-4 h-4 rounded-full bg-stone-200" />
                  </div>

                  {/* Description skeleton */}
                  <div className="space-y-1.5 mt-3 px-1">
                    <div className="h-2.5 w-full bg-stone-200 rounded" />
                    <div className="h-2.5 w-4/5 bg-stone-200 rounded mx-auto" />
                  </div>

                  {/* CTA button skeleton */}
                  <div className="mt-3.5 h-10 w-full rounded-full bg-stone-200" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Dynamic Background Image with Smooth Fade (NO dark vignette overlay, 100% clear and bright) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.bgImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {currentProject.bgImage ? (
                    <Image
                      src={currentProject.bgImage}
                      alt={currentProject.bgAlt}
                      fill
                      priority
                      sizes="50vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-900" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Floating Showcase Project Card */}
              <div
                className={cn(
                  "absolute bottom-8 xl:bottom-10 z-30 w-[340px] xl:w-[370px] transition-all duration-500",
                  // When on left (Register mode), dock neatly on left/right
                  isRegister ? "left-8 xl:left-10" : "right-8 xl:right-10",
                )}
              >
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
                        {currentProject.cardImage ? (
                          <Image
                            src={currentProject.cardImage}
                            alt={currentProject.cardAlt}
                            fill
                            sizes="350px"
                            className="object-cover object-center"
                          />
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Slider Bar: < 1 —— N > */}
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
                      <span className="text-[11px] font-normal text-stone-700 min-w-[14px] text-center">
                        {activeSlide + 1}
                      </span>

                      {/* Progress Bar Indicator */}
                      <div className="relative flex-1 h-[2px] bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#044133] transition-all duration-300 rounded-full"
                          style={{
                            width: `${Math.round(((activeSlide + 1) / Math.max(showcaseProjects.length, 1)) * 100)}%`,
                          }}
                        />
                      </div>

                      <span className="text-[11px] font-normal text-stone-700 min-w-[14px] text-center">
                        {showcaseProjects.length}
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
                      className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full bg-[#ede6d9] hover:bg-[#e2d8c7] active:scale-[0.99] text-[#1f2723] text-[11px] font-normal tracking-[0.14em] uppercase transition-all duration-200 shadow-sm"
                    >
                      VIEW PROJECT
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* LUXURY OTP VERIFICATION MODAL                             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {otpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => {
                // Keep modal open or allow closing
              }}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 z-10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="otp-title"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOtpModalOpen(false)}
                className="absolute right-5 top-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close verification modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#044133]/10 flex items-center justify-center text-[#044133] mb-4 shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>

                <h2
                  id="otp-title"
                  className="font-[family-name:var(--font-heading)] font-serif text-2xl sm:text-[28px] font-normal text-[#044133] tracking-tight"
                >
                  Verify Your Email
                </h2>

                <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xs leading-relaxed">
                  We have sent a 6-digit verification code to
                </p>
                <span className="inline-block mt-1 px-3 py-1 bg-stone-100 text-[#044133] font-normal text-xs sm:text-sm rounded-full max-w-full truncate border border-stone-200">
                  {registeredEmail}
                </span>
              </div>

              {/* Alerts inside OTP Modal */}
              {otpError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="font-normal flex-1">{otpError}</span>
                </motion.div>
              )}

              {otpSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#044133] text-xs sm:text-sm flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#044133]" />
                  <span className="font-normal flex-1">{otpSuccess}</span>
                </motion.div>
              )}

              {/* 6 OTP Input Boxes */}
              <div className="mt-6">
                <div
                  className="flex items-center justify-center gap-2 sm:gap-3"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isVerifyingOtp}
                      className={cn(
                        "w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-normal rounded-xl border bg-stone-50/60 text-stone-900 transition-all outline-none",
                        digit
                          ? "border-[#044133] bg-white ring-2 ring-[#044133]/10 shadow-sm"
                          : "border-stone-200 focus:border-[#044133] focus:bg-white focus:ring-2 focus:ring-[#044133]/15",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otpDigits.join("").length !== 6}
                  className="w-full py-3.5 px-6 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-[#f7e7cb] text-xs sm:text-sm font-normal uppercase tracking-[0.16em] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#f7e7cb]" />
                      <span>VERIFYING...</span>
                    </>
                  ) : (
                    <span>VERIFY & CONTINUE</span>
                  )}
                </button>
              </div>

              {/* 3-Minute Resend Timer Area */}
              <div className="mt-5 text-center">
                {timeLeft > 0 ? (
                  <p className="text-xs sm:text-sm text-stone-500 font-normal flex items-center justify-center gap-1.5">
                    <span>Resend code in</span>
                    <span className="font-normal text-[#044133] font-mono tracking-wider bg-stone-100 px-2 py-0.5 rounded-md">
                      {formatTimer(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-stone-500">
                      Didn&apos;t receive the 6-digit code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendingOtp}
                      className="font-normal text-xs sm:text-sm text-[#044133] hover:underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {isResendingOtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Resending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
