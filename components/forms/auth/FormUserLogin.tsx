"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";

export function FormUserLogin() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useFormUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/tphl-forms/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/tphl-forms/dashboard");
      } else {
        setErrorMessage(res.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf9] px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#044133]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-44 h-12 mb-4">
            <Image
              src="/image/logo/LOGO-GREEN.png"
              alt="The Premium Homes Ltd."
              fill
              priority
              sizes="180px"
              className="object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#044133]" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#044133]">
              TPHL Form Portal
            </span>
          </div>
          <h1 className="text-2xl font-serif text-[#1f2723]">Form Access Login</h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            Sign in to access and manage official TPHL form submissions and surveys.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-8 sm:p-9">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200/80 flex items-start gap-3 text-red-800 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="form-email"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="form-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@tphl.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#044133]/20 focus:border-[#044133] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="form-password"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="form-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-xl text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#044133]/20 focus:border-[#044133] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full mt-2 py-3 px-4 bg-[#044133] hover:bg-[#065845] active:bg-[#033026] text-white rounded-xl text-sm font-medium tracking-wide shadow-md shadow-[#044133]/15 hover:shadow-lg hover:shadow-[#044133]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info without register or forget password */}
        <div className="mt-8 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} The Premium Homes Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
}
