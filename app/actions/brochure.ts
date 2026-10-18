"use server";

export type BrochureLeadState = {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: number;
};

export async function submitBrochureLeadAction(
  _prevState: BrochureLeadState,
  formData: FormData,
): Promise<BrochureLeadState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const property_id = Number(formData.get("property_id"));

  if (!name || !email || !phone || !property_id) {
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
    const response = await fetch(`${baseUrl}/brochure-leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, phone, property_id }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      return {
        success: false,
        error:
          data?.message ||
          data?.error ||
          `Submission failed with status: ${response.status}. Please try again later.`,
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: data?.message || "Thank you! Your brochure is ready to download.",
      timestamp: Date.now(),
    };
  } catch (err: unknown) {
    console.error("[submitBrochureLeadAction Error]:", err);
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
