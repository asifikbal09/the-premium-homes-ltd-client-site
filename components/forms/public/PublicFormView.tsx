"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { resolveStorageUrl } from "@/lib/forms/formUtils";
import { toast } from "sonner";
import {
  CheckCircle,
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  subtitle?: string;
  required?: boolean;
  options?: string[];
  hasOtherOption?: boolean;
  fileTypes?: string;
  maxFileSizeMb?: number;
}

interface PublicFormData {
  id?: number | string;
  campaign_name?: string;
  title?: string;
  description?: string;
  header_image?: string;
  header_image_url?: string;
  slug?: string;
  fields_json?: FormField[] | string;
}

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

interface PublicFormViewProps {
  slug: string;
}

export function PublicFormView({ slug }: PublicFormViewProps) {
  const [form, setForm] = useState<PublicFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Dynamic form responses state: { [questionKey]: string | string[] }
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fileAttachments, setFileAttachments] = useState<Record<string, File>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  const fetchForm = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/public-forms/${slug}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Form not found");
      }

      const resData = await res.json();
      const data: PublicFormData = resData?.form || resData?.data || resData;
      setForm(data);

      // Parse fields_json
      const fields: FormField[] = typeof data.fields_json === "string"
        ? JSON.parse(data.fields_json)
        : (data.fields_json || []);

      const initialData: Record<string, any> = {};
      fields.forEach((field, index) => {
        if (field.type === "notification_email") return;
        const key = `${field.label} (Q${index + 1})`;
        if (field.type === "checkbox") {
          initialData[key] = [];
        } else {
          initialData[key] = "";
        }
      });

      setFormData(initialData);
    } catch (error) {
      console.error("Public form load error:", error);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const handleInputChange = (key: string, value: any, type: string) => {
    if (type === "checkbox") {
      const current = formData[key] || [];
      const newValues = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      setFormData({ ...formData, [key]: newValues });
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please upload a smaller file.");
      return;
    }
    setFileAttachments((prev) => ({ ...prev, [fieldKey]: file }));
    setFormData((prev) => ({ ...prev, [fieldKey]: file.name }));
  };

  const handleRemoveFile = (fieldKey: string) => {
    setFileAttachments((prev) => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
    setFormData((prev) => ({ ...prev, [fieldKey]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields: FormField[] = typeof form?.fields_json === "string"
      ? JSON.parse(form.fields_json)
      : (form?.fields_json || []);

    // Validation checks
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.type === "notification_email") continue;
      const key = `${field.label} (Q${i + 1})`;
      const val = formData[key];

      if (field.required) {
        if (field.type === "file") {
          if (!fileAttachments[key]) {
            toast.error(`Please upload a file for: ${field.label}`);
            return;
          }
        } else if (field.type === "checkbox") {
          if (!val || val.length === 0) {
            toast.error(`Please select at least one option for: ${field.label}`);
            return;
          }
        } else {
          if (!val || String(val).trim() === "") {
            toast.error(`Please fill in required question: ${field.label}`);
            return;
          }
        }
      }

      // If email type, validate format
      if (field.type === "email" && val && String(val).trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val).trim())) {
          toast.error(`Please enter a valid email address for: ${field.label}`);
          return;
        }
      }

      // Check if "Other:" selected and text entered
      if (field.hasOtherOption) {
        if (field.type === "radio" && val === "Other") {
          if (!otherTexts[key]?.trim()) {
            toast.error(`Please specify your answer for "Other" in: ${field.label}`);
            return;
          }
        }
        if (field.type === "checkbox" && Array.isArray(val) && val.includes("Other")) {
          if (!otherTexts[key]?.trim()) {
            toast.error(`Please specify your answer for "Other" in: ${field.label}`);
            return;
          }
        }
      }
    }

    // Compile final data payload including otherTexts
    const finalData = { ...formData };
    Object.keys(otherTexts).forEach((key) => {
      const otherVal = otherTexts[key]?.trim();
      if (otherVal) {
        if (Array.isArray(finalData[key])) {
          finalData[key] = finalData[key].map((item: string) =>
            item === "Other" ? `Other: ${otherVal}` : item
          );
        } else if (finalData[key] === "Other") {
          finalData[key] = `Other: ${otherVal}`;
        }
      }
    });

    try {
      setSubmitting(true);
      const baseUrl = getApiBaseUrl();
      const payload = new FormData();
      payload.append("data_json", JSON.stringify(finalData));

      Object.keys(fileAttachments).forEach((fieldKey) => {
        if (fileAttachments[fieldKey]) {
          payload.append(`file_attachments[${fieldKey}]`, fileAttachments[fieldKey]);
        }
      });

      const res = await fetch(`${baseUrl}/public-forms/${slug}/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit form");
      }

      setSubmitted(true);
      toast.success("Response recorded successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "Error submitting form. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFileAttachments({});
    setOtherTexts({});
    fetchForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#044133] mb-3" />
        <p className="text-xs text-stone-500 font-normal">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-normal text-stone-800">Form Not Found</h1>
        <p className="text-xs text-stone-500 max-w-sm mt-1">
          This form is inactive, unpublished, or the link provided is invalid.
        </p>
      </div>
    );
  }

  const fields: FormField[] = typeof form.fields_json === "string"
    ? JSON.parse(form.fields_json)
    : (form.fields_json || []);

  const headerImgUrl = resolveStorageUrl(form.header_image_url || form.header_image);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm max-w-lg w-full p-8 sm:p-10 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 stroke-[1.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-normal text-[#1f2723]">
            Thank You!
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
            Your response for{" "}
            <span className="text-stone-800">
              &quot;{form.campaign_name || form.title || "this form"}&quot;
            </span>{" "}
            has been recorded successfully.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-xs font-normal text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit another response</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] py-8 sm:py-12 px-4 text-[#1f2723]">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          {headerImgUrl && (
            <div className="w-full bg-stone-100 relative overflow-hidden border-b border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headerImgUrl}
                alt="Form Header"
                className="w-full h-auto max-h-[380px] object-contain block mx-auto"
                onError={(e: any) => {
                  if (
                    e.target.src.includes("dpremiumhomes.com/storage/") &&
                    !e.target.src.includes("api.dpremiumhomes.com")
                  ) {
                    e.target.src = e.target.src.replace(
                      "https://dpremiumhomes.com/storage/",
                      "https://api.dpremiumhomes.com/storage/"
                    );
                  }
                }}
              />
            </div>
          )}
          <div className={`p-6 sm:p-8 ${!headerImgUrl ? "border-t-4 border-t-[#00a86b]" : ""}`}>
            <h1 className="text-2xl sm:text-3xl font-normal text-stone-900 leading-snug">
              {form.campaign_name || form.title || "Form Submission"}
            </h1>
            {form.description && (
              <div
                className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed prose prose-stone max-w-none font-normal"
                dangerouslySetInnerHTML={{ __html: form.description }}
              />
            )}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>* Indicates required question</span>
            </div>
          </div>
        </div>

        {/* Dynamic Question Cards */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, index) => {
            if (field.type === "notification_email") return null;
            const key = `${field.label} (Q${index + 1})`;
            const value = formData[key];

            return (
              <div
                key={field.id || index}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3 transition-colors hover:border-emerald-200"
              >
                <div>
                  <label className="block text-sm font-normal text-stone-900">
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-red-500 font-normal">*</span>
                    )}
                  </label>
                  {field.subtitle && (
                    <p className="text-xs text-stone-500 italic mt-0.5 font-normal">
                      {field.subtitle}
                    </p>
                  )}
                </div>

                {/* Field Inputs */}
                {/* Short Answer (text, phone) */}
                {(field.type === "text" || field.type === "phone") && (
                  <input
                    type={field.type === "phone" ? "tel" : "text"}
                    value={value || ""}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value, field.type)
                    }
                    placeholder="Your answer"
                    className="w-full border-b border-stone-300 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 bg-transparent transition-colors font-normal placeholder:text-stone-400"
                  />
                )}

                {/* Email */}
                {field.type === "email" && (
                  <input
                    type="email"
                    value={value || ""}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value, "email")
                    }
                    placeholder="name@example.com"
                    className="w-full border-b border-stone-300 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 bg-transparent transition-colors font-normal placeholder:text-stone-400"
                  />
                )}

                {/* Date */}
                {field.type === "date" && (
                  <input
                    type="date"
                    value={value || ""}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value, "date")
                    }
                    className="w-full border-b border-stone-300 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 bg-transparent transition-colors font-normal"
                  />
                )}

                {/* Time */}
                {field.type === "time" && (
                  <input
                    type="time"
                    value={value || ""}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value, "time")
                    }
                    className="w-full border-b border-stone-300 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 bg-transparent transition-colors font-normal"
                  />
                )}

                {/* Long Answer (textarea) */}
                {field.type === "textarea" && (
                  <textarea
                    rows={3}
                    value={value || ""}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value, "textarea")
                    }
                    placeholder="Your answer"
                    className="w-full border-b border-stone-300 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 bg-transparent transition-colors font-normal placeholder:text-stone-400 resize-y"
                  />
                )}

                {/* Multiple Choice (radio) */}
                {field.type === "radio" && (
                  <div className="space-y-2 pt-1">
                    {(field.options || []).map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer font-normal"
                      >
                        <input
                          type="radio"
                          name={key}
                          value={opt}
                          checked={value === opt}
                          onChange={() =>
                            handleInputChange(key, opt, "radio")
                          }
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                    {field.hasOtherOption && (
                      <div className="flex items-center gap-2 pt-1">
                        <label className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer font-normal">
                          <input
                            type="radio"
                            name={key}
                            value="Other"
                            checked={value === "Other"}
                            onChange={() =>
                              handleInputChange(key, "Other", "radio")
                            }
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Other:</span>
                        </label>
                        <input
                          type="text"
                          value={otherTexts[key] || ""}
                          disabled={value !== "Other"}
                          onChange={(e) =>
                            setOtherTexts({
                              ...otherTexts,
                              [key]: e.target.value,
                            })
                          }
                          placeholder="Please specify"
                          className="border-b border-stone-300 pb-1 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 flex-1 bg-transparent transition-colors font-normal disabled:opacity-40"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Checkboxes */}
                {field.type === "checkbox" && (
                  <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-2">
                    {(field.options || []).map((opt, optIdx) => {
                      const isChecked = Array.isArray(value) && value.includes(opt);
                      return (
                        <label
                          key={optIdx}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer font-normal"
                        >
                          <input
                            type="checkbox"
                            value={opt}
                            checked={isChecked}
                            onChange={() =>
                              handleInputChange(key, opt, "checkbox")
                            }
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                    {field.hasOtherOption && (
                      <div className="flex items-center gap-2 pt-1">
                        <label className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer font-normal">
                          <input
                            type="checkbox"
                            value="Other"
                            checked={Array.isArray(value) && value.includes("Other")}
                            onChange={() =>
                              handleInputChange(key, "Other", "checkbox")
                            }
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Other:</span>
                        </label>
                        <input
                          type="text"
                          value={otherTexts[key] || ""}
                          disabled={!Array.isArray(value) || !value.includes("Other")}
                          onChange={(e) =>
                            setOtherTexts({
                              ...otherTexts,
                              [key]: e.target.value,
                            })
                          }
                          placeholder="Please specify"
                          className="border-b border-stone-300 pb-1 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-600 flex-1 bg-transparent transition-colors font-normal disabled:opacity-40"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {field.type === "file" && (
                  <div className="pt-1">
                    {fileAttachments[key] ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="text-xs text-stone-800 truncate font-normal">
                            {fileAttachments[key].name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(key)}
                          className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 border border-dashed border-stone-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-stone-50/50 hover:bg-emerald-50/30 transition-colors">
                        <Upload className="w-5 h-5 text-stone-400 mb-1" />
                        <span className="text-xs text-stone-700 font-normal">
                          Click to select a file (PDF, DOC, Images up to 10MB)
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(key, e.target.files?.[0] || null)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00a86b] hover:bg-[#00915c] text-white text-xs sm:text-sm font-normal shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-[11px] text-stone-400 pt-4">
          Powered by The Premium Homes Ltd. Forms Portal
        </div>
      </div>
    </div>
  );
}
