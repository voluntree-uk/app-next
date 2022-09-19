import { DataAccessor } from "./data";
import { Workshop, Slot, Booking, BookingDetails } from "../schemas";
import { dateAsISOString } from "../../utils/dates";
import { supabase } from "../../supabase/supabaseClient";

/**
 * A supabase implementation of the DataAccessor interface
 */
class SupabaseDataAccessor implements DataAccessor {
  async createWorkshop(workshop: Workshop): Promise<Workshop> {
    const { data, error } = await supabase.from("workshops").insert([workshop]);
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      return data[0] as Workshop;
    } else {
      throw Error(`Failed to create a workshop: ${JSON.stringify(workshop)}`)
    }
  }

  async getAvailableWorkshops(): Promise<Workshop[]> {
    const { data: workshops } = await supabase
      .from('workshops')
      .select('*, slots!inner(date, at_capacity)')
      .eq('slots.at_capacity', false)
      .gt('slots.date', dateAsISOString())
      .order('created_at', { ascending: false });
    if (workshops) {
      return workshops
    } else {
      return []
    }
  }

  async searchWorkshops(str: string): Promise<Workshop[]> {
    const { data: searchData, error: error } = await supabase
      .from("workshops")
      .select("*")
      .ilike("name", `%${str}%`);
    if (error) throw error;
    return searchData;
  }

  async getWorkshopsByCategory(category: string): Promise<Workshop[]> {
    const { data: workshops, error } = await supabase
      .from("workshops")
      .select("*")
      .eq("category", category);
    if (error) throw error;
    return workshops;
  }

  async getWorkshop(id: string): Promise<Workshop> {
    const { data: workshop, error: error } = await supabase
      .from("workshops")
      .select("*")
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    if (workshop) {
      return workshop[0] as Workshop;
    } else {
      throw Error(`Failed to find a workshop with id: ${id}`)
    }
  }

  async getWorkshopSlots(id: string): Promise<Slot[]> {
    const { data: slots, error: error } = await supabase
      .from("slots")
      .select("*")
      .eq("workshop_id", id);
    if (error) throw error;
    return slots;
  }

  async getWorkshopBookings(id: string): Promise<Booking[]> {
    const { data: bookings, error: error } = await supabase
      .from("bookings")
      .select("*")
      .eq("workshop_id", id);
    if (error) throw error;
    return bookings;
  }

  async getUserWorkshops(user_id: string): Promise<Workshop[]> {
    const { data: workshopData, error } = await supabase
      .from("workshops")
      .select("*")
      .eq("user_id", user_id);
    
    if (error) {
      throw new Error(error.message);
    }

    return workshopData;
  }

  async createSlots(slots: Slot[]): Promise<boolean> {
    const { error: error } = await supabase
      .from("slots")
      .insert([...slots]);
    
    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  getSlot(id: string): Slot {
    throw new Error("Method not implemented.");
  }

  getSlotBookings(id: string): Booking[] {
    throw new Error("Method not implemented.");
  }

  async getUserBookings(user_id: string): Promise<BookingDetails[]> {
    const { data: bookings, error: error } = await supabase
      .from("bookings")
      .select(`
      id,
      user_id,
      workshop_id,
      workshops:workshop_id(name),
      slots:slot_id(date, start_time, end_time)
    `).eq(`user_id`, user_id);

    if (error) {
      throw new Error(error.message);
    }

    return bookings;
  }

  async bookSlot(workshop_id: string, slot_id: string, user_id: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('book_slot', {
      p_workshop_id: workshop_id,
      p_slot_id: slot_id,
      p_user_id: user_id
    })

    if (!data.bool || error) {
      throw Error(data['?column?']);
    }

    return true;
  }

  async removeBooking(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .match({ id: id });

    if (error) throw error;

    return true;
  }
}

export const data = new SupabaseDataAccessor();