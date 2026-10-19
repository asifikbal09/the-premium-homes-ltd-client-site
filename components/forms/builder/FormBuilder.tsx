"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import { resolveStorageUrl } from "@/lib/forms/formUtils";
import {
  FORM_TEMPLATES,
  FormFieldItem,
  isRecruitmentForm,
} from "@/lib/forms/formTemplates";
import {
  ArrowLeft,
  Save,
  Send,
  Type,
  Mail,
  Phone,
  AlignLeft,
  CheckSquare,
  CircleDot,
  GripVertical,
  Trash2,
  Edit2,
  Settings,
  ExternalLink,
  Activity,
  Plus,
  Image as ImageIcon,
  Calendar,
  Clock,
  Upload,
  Briefcase,
  Lock,
  Layers,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

const FIELD_TYPES = [
  { id: "text", label: "Short Answer", icon: <Type size={18} /> },
  { id: "email", label: "Email", icon: <Mail size={18} /> },
  { id: "phone", label: "Phone", icon: <Phone size={18} /> },
  { id: "date", label: "Date", icon: <Calendar size={18} /> },
  { id: "time", label: "Time", icon: <Clock size={18} /> },
  { id: "textarea", label: "Long Answer", icon: <AlignLeft size={18} /> },
  { id: "radio", label: "Multiple Choice", icon: <CircleDot size={18} /> },
  { id: "checkbox", label: "Checkboxes", icon: <CheckSquare size={18} /> },
  { id: "file", label: "File Upload", icon: <Upload size={18} /> },
];

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

interface FormBuilderProps {
  id?: string | null;
}

export function FormBuilder({ id: propId }: FormBuilderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authFetch, token } = useFormUserAuth();

  const id = propId || null;
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<"builder" | "settings" | "preview" | "responses">("builder");
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FormFieldItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"custom" | "recruitment">("custom");
  const [copiedLink, setCopiedLink] = useState(false);

  // Apply recruitment template
  const applyRecruitmentTemplate = useCallback((confirmPrompt = true) => {
    if (confirmPrompt && fields.length > 0) {
      const ok = window.confirm(
        "Loading the Recruitment Form template will replace current fields with 17 standard fixed recruitment fields. Do you want to proceed?"
      );
      if (!ok) return;
    }
    const template = FORM_TEMPLATES.find((t) => t.id === "recruitment");
    if (template) {
      setFields(template.fields);
      if (!campaignName.trim()) {
        setCampaignName(template.defaultCampaignName);
      }
      if (!description.trim()) {
        setDescription(template.defaultDescription);
      }
      setSelectedCategory("recruitment");
      toast.success("Recruitment Form template loaded with 17 fixed fields!");
    }
  }, [fields.length, campaignName, description]);

  const applyCustomTemplate = useCallback((confirmPrompt = true) => {
    if (confirmPrompt && fields.length > 0) {
      const ok = window.confirm(
        "Switching to Custom Form will allow you to edit or add custom fields. Keep existing fields?"
      );
      if (!ok) {
        setFields([]);
        setCampaignName("");
        setDescription("");
      }
    }
    setSelectedCategory("custom");
  }, [fields.length]);

  // Load existing form in edit mode
  const fetchForm = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const baseUrl = getApiBaseUrl();
      const res = await authFetch(`${baseUrl}/tphl-forms/forms/${id}`);

      if (!res.ok) {
        throw new Error("Failed to load form details");
      }

      const resData = await res.json();
      const data = resData?.form || resData?.data || resData;

      setCampaignName(data.campaign_name || data.title || "");
      setDescription(data.description || "");
      setHeaderImage(data.header_image_url || data.header_image || "");
      const loadedFields = typeof data.fields_json === "string"
        ? JSON.parse(data.fields_json)
        : (data.fields_json || []);
      setFields(loadedFields);
      setSlug(data.slug || "");

      if (isRecruitmentForm(data)) {
        setSelectedCategory("recruitment");
      } else {
        setSelectedCategory("custom");
      }
    } catch (error) {
      console.error("Fetch form error:", error);
      toast.error("Failed to load form details");
      router.push("/tphl-forms/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, authFetch, router]);

  useEffect(() => {
    if (isEditing) {
      fetchForm();
    } else {
      const templateParam = searchParams.get("type") || searchParams.get("template");
      if (templateParam === "recruitment") {
        applyRecruitmentTemplate(false);
      }
    }
  }, [isEditing, fetchForm, searchParams, applyRecruitmentTemplate]);

  // Add question handler
  const handleAddField = (type: (typeof FIELD_TYPES)[0]) => {
    const newField: FormFieldItem = {
      id: Math.random().toString(36).substring(2, 11),
      type: type.id,
      label: `New ${type.label}`,
      subtitle: "",
      required: false,
      options: ["radio", "checkbox"].includes(type.id) ? ["Option 1"] : [],
      hasOtherOption: false,
      fileTypes: type.id === "file" ? "pdf,doc,docx,jpg,jpeg,png" : undefined,
      maxFileSizeMb: type.id === "file" ? 10 : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormFieldItem>) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
  };

  // Save handler (POST /tphl-forms/forms or POST /tphl-forms/forms/{id} with _method=PUT)
  const handleSave = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    try {
      setIsSaving(true);
      const baseUrl = getApiBaseUrl();
      const endpoint = `${baseUrl}/tphl-forms/forms`;

      const formData = new FormData();
      formData.append("campaign_name", campaignName.trim());
      formData.append("description", description);
      formData.append("fields_json", JSON.stringify(fields));
      formData.append("category", selectedCategory);

      if (headerImageFile) {
        formData.append("header_image", headerImageFile);
      }

      let res: Response;

      if (isEditing) {
        formData.append("_method", "PUT");
        res = await fetch(`${endpoint}/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || "Failed to update form");
        }

        const data = await res.json();
        if (data?.header_image_url || data?.header_image) {
          setHeaderImage(data.header_image_url || data.header_image);
        }
        setHeaderImageFile(null);
        toast.success("Form updated successfully!");
      } else {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || "Failed to create form");
        }

        const data = await res.json();
        const createdForm = data?.form || data?.data || data;
        toast.success("Form created successfully!");
        if (createdForm?.id) {
          router.push(`/tphl-forms/forms/${createdForm.id}/edit`);
        }
      }
    } catch (error: any) {
      console.error("Save form error:", error);
      toast.error(error?.message || "Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = slug ? `${origin}/f/${slug}` : "";

  const handleCopyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#044133] mb-3" />
        <p className="text-xs font-medium">Loading form details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf9] text-[#1f2723]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4 flex-1">
          <Link
            href="/tphl-forms/dashboard"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Customer Feedback Form"
            className="text-lg sm:text-xl font-bold text-stone-900 border-none outline-none focus:ring-0 w-full max-w-md bg-transparent placeholder-stone-400"
          />
          {slug && (
            <span className="hidden sm:inline-flex text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full items-center gap-1 font-medium shrink-0">
              <CheckSquare className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium bg-white text-xs cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#044133]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>

          {slug && (
            <a
              href={`/f/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a86b] hover:bg-[#00915c] text-white rounded-lg transition-colors shadow-xs text-xs font-semibold"
            >
              <Send className="w-4 h-4" />
              <span>Publish</span>
            </a>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 px-6">
        <div className="flex gap-8">
          {[
            { id: "builder", label: "Builder", icon: <Edit2 size={15} /> },
            { id: "settings", label: "Settings", icon: <Settings size={15} /> },
            { id: "preview", label: "Preview", icon: <ExternalLink size={15} /> },
            { id: "responses", label: "Responses", icon: <Activity size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "responses") {
                  if (isEditing) {
                    router.push(`/tphl-forms/forms/${id}/responses`);
                  } else {
                    toast.info("Please save the form first to view responses.");
                  }
                } else if (tab.id === "preview") {
                  if (slug) {
                    window.open(`/f/${slug}`, "_blank");
                  } else {
                    toast.info("Please save the form first to preview it.");
                  }
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`flex items-center gap-2 px-2 py-3.5 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#00a86b] text-[#00a86b]"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "builder" && (
          <>
            {/* Sidebar Tools: Add Question */}
            <div className="w-64 bg-white border-r border-stone-200 overflow-y-auto p-4 hidden md:block shrink-0">
              <h3 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wider">
                Add Question
              </h3>
              <div className="space-y-2">
                {FIELD_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleAddField(type)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-stone-50/80 border border-stone-200 rounded-lg text-stone-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition-all text-left text-xs font-medium cursor-pointer"
                  >
                    <span className="text-stone-500">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f8faf9]">
              <div className="max-w-3xl mx-auto space-y-6 pb-20">
                {/* Form Category / Template Selector Banner */}
                <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedCategory === "recruitment"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {selectedCategory === "recruitment" ? (
                        <Briefcase className="w-5 h-5" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          Form Category
                        </span>
                        {selectedCategory === "recruitment" && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <Lock className="w-2.5 h-2.5" /> 17 Fixed Fields
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                        {selectedCategory === "recruitment"
                          ? "Recruitment Form (Job Application)"
                          : "Custom / General Form"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200/60 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        applyCustomTemplate(selectedCategory === "recruitment")
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === "custom"
                          ? "bg-white text-stone-900 shadow-xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Custom Form
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRecruitmentTemplate(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedCategory === "recruitment"
                          ? "bg-[#044133] text-white shadow-xs"
                          : "text-emerald-800 hover:bg-emerald-50"
                      }`}
                    >
                      <Briefcase className="w-3 h-3" />
                      <span>Recruitment Form</span>
                    </button>
                  </div>
                </div>

                {/* Recruitment Info Banner if Active */}
                {selectedCategory === "recruitment" && (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 text-emerald-950 text-xs flex items-start gap-3 shadow-xs">
                    <Briefcase className="text-emerald-700 shrink-0 mt-0.5 w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-emerald-900">
                          Recruitment Template Active (17 Fixed Standard Fields)
                        </p>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                          TPHL Ascend Format
                        </span>
                      </div>
                      <p className="text-emerald-800 text-[11px] mt-1 leading-relaxed">
                        Pre-loaded with all candidate questions: Full Name, Phone, Email, Highest Educational Degree, 50+ Universities list, Passing Year, Major, CGPA, ECAs, Achievements, Experience, Last Role, Functions, 3 Screening Questions, and Resume PDF Upload.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Header Card */}
                <div className="bg-white rounded-xl shadow-xs border border-stone-200 overflow-hidden flex flex-col group transition-all hover:border-emerald-300">
                  {/* Banner / Header Image Area */}
                  <div className="w-full bg-stone-100 relative group/image overflow-hidden flex items-center justify-center border-b border-stone-100">
                    {(typeof headerImage === "string" &&
                      headerImage.trim() !== "" &&
                      headerImage !== "null") ||
                    headerImageFile ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={
                          headerImageFile
                            ? URL.createObjectURL(headerImageFile)
                            : resolveStorageUrl(headerImage)
                        }
                        alt="Form Header Banner"
                        className="w-full h-auto max-h-[360px] object-contain block"
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
                    ) : (
                      <div className="w-full py-10 flex items-center justify-center text-stone-400 flex-col gap-2">
                        <ImageIcon className="w-8 h-8 stroke-1" />
                        <span className="text-xs font-normal">
                          Add Header Image
                        </span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="text-white text-xs font-semibold bg-black/60 px-4 py-2 rounded-lg">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setHeaderImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Header Form Input Fields */}
                  <div className="p-6 sm:p-8 space-y-4 border-t-4 border-t-[#00a86b] relative">
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="text-2xl sm:text-3xl font-bold text-stone-900 border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:ring-0 outline-none w-full transition-colors px-0 bg-transparent placeholder-stone-300"
                      placeholder="Customer Feedback Form"
                    />
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                        FORM DESCRIPTION
                      </label>
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Please provide details, instructions, tables, or images for this form..."
                      />
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                {fields.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-semibold text-stone-900 mb-1">
                      Build your form
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Click on any field type from the left sidebar to add it to
                      your form.
                    </p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id || index}
                      className="bg-white rounded-xl shadow-xs border border-stone-200 p-6 flex gap-4 group transition-all hover:border-emerald-300"
                    >
                      <div className="text-stone-300 cursor-move pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, { label: e.target.value })
                              }
                              className="text-base font-semibold text-stone-900 border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:ring-0 outline-none w-full transition-colors px-0 bg-transparent"
                              placeholder="Question Title (e.g. Describe a situation... or Submit your Resume)"
                            />
                            <input
                              type="text"
                              value={field.subtitle || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  subtitle: e.target.value,
                                })
                              }
                              className="text-xs text-stone-500 italic border-b border-transparent hover:border-stone-300 focus:border-emerald-500 focus:ring-0 outline-none w-full transition-colors px-0 bg-transparent placeholder-stone-400 mt-1"
                              placeholder="Add description / subtitle (optional, e.g. Maximum 300 words, Upload 1 supported file: PDF)..."
                            />
                          </div>

                          <div className="flex items-center gap-3 text-xs text-stone-500 shrink-0 pt-1">
                            {(field.isFixed ||
                              (selectedCategory === "recruitment" &&
                                String(field.id).startsWith("rec_"))) && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                <Lock className="w-2.5 h-2.5" /> Fixed
                              </span>
                            )}
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    required: e.target.checked,
                                  })
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>Required</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => removeField(field.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Options Editor for Checkbox / Radio */}
                        {(field.type === "radio" ||
                          field.type === "checkbox") && (
                          <div className="space-y-2 pl-2">
                            {field.options.map((opt, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center gap-2"
                              >
                                {field.type === "radio" ? (
                                  <CircleDot className="w-3.5 h-3.5 text-stone-400" />
                                ) : (
                                  <CheckSquare className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...field.options];
                                    newOptions[optIndex] = e.target.value;
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:ring-0 outline-none text-xs text-stone-700 w-full max-w-xs transition-colors bg-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = field.options.filter(
                                      (_, i) => i !== optIndex
                                    );
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="text-stone-400 hover:text-red-500 cursor-pointer text-sm"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}

                            {field.hasOtherOption && (
                              <div className="flex items-center gap-2 pt-1 text-stone-500 italic text-xs">
                                {field.type === "radio" ? (
                                  <CircleDot className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                ) : (
                                  <CheckSquare className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                )}
                                <span className="text-stone-600">
                                  Other: ______________________
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateField(field.id, {
                                      hasOtherOption: false,
                                    })
                                  }
                                  className="text-stone-400 hover:text-red-500 cursor-pointer ml-1 text-sm font-bold"
                                  title="Remove 'Other' option"
                                >
                                  &times;
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateField(field.id, {
                                    options: [
                                      ...field.options,
                                      `Option ${field.options.length + 1}`,
                                    ],
                                  })
                                }
                                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Option
                              </button>

                              {!field.hasOtherOption && (
                                <>
                                  <span className="text-xs text-stone-400">
                                    or
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateField(field.id, {
                                        hasOtherOption: true,
                                      })
                                    }
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                                  >
                                    add &quot;Other&quot;
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {field.type === "date" && (
                          <div className="border-b border-stone-200 pb-2 text-stone-400 text-xs flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span>Date picker (MM/DD/YYYY)</span>
                          </div>
                        )}

                        {field.type === "time" && (
                          <div className="border-b border-stone-200 pb-2 text-stone-400 text-xs flex items-center gap-2">
                            <Clock className="w-4 h-4 text-stone-400" />
                            <span>Time picker (hh:mm AM/PM)</span>
                          </div>
                        )}

                        {(field.type === "text" ||
                          field.type === "email" ||
                          field.type === "phone") && (
                          <div className="border-b border-stone-200 pb-2 text-stone-400 text-xs">
                            Short answer text placeholder
                          </div>
                        )}

                        {field.type === "textarea" && (
                          <div className="border-b border-stone-200 pb-6 text-stone-400 text-xs">
                            Long answer text placeholder
                          </div>
                        )}

                        {field.type === "file" && (
                          <div className="border border-dashed border-stone-300 rounded-xl p-4 bg-stone-50/60 flex items-center gap-3 text-stone-500">
                            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-xs">
                              <p className="font-medium text-stone-700">
                                Visitor file upload area
                              </p>
                              <p className="text-[11px] text-stone-400 mt-0.5">
                                Accepts PDF, DOC, DOCX, Images (up to 10 MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="flex-1 p-8 bg-[#f8faf9] flex justify-center">
            <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-8 w-full max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-1">
                  Form Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Manage public access, URLs, and form campaign properties.
                </p>
              </div>

              {slug ? (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-emerald-900 text-xs mb-2">
                    Public Form URL
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="flex-1 bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 bg-[#00a86b] hover:bg-[#00915c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
                  Save this form first to generate its unique public URL and shareable link.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
