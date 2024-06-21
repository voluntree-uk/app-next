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

export interface FilterProps {
  text: string;
  category: string;
  time: TimeFilter;
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
  time: TimeFilter.ANY_TIME
}