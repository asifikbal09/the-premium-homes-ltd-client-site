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
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/preloader";

const formContainerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.065,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.25,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

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
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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
    setSlideDirection(-1);
    setActiveSlide((prev) =>
      prev === 0 ? showcaseProjects.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setSlideDirection(1);
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

      setIsRedirecting(true);
      router.push("/dashboard");
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

      // Smooth redirect to dashboard with preloader
      setOtpModalOpen(false);
      setIsRedirecting(true);
      router.push("/dashboard");
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
      {isRedirecting && <LoadingScreen />}
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
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-10 xl:px-16 py-10 bg-white z-10"
        >
          <div className="w-full max-w-[403px] mx-auto flex flex-col">
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex justify-center transition-all duration-500",
                isRegister ? "mb-[28px]" : "mb-[43px]",
              )}
            >
              <Link
                href="/"
                className="inline-block transition-transform duration-300 hover:scale-[1.03]"
                aria-label="The Premium Homes Home"
              >
                <div className="relative w-[200px] sm:w-[230.55px] h-[52px]">
                  <Image
                    src="/image/logo/LOGO-GREEN.png"
                    alt="The Premium Homes Ltd."
                    fill
                    priority
                    sizes="231px"
                    className="object-contain object-center"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Global API Feedback Messages */}
            <AnimatePresence mode="wait">
              {apiError && (
                <motion.div
                  key="error-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-[8px] bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
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
                  className="mb-4 p-3.5 rounded-[8px] bg-emerald-50/90 border border-emerald-200 text-[#054b3c] text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
                  role="status"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#054b3c]" />
                  <div className="flex-1 font-normal">{apiSuccess}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cross-fading Form Content between Login and Register */}
            <AnimatePresence mode="wait" initial={false}>
              {!isRegister ? (
                // ==========================================
                // LOGIN FORM VIEW (Aligned with Figma 8232:20825)
                // ==========================================
                <motion.div
                  key="login-form-container"
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full flex flex-col gap-[32px]"
                >
                  {/* Heading & Supporting Text */}
                  <motion.div
                    variants={formItemVariants}
                    className="flex flex-col items-center justify-center gap-[12px] text-center w-full"
                  >
                    <h1 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[40px] font-medium text-[#054b3c] leading-none capitalize">
                      Log in to your account
                    </h1>
                    <p className="font-sans text-[16px] sm:text-[18px] font-normal text-[#546360] leading-[1.4] capitalize">
                      Welcome back! Please enter your details.
                    </p>
                  </motion.div>

                  <form
                    onSubmit={handleLoginSubmit(onLogin)}
                    noValidate
                    className="flex flex-col gap-[24px] w-full"
                  >
                    <div className="flex flex-col gap-[20px] w-full">
                      {/* Email Field */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[20px] items-start w-full"
                      >
                        <label
                          htmlFor="login-email"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Email Address
                        </label>
                        <div className="w-full">
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
                              "w-full h-[56px] px-[20px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] placeholder:text-[#727679] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                              loginErrors.email
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                            )}
                          />
                          {loginErrors.email && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {loginErrors.email.message}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Password Field */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[20px] items-start w-full"
                      >
                        <label
                          htmlFor="login-password"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Password
                        </label>
                        <div className="w-full">
                          <div className="relative w-full">
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
                                  message:
                                    "Password must be at least 6 characters",
                                },
                              })}
                              className={cn(
                                "w-full h-[56px] pl-[20px] pr-[52px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[24px] text-[#3b3e40] placeholder:text-[#667085] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                                loginErrors.password
                                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                  : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              tabIndex={-1}
                              className="absolute right-[20px] top-1/2 -translate-y-1/2 size-[24px] flex items-center justify-center text-[#546360] hover:text-[#054b3c] transition-colors cursor-pointer"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <Eye className="size-[22px]" />
                              ) : (
                                <EyeOff className="size-[22px]" />
                              )}
                            </button>
                          </div>
                          {loginErrors.password && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {loginErrors.password.message}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.div variants={formItemVariants} className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[56px] px-[24px] py-[16px] rounded-[100px] bg-[#054b3c] hover:bg-[#043d30] text-[#cfa564] font-sans text-[14px] font-medium leading-[1.7] uppercase tracking-[2px] transition-colors duration-300 shadow-[0_10px_25px_-8px_rgba(5,75,60,0.45)] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#cfa564]" />
                            <span className="trim">LOGGING IN...</span>
                          </>
                        ) : (
                          <span className="trim">login</span>
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Switch to Register Row (Styled with Remember/Forgot typography & layout) */}
                    <motion.div
                      variants={formItemVariants}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-sans text-[14px] leading-[20px] text-[#344054] font-normal">
                        Don&apos;t have an account?
                      </span>
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="font-sans text-[14px] leading-[20px] font-semibold text-[#054b3c] hover:underline transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Register now
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                // ==========================================
                // REGISTER FORM VIEW (Aligned with Figma Login Design)
                // ==========================================
                <motion.div
                  key="register-form-container"
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full flex flex-col gap-[24px]"
                >
                  {/* Heading & Supporting Text */}
                  <motion.div
                    variants={formItemVariants}
                    className="flex flex-col items-center justify-center gap-[12px] text-center w-full"
                  >
                    <h1 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[40px] font-medium text-[#054b3c] leading-none capitalize">
                      Create your account
                    </h1>
                    <p className="font-sans text-[16px] sm:text-[18px] font-normal text-[#546360] leading-[1.4] capitalize">
                      Join The Premium Homes for exclusive luxury access.
                    </p>
                  </motion.div>

                  <form
                    onSubmit={handleRegisterSubmit(onRegister)}
                    noValidate
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <div className="flex flex-col gap-[16px] w-full">
                      {/* Full Name */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[16px] items-start w-full"
                      >
                        <label
                          htmlFor="register-name"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Full Name
                        </label>
                        <div className="w-full">
                          <input
                            id="register-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                            {...registerRegister("name", {
                              required: "Full name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                              },
                            })}
                            className={cn(
                              "w-full h-[56px] px-[20px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] placeholder:text-[#727679] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                              registerErrors.name
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                            )}
                          />
                          {registerErrors.name && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {registerErrors.name.message}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Email Address */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[16px] items-start w-full"
                      >
                        <label
                          htmlFor="register-email"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Email Address
                        </label>
                        <div className="w-full">
                          <input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
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
                              "w-full h-[56px] px-[20px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] placeholder:text-[#727679] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                              registerErrors.email
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                            )}
                          />
                          {registerErrors.email && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {registerErrors.email.message}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Phone Number */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[16px] items-start w-full"
                      >
                        <label
                          htmlFor="register-phone"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Phone Number
                        </label>
                        <div className="w-full">
                          <input
                            id="register-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="Enter your phone number"
                            disabled={isSubmitting}
                            {...registerRegister("phone", {
                              required: "Phone number is required",
                              minLength: {
                                value: 7,
                                message: "Please enter a valid phone number",
                              },
                            })}
                            className={cn(
                              "w-full h-[56px] px-[20px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] placeholder:text-[#727679] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                              registerErrors.phone
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                            )}
                          />
                          {registerErrors.phone && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {registerErrors.phone.message}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Password Field */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[16px] items-start w-full"
                      >
                        <label
                          htmlFor="register-password"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Password
                        </label>
                        <div className="w-full">
                          <div className="relative w-full">
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
                                  message:
                                    "Password must be at least 6 characters",
                                },
                              })}
                              className={cn(
                                "w-full h-[56px] pl-[20px] pr-[52px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[24px] text-[#3b3e40] placeholder:text-[#667085] bg-white transition-all duration-300 outline-none focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                                registerErrors.password
                                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                  : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowRegPassword((prev) => !prev)
                              }
                              tabIndex={-1}
                              className="absolute right-[20px] top-1/2 -translate-y-1/2 size-[24px] flex items-center justify-center text-[#546360] hover:text-[#054b3c] transition-colors cursor-pointer"
                              aria-label={
                                showRegPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showRegPassword ? (
                                <Eye className="size-[22px]" />
                              ) : (
                                <EyeOff className="size-[22px]" />
                              )}
                            </button>
                          </div>
                          {registerErrors.password && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {registerErrors.password.message}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Primary Purpose Field */}
                      <motion.div
                        variants={formItemVariants}
                        className="flex flex-col gap-[16px] items-start w-full"
                      >
                        <label
                          htmlFor="register-purposes"
                          className="trim font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] whitespace-nowrap"
                        >
                          Primary Purpose
                        </label>
                        <div className="w-full">
                          <div className="relative w-full">
                            <select
                              id="register-purposes"
                              disabled={isSubmitting}
                              {...registerRegister("purposes", {
                                required: "Please select your primary purpose",
                              })}
                              className={cn(
                                "w-full h-[56px] pl-[20px] pr-[48px] py-[16px] rounded-[8px] border font-sans text-[16px] font-normal leading-[1.5] text-[#3b3e40] bg-white transition-all duration-300 outline-none appearance-none cursor-pointer focus:shadow-[0_4px_20px_-4px_rgba(5,75,60,0.1)]",
                                registerErrors.purposes
                                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                  : "border-[#e6e6e6] hover:border-[#cfa564]/60 focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10",
                              )}
                            >
                              <option value="Buying a property">
                                Buying a property
                              </option>
                              <option value="Investment opportunities">
                                Investment opportunities
                              </option>
                              <option value="Commercial space">
                                Commercial space
                              </option>
                              <option value="Selling a property">
                                Selling a property
                              </option>
                              <option value="Architectural consultation">
                                Architectural consultation
                              </option>
                              <option value="General inquiry">
                                General inquiry
                              </option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2 size-[20px] text-[#546360]" />
                          </div>
                          {registerErrors.purposes && (
                            <p className="mt-1.5 text-xs text-red-600 font-normal">
                              {registerErrors.purposes.message}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.div variants={formItemVariants} className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[56px] px-[24px] py-[16px] rounded-[100px] bg-[#054b3c] hover:bg-[#043d30] text-[#cfa564] font-sans text-[14px] font-medium leading-[1.7] uppercase tracking-[2px] transition-colors duration-300 shadow-[0_10px_25px_-8px_rgba(5,75,60,0.45)] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#cfa564]" />
                            <span className="trim">CREATING ACCOUNT...</span>
                          </>
                        ) : (
                          <span className="trim">register now</span>
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Switch to Login Row (Styled with Remember/Forgot typography & layout) */}
                    <motion.div
                      variants={formItemVariants}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-sans text-[14px] leading-[20px] text-[#344054] font-normal">
                        Already have an account?
                      </span>
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="font-sans text-[14px] leading-[20px] font-semibold text-[#054b3c] hover:underline transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Log in
                      </button>
                    </motion.div>
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
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "hidden lg:flex lg:w-1/2 relative min-h-screen bg-white select-none z-20 p-[24px]",
            isRegister ? "lg:pr-0" : "lg:pl-0",
          )}
        >
          <div className="relative w-full min-h-[calc(100vh-48px)] overflow-hidden bg-[#d9d9d9]">
            {isLoadingProjects || !currentProject ? (
              /* Skeleton Loading State */
              <div className="absolute inset-0 w-full h-full">
                {/* Shimmering backdrop skeleton */}
                <div className="absolute inset-0 w-full h-full bg-stone-900 animate-pulse" />

                {/* Floating Skeleton Card */}
                <div
                  className={cn(
                    "absolute inset-x-[32px] bottom-[30px] z-30 flex pointer-events-none",
                    isRegister ? "justify-start" : "justify-end",
                  )}
                >
                  <div className="w-[336px] bg-white/90 backdrop-blur-[5.13px] px-[30.779px] py-[25.649px] animate-pulse pointer-events-auto">
                    <div className="flex flex-col gap-[20.519px] items-center w-[274.443px] mx-auto">
                      <div className="flex flex-col gap-[10.26px] items-center w-full">
                        <div className="h-3 w-24 bg-stone-200" />
                        <div className="h-6 w-48 bg-stone-200" />
                        <div className="h-3 w-36 bg-stone-200" />
                      </div>
                      <div className="w-full h-[174.412px] bg-stone-200" />
                      <div className="flex items-center justify-between w-full">
                        <div className="w-6 h-3 bg-stone-200" />
                        <div className="w-[164.778px] h-[1.603px] bg-stone-200" />
                        <div className="w-6 h-3 bg-stone-200" />
                      </div>
                      <div className="space-y-1.5 w-full">
                        <div className="h-2.5 w-full bg-stone-200" />
                        <div className="h-2.5 w-4/5 bg-stone-200 mx-auto" />
                      </div>
                      <div className="h-[36px] w-[140px] rounded-full bg-stone-200" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Dynamic Background Image with Seamless Motion Cross-Dissolve & Figma Gradient */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentProject.bgImage}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }}
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
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(231.8289851092908deg, rgba(0, 0, 0, 0.7) 7.5858%, rgba(0, 0, 0, 0) 57.021%, rgba(0, 0, 0, 0.7) 100.09%)",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Showcase Project Card (Figma 8232:20829) */}
                <div
                  className={cn(
                    "absolute inset-x-[32px] bottom-[30px] z-30 flex pointer-events-none",
                    isRegister ? "justify-start" : "justify-end",
                  )}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.6, delay: 0.12 },
                      y: {
                        duration: 0.65,
                        delay: 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                    className="pointer-events-auto w-[336px] backdrop-blur-[5.13px] bg-[rgba(255,255,255,0.9)] px-[30.779px] py-[25.649px] flex items-center justify-center text-[#3b3e40]"
                  >
                    <div className="flex flex-col gap-[20.519px] items-center w-[274.443px]">
                      {/* Category, Title & Location (Figma 8232:20831) */}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`meta-${currentProject.id}`}
                          initial={{ opacity: 0, x: slideDirection * 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: slideDirection * -14 }}
                          transition={{
                            duration: 0.38,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex flex-col gap-[10.26px] items-center justify-center w-full"
                        >
                          <div className="flex flex-col gap-[7.695px] items-center">
                            <p className="trim font-sans text-[10px] font-normal leading-[1.5] tracking-[0.8px] uppercase text-[#054b3c] text-center">
                              {currentProject.category}
                            </p>
                            <h3 className="font-[family-name:var(--font-heading)] text-[24px] font-normal leading-none capitalize text-[#3b3e40] text-center">
                              {currentProject.title}
                            </h3>
                          </div>
                          <p className="font-sans text-[12px] font-normal leading-[1.6] text-[rgba(59,62,64,0.8)] text-center">
                            {currentProject.location}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Thumbnail, Pagination & Description/CTA (Figma 8232:20836) */}
                      <div className="flex flex-col gap-[20.519px] items-start w-full">
                        {/* Thumbnail + Slider Bar (Figma 8232:20837) */}
                        <div className="flex flex-col gap-[12.824px] items-start w-full">
                          <div className="zoom-frame relative w-full h-[174.412px] overflow-hidden bg-stone-200">
                            <AnimatePresence initial={false}>
                              <motion.div
                                key={currentProject.cardImage}
                                initial={{
                                  opacity: 0,
                                  scale: 1.08,
                                  x: slideDirection * 18,
                                }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{
                                  opacity: 0,
                                  scale: 1.02,
                                  x: slideDirection * -18,
                                }}
                                transition={{
                                  duration: 0.55,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="absolute inset-0 w-full h-full"
                              >
                                {currentProject.cardImage ? (
                                  <Image
                                    src={currentProject.cardImage}
                                    alt={currentProject.cardAlt}
                                    fill
                                    sizes="280px"
                                    className="object-cover object-center"
                                  />
                                ) : null}
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Navigation Slider Bar: < 1 —— 2 > (Figma 8232:20839) */}
                          <div className="flex items-center justify-between w-full">
                            <motion.button
                              whileHover={{ x: -1.5 }}
                              whileTap={{ scale: 0.92 }}
                              type="button"
                              onClick={handlePrevSlide}
                              aria-label="Previous project"
                              className="flex items-center text-[rgba(59,62,64,0.8)] hover:text-[#054b3c] transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="size-[15.389px] stroke-[1.5]" />
                              <span className="font-sans text-[10.26px] font-normal leading-none min-w-[5.771px] text-center">
                                {activeSlide + 1}
                              </span>
                            </motion.button>

                            <div className="relative h-[1.603px] w-[164.778px] bg-white overflow-hidden">
                              <motion.div
                                initial={false}
                                animate={{
                                  width: `${Math.round(((activeSlide + 1) / Math.max(showcaseProjects.length, 1)) * 100)}%`,
                                }}
                                transition={{
                                  duration: 0.55,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full bg-[#054b3c]"
                              />
                            </div>

                            <motion.button
                              whileHover={{ x: 1.5 }}
                              whileTap={{ scale: 0.92 }}
                              type="button"
                              onClick={handleNextSlide}
                              aria-label="Next project"
                              className="flex items-center text-[rgba(59,62,64,0.8)] hover:text-[#054b3c] transition-colors cursor-pointer"
                            >
                              <span className="font-sans text-[10.26px] font-normal leading-none min-w-[5.771px] text-center">
                                {showcaseProjects.length}
                              </span>
                              <ChevronRight className="size-[15.389px] stroke-[1.5]" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Description & VIEW PROJECT CTA (Figma 8232:20853) */}
                        <div className="flex flex-col gap-[15.389px] items-center justify-center w-full">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                              key={`desc-${currentProject.id}`}
                              initial={{ opacity: 0, x: slideDirection * 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: slideDirection * -10 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="font-sans text-[12px] font-normal leading-[1.6] text-[rgba(59,62,64,0.8)] text-center w-full line-clamp-2"
                            >
                              {currentProject.description}
                            </motion.p>
                          </AnimatePresence>

                          <Link
                            href={currentProject.href}
                            className="press relative inline-flex h-[36px] items-center justify-center overflow-hidden rounded-[64.122px] border-[0.641px] border-solid border-[#cfa564] px-[25.649px] py-[11.542px] shadow-[0px_2.565px_14.235px_-6.412px_rgba(50,38,29,0),0px_7.695px_12.824px_0px_rgba(108,73,19,0.1)] group"
                          >
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-[64.122px] backdrop-blur-[32.061px] bg-[rgba(207,165,100,0.15)] group-hover:bg-[rgba(207,165,100,0.24)] transition-colors duration-300 pointer-events-none"
                            />
                            <span className="trim relative z-10 font-sans text-[12px] font-medium leading-[1.7] tracking-[1.2824px] uppercase text-[#2f3233] text-center whitespace-nowrap">
                              View project
                            </span>
                            <span
                              aria-hidden
                              className="absolute inset-[-0.321px] rounded-[inherit] shadow-[inset_0px_4.489px_13.466px_0px_rgba(255,255,255,0.27),inset_0px_-3.847px_13.466px_0px_rgba(207,165,100,0.07)] pointer-events-none"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </div>
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
