/**
 * Helper to resolve storage files (header images, user attachments, etc.)
 * Handles both local environment and production.
 * In production, Laravel storage files are hosted on api.dpremiumhomes.com.
 */
export const resolveStorageUrl = (path?: string | null, fullUrl: string | null = null): string => {
  const target =
    fullUrl && typeof fullUrl === "string" && (fullUrl.startsWith("http://") || fullUrl.startsWith("https://"))
      ? fullUrl
      : path && typeof path === "string"
      ? path.trim()
      : "";

  if (!target || target === "null") {
    return "";
  }

  // If local blob or data URL (preview before save), return as-is
  if (target.startsWith("blob:") || target.startsWith("data:")) {
    return target;
  }

  // If pointing to dpremiumhomes.com/storage/, rewrite to api.dpremiumhomes.com/storage/
  if (target.includes("dpremiumhomes.com/storage/")) {
    return target
      .replace("https://dpremiumhomes.com/storage/", "https://api.dpremiumhomes.com/storage/")
      .replace("http://dpremiumhomes.com/storage/", "https://api.dpremiumhomes.com/storage/");
  }

  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }

  // Strip leading slashes or duplicate 'storage/'
  let relativePath = target.replace(/^\/+/, "");
  if (relativePath.startsWith("storage/")) {
    relativePath = relativePath.replace(/^storage\/+/, "");
  }

  const backendBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dpremiumhomes.com/api"
  ).replace(/\/api\/?$/, "");

  return `${backendBase}/storage/${relativePath}`;
};
