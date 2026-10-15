"use server";

export type ContactActionState = {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: number;
};

export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || "Sales Inquiry";
  const message = (formData.get("message") as string)?.trim() || "";
  const source = (formData.get("source") as string)?.trim() || "contact_page";

  if (!name || !email || !phone) {
    return {
      success: false,
      error: "Please fill in all required fields (Name, Email, and Phone).",
      timestamp: Date.now(),
    };
  }

  const rawBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api";

  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  try {
    const response = await fetch(`${baseUrl}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message,
        source,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Submission failed with status: ${response.status}. Please try again later.`;

      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message:
        data?.message ||
        "Thank you! Your message has been sent successfully. We will get back to you shortly.",
      timestamp: Date.now(),
    };
  } catch (err: unknown) {
    console.error("[submitContactAction Error]:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please check your connection and try again.",
      timestamp: Date.now(),
    };
  }
}
