/**
 * Resident video reviews: fallback list and YouTube helpers shared by the review sliders.
 */

export interface ReviewItem {
  id: number;
  name: string | null;
  role: string | null;
  rating?: number;
  videoUrl: string;
  review?: string | null;
  date?: string | null;
  project?: string | null;
  created_at?: string;
  updated_at?: string;
  image?: string | null;
  deleted_at?: string | null;
}

export const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: "Rj Kibria",
    role: "Business Owner",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/qM5_UKR-vzk",
    review:
      "The professionalism and transparency throughout the entire process was impressive. Premium Homes truly lives up to its name.",
    project: "The Premium Floral Haven",
  },
  {
    id: 2,
    name: "Md. Chowdhury",
    role: "Property Investor",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/k0a-Wvr-S10?si=O6-56ynjC2P06twC",
    review:
      "The Premium Homes exceeded all our expectations. The quality of construction and attention to detail is remarkable. Our family couldn't be happier!",
    project: "The Premium Green Valley",
  },
  {
    id: 7,
    name: "Valued Investor",
    role: "Investor",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/RHyHMzDHZQw",
    review: "একটি ভালো বিনিয়োগের পেছনে থাকে আস্থা এবং দীর্ঘমেয়াদি প্রত্যাশা।",
    project: "The Premium Residences",
  },
  {
    id: 8,
    name: "Valued Homeowner",
    role: "Flat Owner",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/DFMRRC9Ca0M",
    review:
      "আলহামদুলিল্লাহ! The Premium Azure Residence-এর জমি রেজিস্ট্রেশন সম্পন্ন",
    project: "The Premium Azure Residence",
  },
];

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/|shorts\/)([^?&"/]+)/);
  return match ? match[1] : null;
}

export function buildAutoplayEmbedUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&rel=0&playsinline=1&modestbranding=1`;
}

export function getThumbnailUrl(review: ReviewItem): string {
  if (review.image && review.image.trim() !== "") {
    return review.image;
  }
  const videoId = extractYouTubeId(review.videoUrl);
  if (!videoId) return "/image/studio6.png";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getReviewInfo(review: ReviewItem) {
  const trimmedName = review.name?.trim();
  const hasValidName = Boolean(
    trimmedName && trimmedName !== "" && trimmedName !== "-" && trimmedName.toLowerCase() !== "null",
  );

  const title = hasValidName
    ? trimmedName!
    : review.role
      ? `Valued ${review.role}`
      : "Valued Resident";

  const roleText = hasValidName ? review.role : null;
  const projectText = review.project || "The Premium Homes";

  const subtitle = [roleText, projectText].filter(Boolean).join(" • ");

  return { title, subtitle };
}
