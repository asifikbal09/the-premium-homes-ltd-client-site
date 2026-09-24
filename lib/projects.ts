export interface ProjectData {
  id: number;
  name: string;
  slug?: string;
  location?: string;
  community?: {
    name?: string;
  };
  price?: string;
  price_range?: string;
  beds?: number;
  size?: string;
  image: string;
  tag?: string | null;
  description?: string;
  hover_text?: string;
  brochure_link?: string;
  view?: string;
  status?: string;
  project_sale_status?: string;
  apartment_count?: number | null;
  building_type?: string;
  under_construction?: number;
}

export const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: 72,
    name: "The Premium Novera Heights",
    slug: "the-premium-novera-heights",
    location: "Bashundhara Residential Area",
    community: {
      name: "Bashundhara Residential Area",
    },
    price: "1 Crore - 2 Crore BDT",
    price_range: "1 Crore - 2 Crore BDT",
    beds: 3,
    size: "2150 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6aae6e950801d.png",
    description:
      "Exclusive luxury residences designed for sophisticated modern living.",
    status: "Ongoing",
    under_construction: 1,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 71,
    name: "The Premium Phoenix",
    slug: "the-premium-phoenix",
    location: "Bashundhara Residential Area",
    community: {
      name: "Bashundhara Residential Area",
    },
    price: "1 Crore - 2 Crore BDT",
    price_range: "1 Crore - 2 Crore BDT",
    beds: 3,
    size: "2200 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a9fb63a51b90.png",
    description:
      "Architectural masterpiece crafted with state-of-the-art sustainability.",
    status: "Ongoing",
    under_construction: 1,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 69,
    name: "The Premium Novus",
    slug: "the-premium-novus",
    location: "Bashundhara Residential Area",
    community: {
      name: "Bashundhara Residential Area",
    },
    price: "80 Lac - 1.5 Crore BDT",
    price_range: "80 Lac - 1.5 Crore BDT",
    beds: 3,
    size: "2200 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a92ac5dd0384.png",
    description:
      "A sanctuary of comfort with serene views and open-plan layouts.",
    status: "Ongoing",
    under_construction: 1,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 55,
    name: "The Premium Canvas of Happiness",
    slug: "the-premium-canvas-of-happiness",
    location: "Bashundhara Residential Area",
    community: {
      name: "Bashundhara Residential Area",
    },
    price: "1 Crore - 2 Crore BDT",
    price_range: "1 Crore - 2 Crore BDT",
    beds: 4,
    size: "2705 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a93cc43c0b37.jpeg",
    description:
      "Sustainable living in Dhaka's most sought-after prime location.",
    status: "Sold Out",
    under_construction: 0,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 61,
    name: "The Premium Serenity",
    slug: "the-premium-serenity",
    location: "Jolshiri Abashon",
    community: {
      name: "Jolshiri Abashon",
    },
    price: "2 Crore - 5 Crore BDT",
    price_range: "2 Crore - 5 Crore BDT",
    beds: 4,
    size: "2850 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a9fb48bbe252.png",
    description:
      "Panoramic lake-facing residences crafted for ultimate comfort.",
    status: "Ongoing",
    under_construction: 1,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 62,
    name: "TPSC Commercial",
    slug: "tpsc-commercial",
    location: "The Premium Smart City",
    community: {
      name: "The Premium Smart City",
    },
    price: "Above 5 Crore BDT",
    price_range: "Above 5 Crore BDT",
    beds: 3,
    size: "1565 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a4f2d4393793.png",
    description:
      "State-of-the-art corporate offices and premium retail developments.",
    status: "Sold Out",
    under_construction: 0,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 66,
    name: "TPRC Commercial",
    slug: "tprc-commercial",
    location: "ATI Model Society",
    community: {
      name: "The Premium Royal City",
    },
    price: "2 Crore - 5 Crore BDT",
    price_range: "2 Crore - 5 Crore BDT",
    beds: 3,
    size: "1565 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6aa145a8cb2a7.jpeg",
    description:
      "Premier commercial hub connecting thriving business ecosystems.",
    status: "Sold Out",
    under_construction: 0,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 31,
    name: "The Premium Fortune Residence",
    slug: "the-premium-fortune-residence",
    location: "Ashulia Model Town",
    community: {
      name: "Ashulia Model Town",
    },
    price: "50 Lac - 1 Crore BDT",
    price_range: "50 Lac - 1 Crore BDT",
    beds: 3,
    size: "1000 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e2897953d8.png",
    description: "Modern suburban elegance amidst nature and green landscape.",
    status: "Sold Out",
    under_construction: 0,
    tag: "LUXURY COLLECTION",
  },
  {
    id: 17,
    name: "The Premium Southpoint Villa",
    slug: "the-premium-southpoint-villa",
    location: "Ashulia Model Town",
    community: {
      name: "Ashulia Model Town",
    },
    price: "60 Lac - 1.2 Crore BDT",
    price_range: "60 Lac - 1.2 Crore BDT",
    beds: 3,
    size: "1600 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e2fab5868d.png",
    description:
      "Spacious architectural villa units with private balconies and amenities.",
    status: "Sold Out",
    under_construction: 0,
    tag: "LUXURY COLLECTION",
  },
];

