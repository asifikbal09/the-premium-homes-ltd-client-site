"use server";

import { API_BASE } from "@/lib/api";

/** Body of POST /contacts. The property fields are sent only when the enquiry is about a project. */
export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message?: string;
  property_id?: string;
  property_name?: string;
  /** Where the enquiry was sent from, e.g. "contact_page". */
  source: string;
};

export type ContactResult = { success: true; message: string } | { success: false; error: string };

const FIELDS = ["name", "email", "phone", "subject", "message", "property_id", "property_name", "source"] as const;

/** Sends an enquiry to POST /contacts. Only the known fields are forwarded, trimmed; empty ones are left out. */
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const body: Partial<Record<(typeof FIELDS)[number], string>> = {};
  for (const field of FIELDS) {
    const value = input?.[field];
    if (typeof value === "string" && value.trim()) body[field] = value.trim();
  }

  if (!body.name || !body.email || !body.phone) {
    return { success: false, error: "Please fill in your name, email address and phone number." };
  }

  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        error: data?.message || data?.error || `We could not send your message (error ${res.status}). Please try again.`,
      };
    }

    return {
      success: true,
      message: data?.message || "Thank you! Your message has been sent. We will get back to you shortly.",
    };
  } catch (error) {
    console.error("[submitContact] Network error:", error);
    return { success: false, error: "We could not reach the server. Please check your connection and try again." };
  }
}
