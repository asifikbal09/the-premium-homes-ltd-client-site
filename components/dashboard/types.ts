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
  per_emi_amount?: string | number;
  total_emi?: string | number;
  paid_emi?: string | number;
  land_share_due?: string | number;
  development_charges_due?: string | number;
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
  booking_money?: string;
  land_share?: string;
  development_charges?: string;
  per_emi_amount?: string | number;
  total_emi?: string | number;
  paid_emi?: string | number;
  land_share_due?: string | number;
  development_charges_due?: string | number;
}

export interface ClientPayment {
  id: string;
  flat_id?: string | number;
  flat_no?: string;
  invoice_no: string;
  project: string;
  installment_title: string;
  due_date: string;
  payment_date?: string;
  amount: string;
  status: "paid" | "due" | "upcoming";
  method?: string;
  stage?: "land_share" | "development" | "emi";
  emi_number?: number;
  total_emi?: number;
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

/** One bid on an auction. Amounts are raw taka, as the API stores them. */
export interface AuctionBid {
  id: number | string;
  user_id?: number | string;
  user_name: string;
  amount: number;
  created_at?: string;
  referral_code?: string;
}

/** A flat listed for resale by its owner. Amounts are raw taka. */
export interface Auction {
  id: number | string;
  user_id?: number | string;
  property_name: string;
  property_slug?: string;
  property_image?: string;
  location?: string;
  beds?: number;
  size?: string | number;
  type?: string;
  flat_no?: string;
  starting_bid: number;
  reserve_price: number | null;
  highest_bid: number | null;
  total_bids: number;
  duration_days?: number;
  start_date?: string;
  time_left?: string;
  status: string;
  /** Sorted highest first. */
  bids: AuctionBid[];
}

export interface AuctionFeed {
  hot: Auction[];
  live: Auction[];
  upcoming: Auction[];
  completed: Auction[];
}

export interface CompletedAuctionBidder {
  name: string;
  /** Raw taka, or a label the API already formatted (e.g. "58.00 Lakh"). */
  amount: number | string;
  time?: string;
}

export interface CompletedAuction {
  id: number | string;
  name: string;
  image?: string;
  location?: string;
  ended_at?: string;
  winner: CompletedAuctionBidder | null;
  runners_up: CompletedAuctionBidder[];
}

/** Body of POST /auctions and PUT /auctions/{id}. */
export interface AuctionListingPayload {
  user_id: number | string;
  user_email?: string;
  user_name?: string;
  property_name: string;
  property_slug?: string;
  property_image?: string;
  location?: string;
  size?: number;
  type: string;
  flat_no?: string;
  paid_amount: number;
  starting_bid: number;
  reserve_price: number | null;
  duration_days: number;
  start_date: string;
}

export interface WishlistPropertyItem {
  id: string | number;
  propertyId: string;
  title: string;
  slug?: string;
  location?: string;
  image?: string;
  status?: string;
  price?: string;
  flatNo?: string;
  flatSize?: string;
  buildingType?: string;
  propertyType?: string;
  beds?: number | string;
  constructionPct?: number;
  handoverDate?: string;
}