function extractLocationString(
  loc: unknown,
  fallbackCommunity?: unknown,
): string {
  if (typeof loc === "string" && loc.trim().length > 0) {
    return loc.trim();
  }
  if (loc && typeof loc === "object") {
    const locObj = loc as { name?: string; address?: string };
    if (locObj.name && typeof locObj.name === "string" && locObj.name.trim()) {
      return locObj.name.trim();
    }
    if (
      locObj.address &&
      typeof locObj.address === "string" &&
      locObj.address.trim()
    ) {
      return locObj.address.trim();
    }
  }
  if (fallbackCommunity && typeof fallbackCommunity === "object") {
    const commObj = fallbackCommunity as { name?: string };
    if (
      commObj.name &&
      typeof commObj.name === "string" &&
      commObj.name.trim()
    ) {
      return commObj.name.trim();
    }
  }
  if (typeof fallbackCommunity === "string" && fallbackCommunity.trim()) {
    return fallbackCommunity.trim();
  }
  return "Dhaka, Bangladesh";
}

/**
 * Normalizes raw project API payload into a clean, safe ProjectData shape.
 */
function normalizeProject(
  raw: Partial<ProjectData> & Record<string, unknown>,
): ProjectData {
  let img = (typeof raw.image === "string" ? raw.image : "") || "";
  if (img && !img.startsWith("http")) {
    img = `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${img.replace(/^\/+/, "")}`;
  }
  if (!img) {
    img = "/image/projects/projectsHero.png";
  }

  const location = extractLocationString(raw.location, raw.community);
  const desc =
    raw.description && raw.description.trim().length > 10
      ? raw.description.trim()
      : `${location} — an exquisite address designed for modern luxury living.`;

  return {
    id: Number(raw.id) || Date.now(),
    name: raw.name || "Prestige Residence",
    slug:
      raw.slug ||
      (raw.name ? raw.name.toLowerCase().replace(/\s+/g, "-") : "project"),
    location,
    community: { name: location },
    price: raw.price || raw.price_range || "Contact for Price",
    price_range: raw.price_range || raw.price || "Contact for Price",
    beds: raw.beds && Number(raw.beds) > 0 ? Number(raw.beds) : 3,
    size: raw.size && raw.size.trim() ? raw.size : "1600 sft",
    image: img,
    tag: raw.tag || "LUXURY COLLECTION",
    description: desc,
    status:
      raw.status || (raw.under_construction === 1 ? "Ongoing" : "Sold Out"),
    project_sale_status: raw.project_sale_status,
    apartment_count: raw.apartment_count,
    building_type: raw.building_type,
    under_construction: raw.under_construction,
  };
}

/**
 * Central server-side data fetching point for all project data.
 * Used across server components with ISR caching.
 */
export async function getProjects(): Promise<ProjectData[]> {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api/";
  const cleanBase = baseUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${cleanBase}/projects`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(
        `[getProjects] API responded with ${res.status}, falling back to static projects.`,
      );
      return FALLBACK_PROJECTS;
    }

    const data = await res.json();
    const rawList = Array.isArray(data)
      ? data
      : data?.projects || data?.data || [];

    if (!Array.isArray(rawList) || rawList.length === 0) {
      return FALLBACK_PROJECTS;
    }

    return rawList.map((item) => normalizeProject(item));
  } catch (error) {
    console.warn(
      "[getProjects] Fetch error, falling back to static data:",
      error,
    );
    return FALLBACK_PROJECTS;
  }
}

export interface ProjectAmenity {
  id: number;
  name: string;
  image?: string;
  img?: string;
}

export interface ProjectUnit {
  id: number;
  name?: string;
  unit_name?: string;
  flatNo?: string;
  size?: string;
  sqft?: number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  balcony?: string | number;
  status?: string;
  price?: string;
  facing?: string;
  floor_plan_image?: string;
}

export interface ProjectDetail extends ProjectData {
  types?: string;
  images: string[];
  plot_size?: number | string;
  block_no?: string;
  front_road?: string;
  total_share?: number;
  unit_per_floor?: number;
  passenger_lift?: number;
  cargo_lift?: number;
  car_parking?: number;
  rooftop_gardening?: number;
  electricity_backup?: number;
  convention?: number;
  service_charge_per_emi?: string;
  amenities: ProjectAmenity[];
  units: ProjectUnit[];
  project_map_location?: string;
  map_link?: string;
  map_image?: string;
  latitude?: string;
  longitude?: string;
  video_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
}

function formatAssetUrl(url?: string, defaultFolder = "projects"): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/${defaultFolder}/${url.replace(/^\/+/, "")}`;
}

export interface RawProjectDetailPayload extends Partial<ProjectDetail> {
  type?: string;
  floor_wise_unit_meta?: unknown[];
}

