export interface Booking {
  id?: string;
  created_at?: number;
  workshop_id: string;
  user_id: string;
  slot_id: string;
  active: boolean;
}

export interface BookingDetails extends Booking {
  workshops: Workshop;
  slots: Slot;
}

export interface Workshop {
  id?: string;
  created_at?: number;
  name: string;
  user_id: string;
  description: string;
  category: string;
  house: string;
  street: string;
  postcode: string;
  virtual: boolean;
}

export interface Profile {
  id?: string;
  created_at?: number;
  username: string;
  avatar_url: string;
  updated_at: number;
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
