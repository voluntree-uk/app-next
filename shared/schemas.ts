export interface Booking {
  id?: string;
  created_at?: number;
  workshop_id: string;
  user_id: string;
  slot_id: string;
  review_rating?: number;
  review_comment?: string;
}

export interface BookingDetails extends Booking {
  workshop: Workshop;
  slot: Slot;
}

export interface Workshop {
  id?: string;
  created_at?: number;
  name: string;
  user_id: string;
  description: string;
  category: string;
  house?: string;
  street?: string;
  postcode?: string;
  city?: string;
  virtual: boolean;
  meeting_link?: string;
}

export interface Profile {
  created_at?: number;
  user_id: string;
  username?: string;
  email?: string;
  name?: string;
  surname?: string;
  hosted_workshops?: number;
  avatar_url?: string;
  rating?: number;
  reviews_received?: number;
  award_points?: number;
  share_full_name_consent?: boolean;
  share_email_consent?: boolean;
}

export interface Slot {
  id?: string;
  created_at?: number;
  workshop_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
}

export interface WorkshopInterest {
  workshop_id: string;
  user_id: string;
}

export interface User {
  id: string
  email?: string
  phone?: string
}

export interface Session {
  provider_token?: string | null
  access_token: string
  user: User | null
}

export enum SortOption {
  SOONEST = "soonest",
  NEWEST = "newest",
  MOST_POPULAR = "most_popular"
}

export interface FilterProps {
  text: string;
  category: string;
  time: TimeFilter;
  sort: SortOption;
}

export enum TimeFilter {
  ANY_TIME = "Any time",
  THIS_WEEK = "This week",
  THIS_WEEKEND = "This weekend",
  NEXT_WEEK = "Next week"
}

export const DefaultFilterProps: FilterProps = {
  text: "",
  category: "",
  time: TimeFilter.ANY_TIME,
  sort: SortOption.SOONEST
}

export interface UpcomingSession {
  workshop: Workshop;
  slot: Slot;
  host: Profile;
  bookingCount: number;
  availableSpots: number;
}

export interface PlatformStats {
  totalWorkshops: number;
  totalUsers: number;
  totalSessions: number;
  totalBookings: number;
}

export interface WorkshopListItem {
  workshop: Workshop;
  host: Profile;
  nextSession: Slot | null;
  upcomingSessionCount: number;
  totalAvailableSpots: number;
}

export type TransactionType =
  | "Donation"
  | "Expense"
  | "Processing Charge"
  | "Administrative Charge";

export interface FinancialTransaction {
  title: string;
  type: TransactionType;
  date: string;
  isoDate: string;
  amountInPence: number;
  formattedAmount: string;
}

export interface FinancialSummary {
  balanceInPence: number;
  donationsTotalInPence: number;
  expensesTotalInPence: number;
  chargesTotalInPence: number;
  formattedBalance: string;
  formattedDonationsTotal: string;
  formattedExpensesTotal: string;
  formattedChargesTotal: string;
  recentTransactions: FinancialTransaction[];
}
