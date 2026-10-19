import { ClientFlat, SavedProperty, ClientPayment, ReferralDetails, ReferralTransaction } from "@/components/dashboard/types";

export interface UserPaymentApiResponse {
  clientInfo: {
    client_name?: string;
    phone?: string;
    email?: string;
    lead_id?: string;
    company?: string;
    designation?: string;
    savedProperties: SavedProperty[];
  } | null;
  savedProperties: SavedProperty[];
  dynamicFlats: ClientFlat[];
  stats: {
    totalPrice: number;
    totalPaid: number;
    totalDue: number;
    formattedPrice: string;
    formattedPaid: string;
    formattedDue: string;
  };
  payments: ClientPayment[];
}

export function parseAmount(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatTaka(val: number): string {
  if (val <= 0) return "৳ 0";
  // Format with standard South Asian numbering convention (Lakhs / Crores) or standard locale
  return `৳ ${val.toLocaleString("en-IN")}`;
}

export function resolveFlatLocation(prop: any, title?: string): string {
  const direct =
    prop?.location ||
    prop?.project_location ||
    prop?.project_address ||
    prop?.address ||
    prop?.community?.name ||
    prop?.community ||
    prop?.project?.location ||
    prop?.project?.project_map_location ||
    prop?.project_info?.location ||
    prop?.project_info?.address ||
    prop?.location_name ||
    prop?.area;

  if (typeof direct === "string" && direct.trim() && !direct.toLowerCase().includes("gulshan 2")) {
    return direct.trim();
  }

  const clean = (title || prop?.name || "").toLowerCase();
  if (
    clean.includes("bashundhara") ||
    clean.includes("symphony") ||
    clean.includes("zenith") ||
    clean.includes("novera") ||
    clean.includes("phoenix") ||
    clean.includes("novus") ||
    clean.includes("lumina") ||
    clean.includes("florence") ||
    clean.includes("horizon") ||
    clean.includes("canvas") ||
    clean.includes("prestige heights") ||
    clean.includes("armonia") ||
    clean.includes("ariston") ||
    clean.includes("velinor")
  ) {
    return "Bashundhara Residential Area";
  }
  if (clean.includes("nature") || clean.includes("cox")) {
    return "Cox's Bazar";
  }
  if (clean.includes("bayanno") || clean.includes("jolshiri")) {
    return "Jolshiri Abashon";
  }
  if (clean.includes("skyline") || clean.includes("amberleaf") || clean.includes("smart city")) {
    return "The Premium Smart City";
  }
  if (clean.includes("tprc") || clean.includes("royal city") || clean.includes("ati")) {
    return "ATI Model Society";
  }
  return "Ashulia Model Town";
}

export async function fetchUserPaymentInfo(
  userId: string | number
): Promise<UserPaymentApiResponse | null> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    // Switch to GET /users/{userId} as requested
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchUserPaymentInfo] /users/${userId} API returned status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (!json?.success && !json?.user && !json?.data) {
      console.warn("[fetchUserPaymentInfo] API returned unsuccessful payload", json);
      return null;
    }

    // Extract user payload from /users/{id} response
    const userPayload = json?.user || (Array.isArray(json?.data) ? json.data[0] : json?.data) || null;
    const rawSavedProperties: any[] = userPayload?.savedProperties || userPayload?.client_info?.savedProperties || [];
    const clientInfo = {
      client_name: userPayload?.name || userPayload?.client_name,
      phone: userPayload?.phone,
      email: userPayload?.email,
      lead_id: String(userPayload?.id || userId),
      savedProperties: rawSavedProperties,
    };

    // Calculate aggregated stats from savedProperties
    let sumPrice = 0;
    let sumPaid = 0;
    let sumDue = 0;

    if (rawSavedProperties.length > 0) {
      rawSavedProperties.forEach((prop: any) => {
        sumPrice += parseAmount(prop.price);
        sumPaid += parseAmount(prop.partial_payment);
        sumDue += parseAmount(prop.due_payment);
      });
    }

    // Map savedProperties strictly for "My Flats"
    const dynamicFlats: ClientFlat[] = rawSavedProperties.map((prop: any, idx: number) => ({
      id: prop.id || `saved-flat-${idx}`,
      project_id: prop.project_id || prop.projectId || prop.id,
      title: prop.name || "The Premium Green Valley",
      flatNo: prop.flatNo || "",
      flatSize: prop.flatSize || "",
      location: resolveFlatLocation(prop, prop.name || prop.title),
      image: prop.image || "/image/progress/tph_green_valley.png",
      status: "Under Construction",
      construction_pct: 72,
      handover_date: prop.estimatedDate ? `Dec ${prop.estimatedDate}` : "Dec 2027",
      price: prop.price ? `৳ ${prop.price}` : formatTaka(parseAmount(prop.price)),
      partial_payment: prop.partial_payment ? String(prop.partial_payment) : undefined,
      due_payment: prop.due_payment ? String(prop.due_payment) : undefined,
      discount: prop.discount ? String(prop.discount) : undefined,
      slug: prop.slug || "the-premium-green-valley",
      videoLink: prop.videoLink,
      videoLink2: prop.videoLink2,
      moneyReceiptLink: prop.moneyReceiptLink,
      purchaseDetailsLink: prop.purchaseDetailsLink,
    }));

    // Extract dynamic payment history from savedProperties and any bookings
    const payments: ClientPayment[] = [];

    // From savedProperties payments
    rawSavedProperties.forEach((prop: any, idx: number) => {
      const projName = prop.name || "The Premium Property";
      const unit = prop.flatNo ? ` (Unit ${prop.flatNo})` : "";

      if (prop.booking_money && parseAmount(prop.booking_money) > 0) {
        payments.push({
          id: `bm-${prop.id || "prop"}-${idx}`,
          invoice_no: `TPHL-BM-${prop.id || "prop"}-${idx + 1}`,
          project: `${projName}${unit}`,
          installment_title: "Booking Money",
          payment_date: prop.lastUpdated || "2024-01-01",
          due_date: prop.lastUpdated || "2024-01-01",
          amount: `৳ ${parseAmount(prop.booking_money).toLocaleString("en-IN")}`,
          status: "paid",
          method: "Bank Transfer",
        });
      }

      if (prop.land_share && parseAmount(prop.land_share) > 0) {
        payments.push({
          id: `ls-${prop.id || "prop"}-${idx}`,
          invoice_no: `TPHL-LS-${prop.id || "prop"}-${idx + 1}`,
          project: `${projName}${unit}`,
          installment_title: "Land Share Payment",
          payment_date: prop.lastUpdated || "2024-01-01",
          due_date: prop.lastUpdated || "2024-01-01",
          amount: `৳ ${parseAmount(prop.land_share).toLocaleString("en-IN")}`,
          status: "paid",
          method: "Bank Transfer",
        });
      }

      if (prop.development_charges && parseAmount(prop.development_charges) > 0) {
        payments.push({
          id: `dev-${prop.id || "prop"}-${idx}`,
          invoice_no: `TPHL-DEV-${prop.id || "prop"}-${idx + 1}`,
          project: `${projName}${unit}`,
          installment_title: "Development Charge",
          payment_date: prop.lastUpdated || "2024-01-01",
          due_date: prop.lastUpdated || "2024-01-01",
          amount: `৳ ${parseAmount(prop.development_charges).toLocaleString("en-IN")}`,
          status: "paid",
          method: "Bank Transfer",
        });
      }

      if (prop.due_payment && parseAmount(prop.due_payment) > 0) {
        payments.push({
          id: `due-${prop.id || "prop"}-${idx}`,
          invoice_no: `TPHL-DUE-${prop.id || "prop"}-${idx + 1}`,
          project: `${projName}${unit}`,
          installment_title: "Remaining Due",
          due_date: prop.estimatedDate ? `Dec ${prop.estimatedDate}` : "15 Apr 2026",
          amount: `৳ ${parseAmount(prop.due_payment).toLocaleString("en-IN")}`,
          status: "due",
        });
      }
    });

    // Also support any bookings if present
    const bookings: any[] = userPayload?.bookings || [];
    if (bookings.length > 0) {
      bookings.forEach((b: any, bIdx: number) => {
        const projName = b?.project_info?.project_name || "The Premium Property";
        const unit = b?.project_info?.flat_name ? ` (Unit ${b.project_info.flat_name})` : "";

        const landHistory = b?.payment_info?.land_share_info?.land_share_history || [];
        landHistory.forEach((item: any, i: number) => {
          payments.push({
            id: `land-${bIdx}-${item.payment_id || i}`,
            invoice_no: `TPHL-LND-${item.payment_id || i}`,
            project: `${projName}${unit}`,
            installment_title: item.payment_type ? item.payment_type.replace(/_/g, " ").toUpperCase() : "Land Share",
            payment_date: item.payment_date || "2024-01-01",
            due_date: item.payment_date || "2024-01-01",
            amount: `৳ ${parseAmount(item.amount_paid).toLocaleString("en-IN")}`,
            status: "paid",
            method: "Bank Transfer",
          });
        });

        const devHistory = b?.payment_info?.development_charge_info?.development_charge_history || [];
        devHistory.forEach((item: any, i: number) => {
          payments.push({
            id: `dev-${bIdx}-${item.payment_id || i}`,
            invoice_no: `TPHL-DEV-${item.payment_id || i}`,
            project: `${projName}${unit}`,
            installment_title: item.payment_type ? item.payment_type.replace(/_/g, " ").toUpperCase() : "Development Charge",
            payment_date: item.payment_date || "2024-01-01",
            due_date: item.payment_date || "2024-01-01",
            amount: `৳ ${parseAmount(item.amount_paid).toLocaleString("en-IN")}`,
            status: "paid",
            method: "Bank Transfer",
          });
        });
      });
    }

    return {
      clientInfo,
      savedProperties: rawSavedProperties,
      dynamicFlats,
      stats: {
        totalPrice: sumPrice,
        totalPaid: sumPaid,
        totalDue: sumDue,
        formattedPrice: formatTaka(sumPrice),
        formattedPaid: formatTaka(sumPaid),
        formattedDue: formatTaka(sumDue),
      },
      payments,
    };
  } catch (err) {
    console.error("[fetchUserPaymentInfo] Error fetching user from /users/{id}:", err);
    return null;
  }
}

