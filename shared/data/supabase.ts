import { DataAccessor } from "@data/data";
import {
  Workshop,
  WorkshopInterest,
  Slot,
  BookingDetails,
  Profile,
  FilterProps,
  TimeFilter,
  SortOption,
  UpcomingSession,
  PlatformStats,
  WorkshopListItem,
} from "@schemas";
import {
  dateAsISOString,
  endOfThisWeekAsISOString,
  startOfThisWeekendAsISOString,
  endOfThisWeekendAsISOString,
  startOfNextWeekAsISOString,
  endOfNextWeekAsISOString,
  isBeforeNow,
  parseUTCDateTime
} from "@util/dates";
import { api } from "@infra/aws";
import { ActionTrigger } from "@infra/api";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@util/supabase/client";

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

  async getProfiles(userIds: string[]): Promise<Profile[]> {
    if (userIds.length === 0) {
      return [];
    }
    const { data, error } = await this.client
      .from("profile")
      .select('*')
      .in("user_id", userIds);
    if (error) throw error;
    return data || [];
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

  async expressInterestInWorkshop(workshop_interest: WorkshopInterest, workshop: Workshop): Promise<boolean> {
    const { data, error } = await this.client
      .from("workshop_interest")
      .insert([workshop_interest])
      .select();
    if (error) throw error;
    if (data) {
      api.showWorkshopInterest(workshop)
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

  /**
   * Builds the Supabase query for filtering workshops
   */
  private buildWorkshopQuery(filters: FilterProps) {
    const isTimeFilterSelected = filters.time !== TimeFilter.ANY_TIME;
    const today = dateAsISOString();

    // When time filter is selected, use inner join to only get workshops with matching slots
    // Otherwise, use left join to include all workshops (even without slots)
    const slotJoin = isTimeFilterSelected
      ? "slot!inner(date, at_capacity, start_time, end_time, capacity, id)"
      : "slot(date, at_capacity, start_time, end_time, capacity, id)";

    const query = this.client
      .from("workshop")
      .select(`*, ${slotJoin}`)
      .order("created_at", { ascending: false });

    if (filters.category !== "") {
      query.eq("category", filters.category);
    }

    if (filters.text !== "") {
      const searchTerm = `%${filters.text}%`;
      query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    if (isTimeFilterSelected) {
      query.eq("slot.at_capacity", false);
      switch (filters.time) {
        case TimeFilter.THIS_WEEK:
          query.gte("slot.date", today);
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
      }
    }

    return query;
  }

  /**
   * Filters slots to only include upcoming, non-full slots
   */
  private filterValidSlots(slots: any[]): Slot[] {
    // Get today's date in UTC for comparison
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    return slots.filter((slot: any) => {
      if (!slot || slot.at_capacity) return false;
      // Parse UTC date string (YYYY-MM-DD) as UTC midnight
      const slotDate = new Date(`${slot.date}T00:00:00Z`);
      return slotDate >= todayUTC;
    });
  }

  /**
   * Processes raw workshop data and extracts valid slots
   */
  private processWorkshopSlots(
    filteredData: any[]
  ): Array<{ workshop: Workshop; slots: Slot[]; userId: string }> {
    const workshopsWithSlots: Array<{ workshop: Workshop; slots: Slot[]; userId: string }> = [];

    for (const item of filteredData) {
      const workshop = item as any;
      if (workshop.user_id) {
        const validSlots = this.filterValidSlots(workshop.slot || []);
        workshopsWithSlots.push({
          workshop,
          slots: validSlots,
          userId: workshop.user_id,
        });
      }
    }

    return workshopsWithSlots;
  }

  /**
   * Fetches host profiles for given user IDs
   */
  private async fetchHostProfiles(userIds: string[]): Promise<Map<string, Profile>> {
    const profileMap = new Map<string, Profile>();

    if (userIds.length === 0) return profileMap;

    const { data: profiles, error } = await this.client
      .from("profile")
      .select("*")
      .in("user_id", userIds);

    if (error) {
      console.error(`Failed to fetch profiles: ${error.message}`);
      return profileMap;
    }

    if (profiles) {
      for (const profile of profiles) {
        profileMap.set(profile.user_id, profile as Profile);
      }
    }

    return profileMap;
  }

  /**
   * Fetches booking counts for given slot IDs
   */
  private async fetchBookingCounts(slotIds: string[]): Promise<Map<string, number>> {
    const bookingCountMap = new Map<string, number>();

    if (slotIds.length === 0) return bookingCountMap;

    const { data: bookings, error } = await this.client
      .from("booking")
      .select("slot_id")
      .in("slot_id", slotIds);

    if (!error && bookings) {
      for (const booking of bookings) {
        const slotId = booking.slot_id.toString();
        bookingCountMap.set(slotId, (bookingCountMap.get(slotId) || 0) + 1);
      }
    }

    return bookingCountMap;
  }

  /**
   * Finds the next upcoming session from a list of slots
   */
  private findNextSession(slots: Slot[]): Slot | null {
    if (slots.length === 0) return null;

    const sortedSlots = [...slots].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.start_time.localeCompare(b.start_time);
    });

    return sortedSlots[0];
  }

  /**
   * Calculates total available spots across all slots
   */
  private calculateTotalAvailableSpots(
    slots: Slot[],
    bookingCountMap: Map<string, number>
  ): number {
    let totalAvailableSpots = 0;

    for (const slot of slots) {
      if (slot.id && slot.capacity) {
        const bookingCount = bookingCountMap.get(slot.id.toString()) || 0;
        const available = slot.capacity - bookingCount;
        totalAvailableSpots += Math.max(0, available);
      }
    }

    return totalAvailableSpots;
  }

  /**
   * Builds enriched workshop list items from processed data
   */
  private buildEnrichedWorkshops(
    workshopsWithSlots: Array<{ workshop: Workshop; slots: Slot[]; userId: string }>,
    profileMap: Map<string, Profile>,
    bookingCountMap: Map<string, number>
  ): WorkshopListItem[] {
    const enrichedWorkshops: WorkshopListItem[] = [];

    for (const { workshop, slots, userId } of workshopsWithSlots) {
      const host = profileMap.get(userId);
      if (!host) continue;

      const nextSession = this.findNextSession(slots);
      const totalAvailableSpots = this.calculateTotalAvailableSpots(slots, bookingCountMap);

      enrichedWorkshops.push({
        workshop,
        host,
        nextSession,
        upcomingSessionCount: slots.length,
        totalAvailableSpots,
      });
    }

    return enrichedWorkshops;
  }

  /**
   * Sorts workshops based on the selected sort option
   */
  private sortWorkshops(
    workshops: WorkshopListItem[],
    sortOption: SortOption
  ): WorkshopListItem[] {
    return workshops.sort((a, b) => {
      switch (sortOption) {
        case SortOption.SOONEST:
          if (!a.nextSession && !b.nextSession) {
            const aCreated = a.workshop.created_at || 0;
            const bCreated = b.workshop.created_at || 0;
            return bCreated - aCreated;
          }
          if (!a.nextSession) return 1;
          if (!b.nextSession) return -1;
          const aDate = parseUTCDateTime(a.nextSession.date, a.nextSession.start_time);
          const bDate = parseUTCDateTime(b.nextSession.date, b.nextSession.start_time);
          return aDate.getTime() - bDate.getTime();

        case SortOption.MOST_POPULAR:
          if (b.upcomingSessionCount !== a.upcomingSessionCount) {
            return b.upcomingSessionCount - a.upcomingSessionCount;
          }
          return b.totalAvailableSpots - a.totalAvailableSpots;

        case SortOption.NEWEST:
        default:
          const aCreated = a.workshop.created_at || 0;
          const bCreated = b.workshop.created_at || 0;
          return bCreated - aCreated;
      }
    });
  }

  async filterAvailableWorkshops(filters: FilterProps): Promise<WorkshopListItem[]> {
    // Build and execute query
    const query = this.buildWorkshopQuery(filters);
    const { data: filteredData, error } = await query;

    if (error) throw error;
    if (!filteredData || filteredData.length === 0) return [];

    // Process workshops and extract valid slots
    const workshopsWithSlots = this.processWorkshopSlots(filteredData);
    if (workshopsWithSlots.length === 0) return [];

    // Collect unique user IDs and slot IDs
    const userIds = Array.from(new Set(workshopsWithSlots.map((w) => w.userId)));
    const slotIds = Array.from(
      new Set(
        workshopsWithSlots.flatMap((w) =>
          w.slots.map((s) => (s.id ? s.id.toString() : "")).filter(Boolean)
        )
      )
    );

    // Fetch related data in parallel
    const [profileMap, bookingCountMap] = await Promise.all([
      this.fetchHostProfiles(userIds),
      this.fetchBookingCounts(slotIds),
    ]);

    // Build enriched workshops
    const enrichedWorkshops = this.buildEnrichedWorkshops(
      workshopsWithSlots,
      profileMap,
      bookingCountMap
    );

    // Apply sorting
    return this.sortWorkshops(enrichedWorkshops, filters.sort);
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

    if (!isBeforeNow(slot.date, slot.end_time)) {
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

  /**
   * Filters out past slots by checking end_time against current time
   */
  private filterPastSlots(slots: Array<{ slot: any; workshop: Workshop }>): Array<{ slot: any; workshop: Workshop }> {
    return slots.filter(({ slot }) => {
      if (!slot.date || !slot.end_time) return false;
      // Use isBeforeNow to check if slot has ended (inverse check)
      return !isBeforeNow(slot.date, slot.end_time);
    });
  }

  /**
   * Calculates available spots for a slot given its capacity and booking count
   */
  private calculateAvailableSpots(capacity: number, bookingCount: number): number {
    return Math.max(0, capacity - bookingCount);
  }

  /**
   * Builds UpcomingSession objects from processed slot data
   */
  private buildUpcomingSessions(
    validSlots: Array<{ slot: any; workshop: Workshop }>,
    profileMap: Map<string, Profile>,
    bookingCountMap: Map<string, number>,
    limit: number
  ): UpcomingSession[] {
    const upcomingSessions: UpcomingSession[] = [];

    for (const { slot, workshop } of validSlots) {
      if (upcomingSessions.length >= limit) break;

      const slotId = slot.id?.toString();
      if (!slotId) continue;

      const bookingCount = bookingCountMap.get(slotId) || 0;
      const availableSpots = this.calculateAvailableSpots(slot.capacity, bookingCount);

      // Double-check availability (at_capacity might be slightly out of sync)
      if (availableSpots > 0) {
        const host = profileMap.get(workshop.user_id);
        if (host) {
          upcomingSessions.push({
            workshop,
            slot: slot as Slot,
            host,
            bookingCount,
            availableSpots,
          });
        }
      }
    }

    return upcomingSessions;
  }

  async getUpcomingSessions(limit: number = 6): Promise<UpcomingSession[]> {
    try {
      // Get upcoming slots that are not at capacity, with workshop data
      const today = dateAsISOString();
      const { data: slotsData, error: slotsError } = await this.client
        .from("slot")
        .select(`
          *,
          workshop:workshop_id(*)
        `)
        .gte("date", today)
        .eq("at_capacity", false)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(limit * 2); // Fetch more to account for filtering

      if (slotsError) throw slotsError;
      if (!slotsData || slotsData.length === 0) return [];

      // Process slots and collect user IDs
      const slotsWithWorkshops: Array<{ slot: any; workshop: Workshop }> = [];
      const userIds = new Array<string>();

      for (const slotItem of slotsData) {
        const slot = slotItem as any;
        const workshop = slot.workshop as Workshop;
        if (workshop?.user_id) {
          userIds.push(workshop.user_id);
          slotsWithWorkshops.push({ slot, workshop });
        }
      }

      if (slotsWithWorkshops.length === 0) return [];

      // Filter out past slots (by end_time)
      const validSlots = this.filterPastSlots(slotsWithWorkshops);
      if (validSlots.length === 0) return [];

      // Collect slot IDs for booking count query
      const slotIds = validSlots
        .map(({ slot }) => (slot.id ? slot.id.toString() : ""))
        .filter(Boolean);

      // Fetch host profiles and booking counts in parallel
      const [profileMap, bookingCountMap] = await Promise.all([
        this.fetchHostProfiles(userIds),
        this.fetchBookingCounts(slotIds),
      ]);

      // Build and return upcoming sessions
      return this.buildUpcomingSessions(validSlots, profileMap, bookingCountMap, limit);
    } catch (error) {
      console.error(`Failed to get upcoming sessions: ${error}`);
      return [];
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const [workshopsResult, usersResult, slotsResult, bookingsResult] = await Promise.all([
        this.client.from("workshop").select("*", { count: "exact", head: true }),
        this.client.from("profile").select("*", { count: "exact", head: true }),
        this.client.from("slot").select("*", { count: "exact", head: true }),
        this.client.from("booking").select("*", { count: "exact", head: true })
      ]);

      return {
        totalWorkshops: workshopsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalSessions: slotsResult.count || 0,
        totalBookings: bookingsResult.count || 0
      };
    } catch (error) {
      console.error(`Failed to get platform stats: ${error}`);
      return {
        totalWorkshops: 0,
        totalUsers: 0,
        totalSessions: 0,
        totalBookings: 0
      };
    }
  }
}

export { SupabaseDataAccessor }
export const clientData = new SupabaseDataAccessor(createClient());