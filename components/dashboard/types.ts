export interface ClientUser {
  id?: number | string;
  name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  flat_no?: string;
  building_name?: string;
  total_paid?: string;
  outstanding?: string;
  total_expense?: string;
  completion?: number;
}

export interface SavedProperty {
  id: number | string;
  slug?: string;
  name?: string;
  location?: string;
  image?: string;
  flatNo?: string;
  flatSize?: string;
  price?: string | number;
  partial_payment?: string | number;
  due_payment?: string | number;
  discount?: string | number;
  estimatedDate?: string;
  booking_money?: string;
  land_share?: string;
  development_charges?: string;
}

export interface ClientFlat {
  id: string | number;
  project_id?: string | number;
  title: string;
  flatNo?: string;
  flatSize?: string;
  location: string;
  image: string;
  status: string;
  construction_pct: number;
  handover_date: string;
  price: string;
  partial_payment?: string;
  due_payment?: string;
  discount?: string;
  slug?: string;
  videoLink?: string;
  videoLink2?: string;
  moneyReceiptLink?: string;
  purchaseDetailsLink?: string;
}

export interface ClientPayment {
  id: string;
  invoice_no: string;
  project: string;
  installment_title: string;
  due_date: string;
  payment_date?: string;
  amount: string;
  status: "paid" | "due" | "upcoming";
  method?: string;
}

export interface ClientNotice {
  id: string;
  title: string;
  date: string;
  category: "General" | "Construction" | "Meeting" | "Handover";
  description: string;
  isUnread?: boolean;
}

export interface ReferralTransaction {
  id: number | string;
  referred_friend?: string;
  amount?: number;
  status: "approved" | "pending" | "rejected" | string;
  created_at?: string;
  date?: string;
  message?: string;
}

export interface ReferralDetails {
  success: boolean;
  referral_code: string;
  wallet_balance: number;
  referred_clients_count: number;
  pending_referrals_count: number;
  transactions: ReferralTransaction[];
}

export interface LiveCamera {
  id: number;
  project_id: number;
  project_name: string;
  location: string;
  camera_name: string;
  camera_link: string;
  status: string;
}

