import { ClientFlat, SavedProperty, ClientPayment } from "@/components/dashboard/types";

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

export async function fetchUserPaymentInfo(
  userId: string | number
): Promise<UserPaymentApiResponse | null> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/user-payment-info?user_id=${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchUserPaymentInfo] API returned status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (!json?.success && !json?.data) {
      console.warn("[fetchUserPaymentInfo] API returned unsuccessful payload", json);
      return null;
    }

    const payload = Array.isArray(json.data) ? json.data[0] : json.data;
    const clientInfo = payload?.client_info || null;
    const rawSavedProperties: any[] = clientInfo?.savedProperties || [];
    const bookings: any[] = payload?.bookings || [];

    // Calculate aggregated stats from savedProperties as requested
    let sumPrice = 0;
    let sumPaid = 0;
    let sumDue = 0;

    if (rawSavedProperties.length > 0) {
      rawSavedProperties.forEach((prop) => {
        sumPrice += parseAmount(prop.price);
        sumPaid += parseAmount(prop.partial_payment);
        sumDue += parseAmount(prop.due_payment);
      });
    } else if (bookings.length > 0 && bookings[0]?.payment_info) {
      const payInfo = bookings[0].payment_info;
      sumPrice = parseAmount(payInfo.total_price);
      sumPaid = parseAmount(payInfo.total_paid);
      sumDue = parseAmount(payInfo.total_due);
    }

    // Map savedProperties strictly for "My Flats"
    const dynamicFlats: ClientFlat[] = rawSavedProperties.map((prop, idx) => ({
      id: prop.id || `saved-flat-${idx}`,
      title: prop.name || "The Premium Green Valley",
      flatNo: prop.flatNo || "",
      flatSize: prop.flatSize || "",
      location: prop.location?.trim() ? prop.location : "Gulshan 2, Dhaka",
      image: prop.image || "/image/progress/tph_green_valley.png",
      status: "Under Construction",
      construction_pct: 72,
      handover_date: prop.estimatedDate ? `Dec ${prop.estimatedDate}` : "Dec 2027",
      price: prop.price ? `৳ ${prop.price}` : formatTaka(parseAmount(prop.price)),
      partial_payment: prop.partial_payment ? String(prop.partial_payment) : undefined,
      due_payment: prop.due_payment ? String(prop.due_payment) : undefined,
      discount: prop.discount ? String(prop.discount) : undefined,
      slug: prop.slug || "the-premium-green-valley",
    }));

    // Extract dynamic payment history from bookings if available
    const payments: ClientPayment[] = [];
    if (bookings.length > 0) {
      const b = bookings[0];
      const projName = b?.project_info?.project_name || "The Premium Green Valley";
      const unit = b?.project_info?.flat_name ? ` (Unit ${b.project_info.flat_name})` : "";

      const landHistory = b?.payment_info?.land_share_info?.land_share_history || [];
      landHistory.forEach((item: any, i: number) => {
        payments.push({
          id: `land-${item.payment_id || i}`,
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
          id: `dev-${item.payment_id || i}`,
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

      // If there's an outstanding amount, list it as due
      if (sumDue > 0) {
        payments.push({
          id: `due-balance`,
          invoice_no: `TPHL-DUE-${b.booking_id || "BAL"}`,
          project: `${projName}${unit}`,
          installment_title: "Outstanding Installment Due",
          due_date: "15 Apr 2026",
          amount: formatTaka(sumDue),
          status: "due",
        });
      }
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
    console.error("[fetchUserPaymentInfo] Error fetching user payment info:", err);
    return null;
  }
}
