import {
  ClientFlat,
  SavedProperty,
  ClientPayment,
  ReferralDetails,
  ReferralTransaction,
  WishlistPropertyItem,
} from "@/components/dashboard/types";

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
    // Fetch GET /user-payment-info?user_id={userId} for payment history & breakdown,
    // alongside GET /users/{userId} for user profile & savedProperties
    const [paymentResResult, userResResult] = await Promise.allSettled([
      fetch(`${baseUrl}/user-payment-info?user_id=${userId}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/users/${userId}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
    ]);

    let paymentPayload: any = null;
    if (paymentResResult.status === "fulfilled" && paymentResResult.value.ok) {
      const paymentJson = await paymentResResult.value.json();
      if (paymentJson?.success || paymentJson?.data || paymentJson?.bookings) {
        paymentPayload = Array.isArray(paymentJson.data)
          ? paymentJson.data[0]
          : paymentJson.data || paymentJson;
      }
    } else if (paymentResResult.status === "fulfilled") {
      console.warn(
        `[fetchUserPaymentInfo] /user-payment-info?user_id=${userId} returned status ${paymentResResult.value.status}`
      );
    }

    let userPayload: any = null;
    if (userResResult.status === "fulfilled" && userResResult.value.ok) {
      const userJson = await userResResult.value.json();
      if (userJson?.success || userJson?.user || userJson?.data) {
        userPayload =
          userJson?.user ||
          (Array.isArray(userJson?.data) ? userJson.data[0] : userJson?.data) ||
          null;
      }
    }

    if (!paymentPayload && !userPayload) {
      console.warn("[fetchUserPaymentInfo] Neither /user-payment-info nor /users returned valid data");
      return null;
    }

    const paymentClientInfo = paymentPayload?.client_info || null;
    const rawSavedProperties: any[] =
      (Array.isArray(paymentClientInfo?.savedProperties) && paymentClientInfo.savedProperties.length > 0
        ? paymentClientInfo.savedProperties
        : null) ||
      userPayload?.savedProperties ||
      userPayload?.client_info?.savedProperties ||
      [];

    const bookings: any[] =
      (Array.isArray(paymentPayload?.bookings) && paymentPayload.bookings.length > 0
        ? paymentPayload.bookings
        : null) ||
      userPayload?.bookings ||
      [];

    const clientInfo = {
      client_name:
        paymentClientInfo?.client_name ||
        userPayload?.name ||
        userPayload?.client_name,
      phone: paymentClientInfo?.phone || userPayload?.phone,
      email: paymentClientInfo?.email || userPayload?.email,
      lead_id: String(
        paymentClientInfo?.lead_id || userPayload?.id || userId
      ),
      company: paymentClientInfo?.company || userPayload?.company,
      designation: paymentClientInfo?.designation || userPayload?.designation,
      savedProperties: rawSavedProperties,
    };

    // Calculate aggregated stats from savedProperties or bookings payment_info
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

    if (sumPrice === 0 && sumPaid === 0 && bookings.length > 0) {
      bookings.forEach((b: any) => {
        const payInfo = b?.payment_info;
        if (payInfo) {
          sumPrice += parseAmount(payInfo.total_price);
          sumPaid += parseAmount(payInfo.total_paid);
          sumDue += parseAmount(payInfo.total_due);
        }
      });
    }

    // Map savedProperties strictly for "My Flats"
    const dynamicFlats: ClientFlat[] = rawSavedProperties.map((prop: any, idx: number) => {
      const booking = parseAmount(prop.booking_money);
      const rawLand = parseAmount(prop.land_share);
      const regMoney = parseAmount(prop.registration_money || prop.registration);
      const devCharge = parseAmount(prop.development_charges || prop.development_charge);
      const totalPrice = parseAmount(prop.price);
      const totalPaid = parseAmount(prop.partial_payment);

      let totalLandShare = rawLand;
      if (rawLand > 0 && booking > 0) {
        if (totalPrice > 0 && Math.abs(totalPrice - (rawLand + booking + devCharge)) < Math.abs(totalPrice - (rawLand + devCharge))) {
          totalLandShare = rawLand + booking;
        } else {
          totalLandShare = rawLand;
        }
      } else if (rawLand === 0 && booking > 0) {
        totalLandShare = booking + regMoney;
      }

      let landShareDue = 0;
      if (prop.land_share_due !== undefined && prop.land_share_due !== null) {
        landShareDue = parseAmount(prop.land_share_due);
      } else {
        landShareDue = totalPaid >= totalLandShare ? 0 : Math.max(0, totalLandShare - totalPaid);
      }

      const totalDevCharge = devCharge > 0 ? devCharge : (totalPrice > totalLandShare ? (totalPrice - totalLandShare) : 0);
      let devChargeDue = 0;
      if (prop.development_charges_due !== undefined && prop.development_charges_due !== null) {
        devChargeDue = parseAmount(prop.development_charges_due);
      } else {
        if (landShareDue > 0) {
          devChargeDue = totalDevCharge;
        } else {
          const paidForDev = Math.max(0, totalPaid - totalLandShare);
          devChargeDue = paidForDev >= totalDevCharge ? 0 : Math.max(0, totalDevCharge - paidForDev);
        }
      }

      const perEmi = parseAmount(prop.per_emi_amount || prop.emi_amount);
      const totalEmi = parseInt(String(prop.total_emi || prop.total_installments || 0), 10);
      let paidEmiCount = 0;
      if (prop.paid_emi !== undefined && prop.paid_emi !== null) {
        paidEmiCount = Math.min(totalEmi, parseInt(String(prop.paid_emi), 10));
      } else if (perEmi > 0 && totalEmi > 0) {
        const paidAfterDev = Math.max(0, totalPaid - (totalLandShare + totalDevCharge));
        paidEmiCount = Math.min(totalEmi, Math.floor(paidAfterDev / perEmi));
      }

      return {
        id: `flat-${prop.id || "prop"}-${idx}`,
        project_id: prop.project_id || prop.projectId || prop.id,
        title: prop.name || "The Premium Green Valley",
        flatNo: prop.flatNo || "",
        flatSize: prop.flatSize || "",
        location: resolveFlatLocation(prop, prop.name || prop.title),
        image: prop.image || "/image/progress/tph_green_valley.png",
        status: "Under Construction",
        construction_pct: parseAmount(prop.construction_pct || prop.progress) || 0,
        handover_date: prop.estimatedDate ? `Dec ${prop.estimatedDate}` : "Dec 2027",
        price: prop.price ? `৳ ${prop.price}` : formatTaka(parseAmount(prop.price)),
        partial_payment: prop.partial_payment ? String(prop.partial_payment) : undefined,
        due_payment: prop.due_payment ? String(prop.due_payment) : undefined,
        discount: prop.discount ? String(prop.discount) : undefined,
        booking_money: prop.booking_money ? String(prop.booking_money) : undefined,
        land_share: totalLandShare > 0 ? String(totalLandShare) : (prop.land_share ? String(prop.land_share) : undefined),
        development_charges: totalDevCharge > 0 ? String(totalDevCharge) : (prop.development_charges ? String(prop.development_charges) : undefined),
        land_share_due: landShareDue,
        development_charges_due: devChargeDue,
        per_emi_amount: perEmi > 0 ? perEmi : undefined,
        total_emi: totalEmi > 0 ? totalEmi : undefined,
        paid_emi: paidEmiCount,
        slug: prop.slug || "the-premium-green-valley",
        videoLink: prop.videoLink,
        videoLink2: prop.videoLink2,
        moneyReceiptLink: prop.moneyReceiptLink,
        purchaseDetailsLink: prop.purchaseDetailsLink,
      };
    });

    // If user has bookings in /user-payment-info but no savedProperties, populate dynamicFlats from bookings
    if (dynamicFlats.length === 0 && bookings.length > 0) {
      bookings.forEach((b: any, bIdx: number) => {
        const projInfo = b?.project_info || {};
        const payInfo = b?.payment_info || {};
        const landInfo = payInfo?.land_share_info || {};
        const devInfo = payInfo?.development_charge_info || {};

        dynamicFlats.push({
          id: `flat-booking-${b.booking_id || bIdx}`,
          project_id: projInfo.project_id || b.project_id || b.booking_id,
          title: projInfo.project_name || "The Premium Property",
          flatNo: projInfo.flat_name || "",
          flatSize: projInfo.flat_size || "",
          location: resolveFlatLocation(projInfo, projInfo.project_name),
          image: projInfo.project_image || "/image/progress/tph_green_valley.png",
          status: "Under Construction",
          construction_pct: parseAmount(projInfo.construction_pct || projInfo.progress) || 0,
          handover_date: projInfo.handover_date || "Dec 2027",
          price: formatTaka(parseAmount(payInfo.total_price)),
          partial_payment: String(parseAmount(payInfo.total_paid)),
          due_payment: String(parseAmount(payInfo.total_due)),
          land_share: String(parseAmount(landInfo.total_land_share || landInfo.land_share_amount)),
          development_charges: String(parseAmount(devInfo.total_development_charge || devInfo.development_charge_amount)),
          land_share_due: parseAmount(landInfo.land_share_due),
          development_charges_due: parseAmount(devInfo.development_charge_due),
          slug: projInfo.slug || "the-premium-green-valley",
        });
      });
    }

    // Extract dynamic payment history & proper breakdown from GET /user-payment-info?user_id={userId}
    const payments: ClientPayment[] = [];
    const flatsWithBookingHistory = new Set<string>();

    // Helper to format payment_type from user-payment-info nicely
    const formatPaymentPurpose = (rawType?: string, fallback = "Installment Payment"): string => {
      if (!rawType) return fallback;
      return rawType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // 1. Primary source: bookings[].payment_info from GET /user-payment-info?user_id={userId}
    if (bookings.length > 0) {
      bookings.forEach((b: any, bIdx: number) => {
        const projName = b?.project_info?.project_name || "The Premium Property";
        const rawFlatName = b?.project_info?.flat_name ? String(b.project_info.flat_name).trim() : "";
        const unit = rawFlatName ? ` (Unit ${rawFlatName})` : "";

        // Match booking to a flat in dynamicFlats
        const matchedFlat =
          dynamicFlats.find(
            (f) =>
              rawFlatName &&
              f.flatNo &&
              f.flatNo.trim().toLowerCase() === rawFlatName.toLowerCase()
          ) ||
          dynamicFlats.find(
            (f) =>
              f.title &&
              projName &&
              f.title.trim().toLowerCase() === projName.trim().toLowerCase()
          ) ||
          dynamicFlats[bIdx] ||
          dynamicFlats[0];

        const flatId = matchedFlat?.id || `flat-booking-${b.booking_id || bIdx}`;
        const flatNo = matchedFlat?.flatNo || rawFlatName;

        const payInfo = b?.payment_info || {};
        const landInfo = payInfo?.land_share_info || {};
        const devInfo = payInfo?.development_charge_info || {};
        const instInfo = payInfo?.installment_info || payInfo?.emi_info || {};

        const landHistory: any[] = Array.isArray(landInfo?.land_share_history)
          ? landInfo.land_share_history
          : [];
        const devHistory: any[] = Array.isArray(devInfo?.development_charge_history)
          ? devInfo.development_charge_history
          : [];
        const emiHistory: any[] = Array.isArray(instInfo?.installment_history)
          ? instInfo.installment_history
          : Array.isArray(instInfo?.emi_history)
          ? instInfo.emi_history
          : [];

        if (landHistory.length > 0 || devHistory.length > 0 || emiHistory.length > 0) {
          flatsWithBookingHistory.add(String(flatId));
        }

        // Stage 1: Land Share History (Booking Money, Registration Money, Land Share)
        landHistory.forEach((item: any, i: number) => {
          const amountVal = parseAmount(item.amount_paid ?? item.amount);
          if (amountVal <= 0) return;
          payments.push({
            id: `land-${b.booking_id || bIdx}-${item.payment_id || i}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no:
              item.transaction_id ||
              item.receipt_no ||
              item.invoice_no ||
              `TPHL-LND-${item.payment_id || i + 1}`,
            project: `${projName}${unit}`,
            installment_title: formatPaymentPurpose(item.payment_type, "Land Share Payment"),
            payment_date: item.payment_date || item.created_at || "—",
            due_date: item.payment_date || item.created_at || "—",
            amount: formatTaka(amountVal),
            status: "paid",
            stage: "land_share",
            method: item.payment_method || "Bank Transfer",
          });
        });

        const landDueVal = parseAmount(
          landInfo?.land_share_due ?? matchedFlat?.land_share_due
        );
        if (landDueVal > 0 && landHistory.length > 0) {
          payments.push({
            id: `land-due-${b.booking_id || bIdx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-LND-DUE-${b.booking_id || bIdx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Land Share Payment Due",
            due_date: landInfo?.due_date || matchedFlat?.handover_date || "Upcoming",
            amount: formatTaka(landDueVal),
            status: "due",
            stage: "land_share",
          });
        }

        // Stage 2: Development Charge History
        devHistory.forEach((item: any, i: number) => {
          const amountVal = parseAmount(item.amount_paid ?? item.amount);
          if (amountVal <= 0) return;
          payments.push({
            id: `dev-${b.booking_id || bIdx}-${item.payment_id || i}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no:
              item.transaction_id ||
              item.receipt_no ||
              item.invoice_no ||
              `TPHL-DEV-${item.payment_id || i + 1}`,
            project: `${projName}${unit}`,
            installment_title: formatPaymentPurpose(item.payment_type, "Development Charge"),
            payment_date: item.payment_date || item.created_at || "—",
            due_date: item.payment_date || item.created_at || "—",
            amount: formatTaka(amountVal),
            status: "paid",
            stage: "development",
            method: item.payment_method || "Bank Transfer",
          });
        });

        const devDueVal = parseAmount(
          devInfo?.development_charge_due ?? matchedFlat?.development_charges_due
        );
        if (devDueVal > 0 && (landHistory.length > 0 || devHistory.length > 0)) {
          payments.push({
            id: `dev-due-${b.booking_id || bIdx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-DEV-DUE-${b.booking_id || bIdx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Development Charge Due",
            due_date: devInfo?.due_date || matchedFlat?.handover_date || "Upcoming",
            amount: formatTaka(devDueVal),
            status: landDueVal > 0 ? "upcoming" : "due",
            stage: "development",
          });
        }

        // Stage 3: EMI / Installment History from booking if present
        emiHistory.forEach((item: any, i: number) => {
          const amountVal = parseAmount(item.amount_paid ?? item.amount);
          if (amountVal <= 0) return;
          payments.push({
            id: `emi-hist-${b.booking_id || bIdx}-${item.payment_id || i}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no:
              item.transaction_id ||
              item.receipt_no ||
              item.invoice_no ||
              `TPHL-EMI-${item.payment_id || i + 1}`,
            project: `${projName}${unit}`,
            installment_title: formatPaymentPurpose(
              item.payment_type || item.title,
              `Installment #${i + 1}`
            ),
            payment_date: item.payment_date || item.created_at || "—",
            due_date: item.payment_date || item.created_at || "—",
            amount: formatTaka(amountVal),
            status: "paid",
            stage: "emi",
            emi_number: i + 1,
            method: item.payment_method || "Bank Transfer",
          });
        });
      });
    }

    // 2. From savedProperties breakdown (for properties without booking history records or additional EMI breakdown)
    rawSavedProperties.forEach((prop: any, idx: number) => {
      const projName = prop.name || "The Premium Property";
      const unit = prop.flatNo ? ` (Unit ${prop.flatNo})` : "";
      const flatId = `flat-${prop.id || "prop"}-${idx}`;
      const flatNo = prop.flatNo || "";

      // Skip Land Share & Dev Charge synthesis if real booking history already populated this flat
      const hasBookingRecords = flatsWithBookingHistory.has(flatId);

      const booking = parseAmount(prop.booking_money);
      const rawLand = parseAmount(prop.land_share);
      const regMoney = parseAmount(prop.registration_money || prop.registration);
      const devCharge = parseAmount(prop.development_charges || prop.development_charge);
      const totalPrice = parseAmount(prop.price);
      const totalPaid = parseAmount(prop.partial_payment);
      const totalDue = parseAmount(prop.due_payment);

      // 1. Stage 1: Landshare Money (Booking Money + Registration Money = Landshare Money)
      let totalLandShare = rawLand;
      if (rawLand > 0 && booking > 0) {
        if (totalPrice > 0 && Math.abs(totalPrice - (rawLand + booking + devCharge)) < Math.abs(totalPrice - (rawLand + devCharge))) {
          totalLandShare = rawLand + booking;
        } else {
          totalLandShare = rawLand;
        }
      } else if (rawLand === 0 && booking > 0) {
        totalLandShare = booking + regMoney;
      }

      let landShareDue = 0;
      let landSharePaid = 0;
      if (prop.land_share_due !== undefined && prop.land_share_due !== null) {
        landShareDue = parseAmount(prop.land_share_due);
        landSharePaid = Math.max(0, totalLandShare - landShareDue);
      } else {
        if (totalPaid >= totalLandShare) {
          landSharePaid = totalLandShare;
          landShareDue = 0;
        } else {
          landSharePaid = totalPaid;
          landShareDue = Math.max(0, totalLandShare - totalPaid);
        }
      }

      if (!hasBookingRecords && totalLandShare > 0) {
        // Show Booking Money & Land Share breakdown clearly if booking_money is present
        if (booking > 0 && landSharePaid >= booking && totalLandShare > booking) {
          payments.push({
            id: `bm-${prop.id || "prop"}-${idx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-BM-${prop.id || "prop"}-${idx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Booking Money",
            payment_date: prop.lastUpdated || "2024-01-01",
            due_date: prop.lastUpdated || "2024-01-01",
            amount: formatTaka(booking),
            status: "paid",
            stage: "land_share",
            method: "Bank Transfer",
          });

          const remainingLandPaid = Math.max(0, landSharePaid - booking);
          if (remainingLandPaid > 0) {
            payments.push({
              id: `ls-${prop.id || "prop"}-${idx}`,
              flat_id: flatId,
              flat_no: flatNo,
              invoice_no: `TPHL-LS-${prop.id || "prop"}-${idx + 1}`,
              project: `${projName}${unit}`,
              installment_title:
                landShareDue <= 0 ? "Land Share Payment" : "Land Share Payment (Partial)",
              payment_date: prop.lastUpdated || "2024-01-01",
              due_date: prop.lastUpdated || "2024-01-01",
              amount: formatTaka(remainingLandPaid),
              status: "paid",
              stage: "land_share",
              method: "Bank Transfer",
            });
          }
        } else if (landSharePaid > 0) {
          payments.push({
            id: `ls-${prop.id || "prop"}-${idx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-LS-${prop.id || "prop"}-${idx + 1}`,
            project: `${projName}${unit}`,
            installment_title:
              landShareDue <= 0 ? "Land Share Payment" : "Land Share Payment (Partial)",
            payment_date: prop.lastUpdated || "2024-01-01",
            due_date: prop.lastUpdated || "2024-01-01",
            amount: formatTaka(landSharePaid),
            status: "paid",
            stage: "land_share",
            method: "Bank Transfer",
          });
        }

        if (landShareDue > 0) {
          payments.push({
            id: `ls-due-${prop.id || "prop"}-${idx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-LS-DUE-${prop.id || "prop"}-${idx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Land Share Payment Due",
            due_date: prop.estimatedDate ? `15 Dec ${prop.estimatedDate}` : "15 May 2025",
            amount: formatTaka(landShareDue),
            status: "due",
            stage: "land_share",
          });
        }
      }

      // 2. Stage 2: Development Charge (Comes after Land Share)
      const totalDevCharge = devCharge > 0 ? devCharge : (totalPrice > totalLandShare ? (totalPrice - totalLandShare) : 0);
      let devChargePaid = 0;
      let devChargeDue = 0;
      if (prop.development_charges_due !== undefined && prop.development_charges_due !== null) {
        devChargeDue = parseAmount(prop.development_charges_due);
        devChargePaid = Math.max(0, totalDevCharge - devChargeDue);
      } else {
        if (landShareDue > 0) {
          devChargePaid = 0;
          devChargeDue = totalDevCharge;
        } else {
          const paidForDev = Math.max(0, totalPaid - totalLandShare);
          if (paidForDev >= totalDevCharge) {
            devChargePaid = totalDevCharge;
            devChargeDue = 0;
          } else {
            devChargePaid = paidForDev;
            devChargeDue = Math.max(0, totalDevCharge - paidForDev);
          }
        }
      }

      if (!hasBookingRecords && totalDevCharge > 0) {
        if (devChargeDue <= 0) {
          payments.push({
            id: `dev-${prop.id || "prop"}-${idx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-DEV-${prop.id || "prop"}-${idx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Development Charge",
            payment_date: prop.lastUpdated || "2024-03-01",
            due_date: prop.lastUpdated || "2024-03-01",
            amount: formatTaka(totalDevCharge),
            status: "paid",
            stage: "development",
            method: "Bank Transfer",
          });
        } else {
          if (devChargePaid > 0) {
            payments.push({
              id: `dev-paid-${prop.id || "prop"}-${idx}`,
              flat_id: flatId,
              flat_no: flatNo,
              invoice_no: `TPHL-DEV-${prop.id || "prop"}-${idx + 1}`,
              project: `${projName}${unit}`,
              installment_title: "Development Charge (Partial)",
              payment_date: prop.lastUpdated || "2024-03-01",
              due_date: prop.lastUpdated || "2024-03-01",
              amount: formatTaka(devChargePaid),
              status: "paid",
              stage: "development",
              method: "Bank Transfer",
            });
          }
          payments.push({
            id: `dev-due-${prop.id || "prop"}-${idx}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-DEV-DUE-${prop.id || "prop"}-${idx + 1}`,
            project: `${projName}${unit}`,
            installment_title: "Development Charge Due",
            due_date: prop.estimatedDate ? `15 Oct ${prop.estimatedDate}` : "15 Aug 2025",
            amount: formatTaka(devChargeDue),
            status: landShareDue > 0 ? "upcoming" : "due",
            stage: "development",
          });
        }
      }

      // 3. Stage 3: EMI Installments (Begins after Development Charge is completed)
      const perEmi = parseAmount(prop.per_emi_amount || prop.emi_amount);
      const totalEmi = parseInt(String(prop.total_emi || prop.total_installments || 0), 10);

      if (perEmi > 0 && totalEmi > 0) {
        let paidEmiCount = 0;
        if (prop.paid_emi !== undefined && prop.paid_emi !== null) {
          paidEmiCount = Math.min(totalEmi, parseInt(String(prop.paid_emi), 10));
        } else {
          const paidAfterDev = Math.max(0, totalPaid - (totalLandShare + totalDevCharge));
          paidEmiCount = Math.min(totalEmi, Math.floor(paidAfterDev / perEmi));
        }

        // Paid EMIs
        for (let e = 1; e <= paidEmiCount; e++) {
          payments.push({
            id: `emi-${prop.id || "prop"}-${idx}-${e}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-EMI-${prop.id || "prop"}-${idx + 1}-${e}`,
            project: `${projName}${unit}`,
            installment_title: `Installment #${e} (EMI ${e} of ${totalEmi})`,
            payment_date: prop.lastUpdated || "2024-04-01",
            due_date: prop.lastUpdated || "2024-04-01",
            amount: formatTaka(perEmi),
            status: "paid",
            stage: "emi",
            emi_number: e,
            total_emi: totalEmi,
            method: "Bank Transfer",
          });
        }

        // Next due EMI
        if (paidEmiCount < totalEmi) {
          const nextEmiNumber = paidEmiCount + 1;
          const isEmiDueNow = landShareDue <= 0 && devChargeDue <= 0;
          payments.push({
            id: `emi-due-${prop.id || "prop"}-${idx}-${nextEmiNumber}`,
            flat_id: flatId,
            flat_no: flatNo,
            invoice_no: `TPHL-EMI-${prop.id || "prop"}-${idx + 1}-${nextEmiNumber}`,
            project: `${projName}${unit}`,
            installment_title: `Installment #${nextEmiNumber} (EMI ${nextEmiNumber} of ${totalEmi})`,
            due_date: prop.estimatedDate ? `15 Nov ${prop.estimatedDate}` : "15 Next Month",
            amount: formatTaka(perEmi),
            status: isEmiDueNow ? "due" : "upcoming",
            stage: "emi",
            emi_number: nextEmiNumber,
            total_emi: totalEmi,
          });
        }
      } else if (!hasBookingRecords && landShareDue <= 0 && devChargeDue <= 0 && totalDue > 0) {
        // Fallback generic due if no EMI breakdown is configured
        payments.push({
          id: `due-${prop.id || "prop"}-${idx}`,
          flat_id: flatId,
          flat_no: flatNo,
          invoice_no: `TPHL-DUE-${prop.id || "prop"}-${idx + 1}`,
          project: `${projName}${unit}`,
          installment_title: "Remaining Due",
          due_date: prop.estimatedDate ? `Dec ${prop.estimatedDate}` : "15 Apr 2026",
          amount: formatTaka(totalDue),
          status: "due",
        });
      }
    });

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

export interface AppNotification {
  id: number | string;
  type?: string;
  title: string;
  message: string;
  image?: string | null;
  link?: string;
  requiresAuth?: boolean;
  timestamp: number;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/notifications`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchNotifications] API returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    const list: AppNotification[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    // Newest first
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (err) {
    console.error("[fetchNotifications] Error fetching notifications:", err);
    return [];
  }
}

function getAuthHeaders(includeJsonContentType = false): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }
  if (typeof window !== "undefined") {
    try {
      const token =
        localStorage.getItem("tphl_auth_token") ||
        localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore localStorage error
    }
  }
  return headers;
}

export function formatDashboardProjectPrice(rawPrice?: unknown): string {
  if (rawPrice === null || rawPrice === undefined) return "";
  const str = String(rawPrice).trim();
  if (!str) return "";

  const lower = str.toLowerCase();
  if (lower.includes("contact") || lower.includes("request") || lower.includes("call")) {
    return "";
  }

  const firstPart = str.split(/\s*(?:-|–|—|\bto\b)\s*/i)[0]?.trim() || str;
  const cleaned = firstPart
    .replace(/^(from|starting\s*from|starting)\s*/i, "")
    .replace(/(bdt|tk\.?|taka|৳)/gi, "")
    .trim();

  if (!cleaned) return "";

  if (/\b(cr|crore|lac|lakh|k|m)\b/i.test(cleaned)) {
    const normalized = cleaned
      .replace(/\bcrore\b/i, "Cr")
      .replace(/\bcr\b/i, "Cr")
      .replace(/\blakh\b/i, "Lac")
      .replace(/\blac\b/i, "Lac")
      .replace(/\s+/g, " ")
      .trim();
    return `From ৳${normalized}`;
  }

  const numericOnly = cleaned.replace(/,/g, "").trim();
  const num = Number(numericOnly);
  if (!Number.isNaN(num) && num > 0) {
    if (num >= 10000000) {
      const cr = +(num / 10000000).toFixed(2);
      return `From ৳${cr} Cr`;
    }
    if (num >= 100000) {
      const lac = +(num / 100000).toFixed(1);
      return `From ৳${lac} Lac`;
    }
    return `From ৳${num.toLocaleString("en-IN")}`;
  }

  return cleaned.length <= 18 ? `From ৳${cleaned}` : str;
}

export async function fetchUserWishlist(
  userId: string | number
): Promise<WishlistPropertyItem[]> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/users/${userId}/wishlist`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchUserWishlist] API returned status ${res.status}`);
      return [];
    }

    const json = await res.json();

    // GET /users/{userId}/wishlist returns { success: true, favouriteIds: [...], wishlistItems: [...] }
    const wishlistItemsList: any[] = Array.isArray(json?.wishlistItems)
      ? json.wishlistItems
      : Array.isArray(json?.wishlist)
      ? json.wishlist
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.items)
      ? json.items
      : Array.isArray(json?.user?.wishlist)
      ? json.user.wishlist
      : Array.isArray(json)
      ? json
      : [];

    const favouriteIdsList: any[] = Array.isArray(json?.favouriteIds)
      ? json.favouriteIds
      : Array.isArray(json?.favoriteIds)
      ? json.favoriteIds
      : Array.isArray(json?.user?.favouriteIds)
      ? json.user.favouriteIds
      : [];

    // Combine wishlistItems (rich objects or IDs) and favouriteIds (IDs), deduplicating by normalized ID
    const mergedMap = new Map<string, any>();

    wishlistItemsList.forEach((entry: any) => {
      if (entry === null || entry === undefined) return;
      const isPrimitive = typeof entry === "string" || typeof entry === "number";
      const rawId = isPrimitive
        ? String(entry)
        : String(
            entry?.propertyId ??
              entry?.property_id ??
              entry?.project_id ??
              entry?.id ??
              ""
          );
      const cleanKey = rawId.replace(/^prop_/i, "").trim();
      if (cleanKey) {
        mergedMap.set(cleanKey, entry);
      }
    });

    favouriteIdsList.forEach((favId: any) => {
      if (favId === null || favId === undefined) return;
      const rawId = String(
        typeof favId === "object"
          ? favId?.propertyId ?? favId?.property_id ?? favId?.project_id ?? favId?.id ?? ""
          : favId
      );
      const cleanKey = rawId.replace(/^prop_/i, "").trim();
      if (cleanKey && !mergedMap.has(cleanKey)) {
        mergedMap.set(cleanKey, favId);
      }
    });

    const rawList = Array.from(mergedMap.values());
    if (rawList.length === 0) {
      return [];
    }

    // Fetch /projects and /constructions/projects-progress to enrich with real API data only
    let catalogProjects: any[] = [];
    let progressProjects: any[] = [];
    try {
      const [projRes, progRes] = await Promise.allSettled([
        fetch(`${baseUrl}/projects`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }),
        fetch(`${baseUrl}/constructions/projects-progress`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }),
      ]);

      if (projRes.status === "fulfilled" && projRes.value.ok) {
        const projJson = await projRes.value.json();
        catalogProjects = Array.isArray(projJson)
          ? projJson
          : projJson?.projects || projJson?.data || [];
      }
      if (progRes.status === "fulfilled" && progRes.value.ok) {
        const progJson = await progRes.value.json();
        progressProjects = Array.isArray(progJson)
          ? progJson
          : progJson?.data || progJson?.projects || [];
      }
    } catch {
      // ignore enrichment error
    }

    const mappedItems: WishlistPropertyItem[] = [];

    rawList.forEach((entry: any, idx: number) => {
      const isPrimitive = typeof entry === "string" || typeof entry === "number";
      const rawPropertyId = isPrimitive
        ? String(entry)
        : String(
            entry?.propertyId ??
              entry?.property_id ??
              entry?.project_id ??
              entry?.id ??
              ""
          );

      if (!rawPropertyId) return;

      const cleanId = rawPropertyId.replace(/^prop_/i, "").trim();
      const nestedObj = !isPrimitive ? entry?.property || entry?.project || entry : {};

      const matchedProject = catalogProjects.find(
        (p: any) =>
          String(p.id) === rawPropertyId ||
          String(p.id) === cleanId ||
          (p.slug && String(p.slug).toLowerCase() === rawPropertyId.toLowerCase())
      );

      const source = { ...(matchedProject || {}), ...(nestedObj || {}) };
      const title =
        source.name ||
        source.title ||
        source.project_name ||
        "";

      // Do not render phantom cards if the property does not exist in API data
      if (!title) return;

      const matchedProgress = progressProjects.find(
        (prog: any) =>
          String(prog.project_id ?? prog.id) === cleanId ||
          (prog.project_name &&
            String(prog.project_name).trim().toLowerCase() === title.trim().toLowerCase())
      );

      let image: string | undefined =
        source.image ||
        source.featured_image ||
        (Array.isArray(source.images) ? source.images[0] : undefined) ||
        undefined;
      if (image && !image.startsWith("http") && !image.startsWith("/")) {
        image = `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${image.replace(/^\/+/, "")}`;
      }

      const rawLocation =
        (typeof source.location === "string" && source.location.trim()) ||
        (typeof source.project_map_location === "string" && source.project_map_location.trim()) ||
        (typeof source.community?.name === "string" && source.community.name.trim()) ||
        (typeof source.address === "string" && source.address.trim()) ||
        undefined;

      const formattedPrice = formatDashboardProjectPrice(
        source.price || source.price_range
      );

      const rawPct =
        source.construction_pct ??
        source.progress ??
        matchedProgress?.overall_progress ??
        matchedProgress?.progress_percentage ??
        undefined;
      const parsedPct =
        rawPct !== undefined && rawPct !== null && String(rawPct).trim() !== ""
          ? parseAmount(rawPct)
          : undefined;

      const rawHandover =
        source.handover_date ||
        source.handover ||
        source.delivery ||
        source.estimatedDate ||
        matchedProgress?.handover_date ||
        undefined;

      mappedItems.push({
        id: !isPrimitive && entry?.id ? entry.id : `wish-${rawPropertyId}-${idx}`,
        propertyId: rawPropertyId,
        title,
        slug: source.slug || undefined,
        location: rawLocation,
        image,
        status: source.status || source.project_sale_status || undefined,
        price: formattedPrice || undefined,
        flatNo: source.flatNo || source.flat_no || undefined,
        flatSize: source.flatSize || source.flat_size || source.size || undefined,
        buildingType: source.building_type || undefined,
        propertyType: source.type || source.types || undefined,
        beds: source.beds || undefined,
        constructionPct: parsedPct,
        handoverDate: rawHandover ? String(rawHandover).trim() : undefined,
      });
    });

    return mappedItems;
  } catch (err) {
    console.error(`[fetchUserWishlist] Error fetching wishlist for user ${userId}:`, err);
    return [];
  }
}

export async function addToUserWishlist(
  userId: string | number,
  propertyId: string | number
): Promise<{ success: boolean; message?: string }> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/users/${userId}/wishlist`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        propertyId: String(propertyId),
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message:
          data?.message || data?.error || "Failed to add property to wishlist.",
      };
    }

    return {
      success: true,
      message: data?.message || "Property added to your wishlist.",
    };
  } catch (err) {
    console.error("[addToUserWishlist] Error:", err);
    return {
      success: false,
      message: "Network error while adding property to wishlist.",
    };
  }
}

export async function removeFromUserWishlist(
  userId: string | number,
  propertyId: string | number
): Promise<{ success: boolean; message?: string }> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(
      `${baseUrl}/users/${userId}/wishlist/${encodeURIComponent(String(propertyId))}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Failed to remove property from wishlist.",
      };
    }

    return {
      success: true,
      message: data?.message || "Property removed from your wishlist.",
    };
  } catch (err) {
    console.error("[removeFromUserWishlist] Error:", err);
    return {
      success: false,
      message: "Network error while removing property from wishlist.",
    };
  }
}