export function normalizeProjectDetail(
  raw: RawProjectDetailPayload,
): ProjectDetail {
  const base = normalizeProject(raw as any);

  // Collect images list
  const rawImages: string[] =
    Array.isArray(raw.images) && raw.images.length > 0
      ? (raw.images as string[])
      : [base.image];
  const images = rawImages
    .map((img) => formatAssetUrl(img, "projects"))
    .filter(Boolean);
  if (images.length === 0) {
    images.push(base.image);
  }

  // Collect amenities
  const rawAmenities = (
    Array.isArray(raw.amenities) ? raw.amenities : []
  ) as Array<Partial<ProjectAmenity> & { img?: string }>;
  const amenities: ProjectAmenity[] = rawAmenities.map((a) => ({
    id: Number(a.id) || Math.random(),
    name: a.name || "Amenity",
    image: formatAssetUrl(a.image || a.img, "amenities"),
    img: formatAssetUrl(a.img || a.image, "amenities"),
  }));

  // Collect units / floor plans
  const rawUnits = (
    Array.isArray(raw.units)
      ? raw.units
      : Array.isArray(raw.floor_wise_unit_meta)
        ? (raw.floor_wise_unit_meta as unknown[])
        : []
  ) as Array<Partial<ProjectUnit> & { image?: string }>;
  const units: ProjectUnit[] = rawUnits.map((u) => ({
    id: Number(u.id) || Math.random(),
    name: u.name || u.unit_name || u.flatNo || "Unit",
    unit_name: u.unit_name || u.name || "Unit",
    flatNo: u.flatNo || u.unit_name || u.name || "Unit",
    size: u.size || (u.sqft ? `${u.sqft} sqft` : undefined),
    sqft: u.sqft ? Number(u.sqft) : undefined,
    bedrooms: u.bedrooms,
    bathrooms: u.bathrooms,
    balcony: u.balcony,
    status: u.status || "Available",
    price: u.price || "",
    facing: u.facing || "",
    floor_plan_image: formatAssetUrl(u.floor_plan_image || u.image, "projects"),
  }));

  return {
    ...base,
    types: (raw.types as string) || (raw.type as string) || "Single Project",
    images,
    plot_size: raw.plot_size as number | string | undefined,
    block_no: raw.block_no as string | undefined,
    front_road: raw.front_road as string | undefined,
    total_share: raw.total_share ? Number(raw.total_share) : undefined,
    unit_per_floor: raw.unit_per_floor ? Number(raw.unit_per_floor) : undefined,
    passenger_lift:
      raw.passenger_lift !== undefined ? Number(raw.passenger_lift) : undefined,
    cargo_lift:
      raw.cargo_lift !== undefined ? Number(raw.cargo_lift) : undefined,
    car_parking:
      raw.car_parking !== undefined ? Number(raw.car_parking) : undefined,
    rooftop_gardening:
      raw.rooftop_gardening !== undefined
        ? Number(raw.rooftop_gardening)
        : undefined,
    electricity_backup:
      raw.electricity_backup !== undefined
        ? Number(raw.electricity_backup)
        : undefined,
    convention:
      raw.convention !== undefined ? Number(raw.convention) : undefined,
    service_charge_per_emi: raw.service_charge_per_emi
      ? String(raw.service_charge_per_emi)
      : undefined,
    amenities,
    units,
    project_map_location: extractLocationString(
      raw.project_map_location,
      base.location,
    ),
    map_link: raw.map_link as string | undefined,
    map_image: raw.map_image
      ? formatAssetUrl(raw.map_image as string, "projects")
      : undefined,
    latitude: raw.latitude as string | undefined,
    longitude: raw.longitude as string | undefined,
    brochure_link: (raw.brochure_link as string) || base.brochure_link,
    video_tour_url: raw.video_tour_url as string | undefined,
    contact_phone: (raw.contact_phone as string) || "+8801700000000",
    contact_email:
      (raw.contact_email as string) || "sales@thepremiumhomesltd.com",
  };
}

/**
 * Central server-side data fetching point for an individual project by ID.
 * Directly calls https://api.dpremiumhomes.com/api/projects/get-property-by-id/?id={id}
 */
export async function getProjectById(
  id: string | number,
): Promise<ProjectDetail | null> {
  const numericId = Number(id);
  if (!numericId || isNaN(numericId)) {
    return null;
  }

  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api/";
  const cleanBase = baseUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(
      `${cleanBase}/projects/get-property-by-id/?id=${numericId}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      console.warn(
        `[getProjectById] API responded with ${res.status} for ID: ${numericId}`,
      );
      const fallback = FALLBACK_PROJECTS.find((p) => p.id === numericId);
      return fallback ? normalizeProjectDetail(fallback) : null;
    }

    const data = await res.json();
    const raw = data?.property || data?.data;

    if (!raw || !raw.name) {
      const fallback = FALLBACK_PROJECTS.find((p) => p.id === numericId);
      return fallback ? normalizeProjectDetail(fallback) : null;
    }

    return normalizeProjectDetail(raw);
  } catch (error) {
    console.warn(`[getProjectById] Fetch error for ID ${numericId}:`, error);
    const fallback = FALLBACK_PROJECTS.find((p) => p.id === numericId);
    return fallback ? normalizeProjectDetail(fallback) : null;
  }
}
