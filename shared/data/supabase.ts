import { DataAccessor } from "@data/data";
import { supabase } from "@supabaseClient";
import {
  Workshop,
  Slot,
  Booking,
  BookingDetails,
  Profile,
  FilterProps,
  TimeFilter
} from "@schemas";
import {
  dateAsISOString,
  endOfThisWeekAsISOString,
  startOfThisWeekendAsISOString,
  endOfThisWeekendAsISOString,
  startOfNextWeekAsISOString,
  endOfNextWeekAsISOString
} from "@util/dates";
import { api } from "@infra/aws";
import { ActionTrigger } from "@infra/api";

/**
 * A supabase implementation of the DataAccessor interface
 */
class SupabaseDataAccessor implements DataAccessor {
  async createProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").insert([profile]);
    if (error) throw error;
    if (data) {
      return data[0] as Profile;
    } else {
      throw Error(`Failed to create a user profile: ${JSON.stringify(profile)}`)
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").upsert([profile]);
    if (error) throw error;
    if (data) {
      return data[0] as Profile;
    } else {
      throw Error(`Failed to update a user profile: ${JSON.stringify(profile)}`);
    }
  }

  async hasProfile(id: string): Promise<Boolean> {
    const { data, error } = await supabase.rpc('has_user_profile', {
      p_user_id: id
    })
    if (error) throw error;

    return data ? true : false;
  }

  async getProfile(id: string): Promise<Profile> {
    let { data, error } = await supabase
      .from("profiles")
      .select('*')
      .eq("user_id", id)
      .single();
    if (error) throw error;
    if (data) {
      return data;
    } else {
      throw Error(`Failed to find a profile with the user_id: ${id}`);
    }
  }

  async createWorkshop(workshop: Workshop): Promise<Workshop> {
    if (workshop.virtual) {
      workshop.meeting_link = await api.generateMeetingLink(workshop.name)
    }
    const { data, error } = await supabase.from("workshops").insert([workshop]);
    if (error) throw error;
    if (data) {
      await supabase.rpc('increment_hosted_workshops', { id: workshop.user_id });
      await api.sendWorkshopCreationConfirmation(workshop.user_id, workshop.name);
      return data[0] as Workshop;
    } else {
      throw Error(`Failed to create a workshop: ${JSON.stringify(workshop)}`);
    }
  }

  async filterAvailableWorkshops(filters: FilterProps): Promise<Workshop[]> {
    const query = supabase
      .from("workshops")
      .select('*, slots!inner(date, at_capacity)')
      .eq('slots.at_capacity', false)
      .order('created_at', { ascending: false });

    if (filters.category !== '') {
      query.eq("category", filters.category);
    }

    if (filters.text !== '') {
      query.ilike("name", `%${filters.text}%`);
    }

    switch (filters.time) {
      case TimeFilter.THIS_WEEK:
        query.gte('slots.date', dateAsISOString())
        query.lte('slots.date', endOfThisWeekAsISOString())
        break;
      case TimeFilter.THIS_WEEKEND:
        query.gte('slots.date', startOfThisWeekendAsISOString())
        query.lte('slots.date', endOfThisWeekendAsISOString())
        break;
      case TimeFilter.NEXT_WEEK:
        query.gte('slots.date', startOfNextWeekAsISOString())
        query.lte('slots.date', endOfNextWeekAsISOString())
        break;
      default:
        query.gte('slots.date', dateAsISOString())
        break;
    }

    const { data: filteredData, error: error } = await query;

    if (error) throw error;

    return filteredData ? filteredData : [];
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

  async cancelWorkshop(workshop_id: string): Promise<boolean> {
    const workshop = await this.getWorkshop(workshop_id)

    this.getWorkshopSlots(workshop_id).then((slots) => {
      slots.forEach(slot => {
        api.cancelSlotPostProcessing(slot.id!)
      })
    })

    this.getWorkshopBookings(workshop_id).then((bookings) => {
      bookings.forEach(booking => {
        api.sendBookingCancellations(workshop.user_id, booking.user_id, booking.slots, ActionTrigger.Host)
      })
    })

    const { error } = await supabase
      .from("workshops")
      .delete()
      .eq("id", workshop_id)

    if (error) {
      console.log(`Error deleting workshop: ${error}`)
      return false
    }

    return true
  }

  async getWorkshopSlots(id: string): Promise<Slot[]> {
    const { data: slots, error: error } = await supabase
      .from("slots")
      .select("*")
      .eq("workshop_id", id);
    if (error) throw error;
    return slots;
  }

  async getWorkshopBookings(id: string): Promise<BookingDetails[]> {
    const { data: bookings, error: error } = await supabase
      .from("bookings")
      .select("*,slots:slot_id(*)")
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
    const { data: data, error: error } = await supabase
      .from("slots")
      .insert([...slots])
      .select();
    
    if (error) {
      console.log(`Failed to create slots: ${JSON.stringify(error)}`)
      return false
    }

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const slot: Slot = data[i]
        console.log(`Scheduling event post processing for: ${JSON.stringify(slot)}`)
        const success = await api.scheduleSlotPostProcessing(data[i].id!, `${slot.date}T${slot.end_time}`)
        if (!success) {
          return false
        }
      }
    } else {
      console.log(`Created zero slots`)
      return false
    }

    return true;
  }

  async getUserBookings(user_id: string): Promise<BookingDetails[]> {
    const { data: bookings, error: error } = await supabase
      .from("bookings")
      .select(`
      id,
      user_id,
      workshop_id,
      workshops:workshop_id(name,user_id),
      slots:slot_id(date, start_time, end_time)
    `).eq(`user_id`, user_id);

    if (error) {
      throw new Error(error.message);
    }

    return bookings;
  }

  async bookSlot(workshop: Workshop, slot: Slot, user_id: string): Promise<boolean> {
    // Generate booking link first
    const { data, error } = await supabase.rpc('book_slot', {
      p_workshop_id: workshop.id?.toString(),
      p_slot_id: slot.id?.toString(),
      p_user_id: user_id
    })
    if (error) {
      // Invalidate booking link
      throw error;
    }

    if (data && data[0]) {
      if (!data[0].success) {
        // Invalidate booking link
        throw Error(data[0].message)
      } else {
        await api.sendBookingConfirmations(
          workshop.user_id.toString(),
          user_id,
          slot,
          workshop.meeting_link
        )
        return true;
      }
    }

    return false;
  }

  async cancelBooking(booking_id: string, slot: Slot, user_id: string, host_id: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('cancel_booking', {
      p_booking_id: booking_id
    })
    if (error) throw error;

    if (data) {
      api.sendBookingCancellations(host_id, user_id, slot, ActionTrigger.Attendee)
      return true
    } else {
      return false
    }
  }

  async getAvatarUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    if (error) throw error;
    if (data) {
      return data?.publicURL;
    } else {
      throw Error(`Failed to find an avatar on the given path: ${path}`)
    }
  }

  async uploadAvatar(path: string, file: string): Promise<boolean> {
    let { error } = await supabase.storage
      .from("avatars")
      .upload(path, file);
    if (error) throw error;
    return true;
  }
}

export const data = new SupabaseDataAccessor();