export interface ProjectNoticeItem {
  id: string | number;
  project_id?: string | number;
  title: string;
  description: string;
  category: string;
  date: string;
  isUnread?: boolean;
  image?: string | null;
  views_count?: number;
}

export async function fetchProjectNotices(
  projectId: string | number
): Promise<ProjectNoticeItem[]> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/projects/${projectId}/notices`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchProjectNotices] Returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    const noticesList = json?.notices || (Array.isArray(json?.data) ? json.data : []);

    if (!Array.isArray(noticesList)) return [];

    return noticesList.map((item: any, idx: number) => {
      const createdDate = item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "Recent";

      return {
        id: item.id || `notice-${idx}`,
        project_id: item.project_id || projectId,
        title: item.title || "Project Notice",
        description: item.description || "",
        category: item.category || "General",
        date: createdDate,
        isUnread: item.isUnread ?? true,
        image: item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${baseUrl.replace(/\/api$/, "")}${item.image.startsWith("/") ? "" : "/"}${item.image}`
          : null,
        views_count: item.views_count || 0,
      };
    });
  } catch (err) {
    console.error(`[fetchProjectNotices] Error fetching notices for project ${projectId}:`, err);
    return [];
  }
}

export async function fetchUserReferralDetails(
  userId: string | number
): Promise<ReferralDetails | null> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const endpoint = `${baseUrl}/users/${userId}/referral-details`;
    console.log(`[fetchUserReferralDetails] Calling GET: ${endpoint}`);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchUserReferralDetails] API returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log("[fetchUserReferralDetails] Payload received:", data);

    if (!data?.success && data?.referral_code === undefined) {
      console.warn("[fetchUserReferralDetails] Unsuccessful payload", data);
      return null;
    }

    const rawTx = data?.transactions;
    let txList: ReferralTransaction[] = [];
    if (Array.isArray(rawTx)) {
      txList = rawTx;
    } else if (rawTx && typeof rawTx === "object") {
      txList = Object.values(rawTx);
    }

    return {
      success: Boolean(data.success),
      referral_code: data.referral_code || "",
      wallet_balance: typeof data.wallet_balance === "number" ? data.wallet_balance : Number(data.wallet_balance) || 0,
      referred_clients_count: Number(data.referred_clients_count) || 0,
      pending_referrals_count: Number(data.pending_referrals_count) || 0,
      transactions: txList,
    };
  } catch (err) {
    console.error(`[fetchUserReferralDetails] Error fetching referral details for user ${userId}:`, err);
    return null;
  }
}

