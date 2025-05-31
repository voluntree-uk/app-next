import { DataAccessor } from "@data/data";
import {
  Workshop,
  Slot,
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
  endOfNextWeekAsISOString,
  isBeforeNow
} from "@util/dates";
import { api } from "@infra/aws";
import { ActionTrigger } from "@infra/api";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@util/supabase/client";
import { WorkshopInterest } from "@schemas";

/**
 * A supabase implementation of the DataAccessor interface
 */
class SupabaseDataAccessor implements DataAccessor {
  private client: SupabaseClient

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getJWT(): Promise<string | undefined> {
    const { data } = await this.client.auth.getSession()
    return data.session?.access_token
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await this.client.from("profile")
      .insert([profile])
      .select();
    if (error) throw error;
    if (data) {
      return data[0] as Profile;
    } else {
      throw Error(`Failed to create a user profile: ${JSON.stringify(profile)}`)
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await this.client.from("profile")
      .upsert([profile])
      .select();
    if (error) throw error;
    if (data) {
      return data[0] as Profile;
    } else {
      throw Error(`Failed to update a user profile: ${JSON.stringify(profile)}`);
    }
  }

  async hasProfile(id: string): Promise<Boolean> {
    const { data, error } = await this.client.rpc('has_user_profile', {
      p_user_id: id
    })
    return data && !error ? true : false;
  }

  async getProfile(id: string): Promise<Profile> {
    try {
      let { data, error } = await this.client
        .from("profile")
        .select('*')
        .eq("user_id", id)
        .single();
      if (error) throw error;
      if (data) {
        return data;
      } else {
        throw Error(`Failed to find a profile with the user_id: ${id}`);
      }
    } catch (err) {
      throw Error(`Failed to find a profile with the user_id: ${id}`);
    }
  }

  async createWorkshop(workshop: Workshop): Promise<Workshop> {
    if (workshop.virtual) {
      workshop.meeting_link = await api.generateMeetingLink(workshop)
    }
    const { data, error } = await this.client.from("workshop")
      .insert([workshop])
      .select();
    if (error) throw error;
    if (data) {
      await this.client.rpc('increment_hosted_workshops', { id: workshop.user_id });
      await api.workshopConfirmation(workshop);
      return data[0] as Workshop;
    } else {
      throw Error(`Failed to create a workshop: ${JSON.stringify(workshop)}`);
    }
  }

  async updateWorkshop(workshop: Workshop): Promise<Workshop> {
    const { data, error } = await this.client.from("workshop")
      .upsert([workshop])
      .select();
    if (error) throw error;
    if (data) {
      return data[0] as Workshop;
    } else {
      throw Error(`Failed to update a workshop: ${JSON.stringify(workshop)}`);
    }
  }

  async expressInterestInWorkshop(
    workshop_interest: WorkshopInterest
  ): Promise<boolean> {
    const { data, error } = await this.client
      .from("workshop_interest")
      .insert([workshop_interest])
      .select();
    if (error) throw error;
    if (data) {
      return true;
    } else {
      throw Error(
        `Failed to express interest in a workshop: ${workshop_interest.workshop_id}`
      );
    }
  }

  async getWorkshopInterestCount(workshop_id: string): Promise<number> {
    const { count, error } = await this.client
      .from("workshop_interest")
      .select("*", { count: "exact", head: true })
      .eq("workshop_id", workshop_id);

    if (error) {
      throw new Error(`Failed to get interest count: ${error.message}`);
    }

    return count ?? 0;
  }

  async isUserInterestedInWorkshop(
    workshop_id: string,
    user_id: string
  ): Promise<boolean> {
    const { data, error } = await this.client
      .from("workshop_interest")
      .select("*")
      .eq("workshop_id", workshop_id)
      .eq("user_id", user_id);

    if (error) throw error;

    return data.length > 0;
  }

  async filterAvailableWorkshops(filters: FilterProps): Promise<Workshop[]> {
    const isTimeFilterSelected = filters.time !== TimeFilter.ANY_TIME;

    const slotJoin = isTimeFilterSelected
      ? "slot!inner(date, at_capacity)"
      : "slot(date, at_capacity)";

    const query = this.client
      .from("workshop")
      .select(`*, ${slotJoin}`)
      .order("created_at", { ascending: false });

    if (filters.category !== "") {
      query.eq("category", filters.category);
    }

    if (filters.text !== "") {
      query.ilike("name", `%${filters.text}%`);
    }

    if (isTimeFilterSelected) {
      query.eq("slot.at_capacity", false);
      switch (filters.time) {
        case TimeFilter.THIS_WEEK:
          query.gte("slot.date", dateAsISOString());
          query.lte("slot.date", endOfThisWeekAsISOString());
          break;
        case TimeFilter.THIS_WEEKEND:
          query.gte("slot.date", startOfThisWeekendAsISOString());
          query.lte("slot.date", endOfThisWeekendAsISOString());
          break;
        case TimeFilter.NEXT_WEEK:
          query.gte("slot.date", startOfNextWeekAsISOString());
          query.lte("slot.date", endOfNextWeekAsISOString());
          break;
        default:
          break;
      }
    } else {
      query.gte("slot.date", dateAsISOString());
    }

    const { data: filteredData, error: error } = await query;

    if (error) throw error;

    return filteredData ? filteredData : [];
  }

  async getWorkshopsByCategory(category: string): Promise<Workshop[]> {
    const { data: workshops, error } = await this.client
      .from("workshop")
      .select("*")
      .eq("category", category);
    if (error) throw error;
    return workshops;
  }

  async getWorkshop(id: string): Promise<Workshop> {
    const { data: workshop, error: error } = await this.client
      .from("workshop")
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
    try {
      const slots = await this.getWorkshopSlots(workshop_id)

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        if (slot.id) {
          const success = await this.cancelSlot(slot)
          if (!success) {
            console.error(`Failed to cancel workshop slots`)
            return false
          }
        }
      }

      const { error } = await this.client
        .from("workshop")
        .delete()
        .eq("id", workshop_id)

      if (error) {
        console.error(`Failed to delete a workshop: ${error.message}`)
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }

  async getWorkshopSlots(id: string): Promise<Slot[]> {
    const { data: slots, error: error } = await this.client
      .from("slot")
      .select("*")
      .eq("workshop_id", id)
      .order("date");
    if (error) throw error;
    return slots;
  }

  async getWorkshopBookings(id: string): Promise<BookingDetails[]> {
    const { data: bookings, error: error } = await this.client
      .from("booking")
      .select("*,slot:slot_id(*)")
      .eq("workshop_id", id);
    if (error) throw error;
    return bookings;
  }

  async getUserWorkshops(user_id: string): Promise<Workshop[]> {
    const { data: workshopData, error } = await this.client
      .from("workshop")
      .select("*")
      .eq("user_id", user_id);
    
    if (error) {
      throw new Error(error.message);
    }

    return workshopData;
  }

  async createSlots(slots: Slot[]): Promise<boolean> {
    const { data: data, error: error } = await this.client
      .from("slot")
      .insert([...slots])
      .select();
    
    if (error) {
      console.error(`Failed to create slots: ${error.message}`)
      return false
    }

    if (data) {
      for (let i = 0; i < data.length; i++) {
        await api.scheduleSlot(data[i])
      }
    }

    return true;
  }

  async getUserBookings(user_id: string): Promise<BookingDetails[]> {
    const { data: bookings, error: error } = await this.client
      .from("booking")
      .select(`
      *,
      workshop:workshop_id(name,user_id),
      slot:slot_id(date, start_time, end_time)`)
      .eq(`user_id`, user_id);

    if (error) {
      throw new Error(error.message);
    }

    return bookings;
  }

  async bookSlot(workshop: Workshop, slot: Slot, user_id: string): Promise<boolean> {
    const { data, error } = await this.client.rpc('book_slot', {
      p_workshop_id: workshop.id?.toString(),
      p_slot_id: slot.id?.toString(),
      p_user_id: user_id
    })
    if (error) {
      return false;
    }

    if (data && data[0]) {
      if (!data[0].success) {
        return false;
      } else {
        const { data: bookings } = await this.client
          .from("booking")
          .select(`
            *,
            workshop:workshop_id(name,user_id,meeting_link),
            slot:slot_id(date,start_time,end_time)
          `)
          .eq(`slot_id`, slot.id)
          .eq(`workshop_id`, workshop.id)
          .eq(`user_id`, user_id);
        if (bookings && bookings.length == 1) {
          await api.bookingConfirmation(bookings[0])
        }
        return true;
      }
    }

    return false;
  }

  async cancelSlot(slot: Slot): Promise<boolean> {
    if (!slot.id) return false

    const { data: bookings, error: error } = await this.client
      .from("booking")
      .select(`
        *,
        workshop:workshop_id(name,user_id),
        slot:slot_id(date, start_time, end_time)
      `)
      .eq(`slot_id`, slot.id);

    if (error) {
      console.error(`Failed to get slot bookings: ${error.message}`)
      return false
    }

    if (bookings) {
      for (let i = 0; i < bookings.length; i++) {
        const booking: BookingDetails = bookings[i]
        const success = await this.cancelBooking(booking, ActionTrigger.Host)
        if (!success) {
          console.error(`Failed to cancel slot bookings`)
          return false
        }
      }
    }

    const { error: err } = await this.client
      .from("slot")
      .delete()
      .eq("id", slot.id)

    if (err) {
      console.error(`Error deleting slot: ${err?.message}`)
      return false
    }

    if (!isBeforeNow(new Date(`${slot.date}T${slot.end_time}`))) {
      await api.cancelSlot(slot)
    }

    return true
  }

  async cancelBooking(booking: BookingDetails, triggered_by: ActionTrigger): Promise<boolean> {
    const { data, error } = await this.client.rpc('cancel_booking', {
      p_booking_id: booking.id?.toString()
    })
    if (error) throw error;

    if (data) {
      api.bookingCancellation(booking, triggered_by)
      return true
    } else {
      return false
    }
  }

  async reviewBooking(booking_id: string, rating: number, comment: string): Promise<boolean> {
    const { error: b_error } = await this.client
      .from('booking')
      .update({
        review_rating: rating,
        review_comment: comment
      })
      .eq('id', booking_id)

    if (b_error) {
      console.error(`Failed to submit a booking review: ${b_error.message}`)
      return false
    }

    const { data: r_data, error: r_error } = await this.client.rpc('update_user_rating', {
      p_booking_id: booking_id
    })

    if (r_error) {
      console.error(`Failed to update user rating: ${r_error.message}`)
      return false
    }

    return (r_data) ? true : false
  }

  async getAvatarUrl(path: string): Promise<string> {
    const { data } = await this.client.storage
      .from("avatars")
      .getPublicUrl(path);
    if (data) {
      return data?.publicUrl;
    } else {
      throw Error(`Failed to find an avatar on the given path: ${path}`)
    }
  }

  async uploadAvatar(path: string, file: string): Promise<boolean> {
    let { error } = await this.client.storage
      .from("avatars")
      .upload(path, file);
    if (error) throw error;
    return true;
  }
}

export { SupabaseDataAccessor }
export const clientData = new SupabaseDataAccessor(createClient());