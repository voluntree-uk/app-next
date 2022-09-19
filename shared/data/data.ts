import {
  Workshop,
  Slot,
  Booking,
  BookingDetails
} from "../schemas";

export interface DataAccessor {
  /**
   * Creates given workshop
   * @param workshop A workshop to create
   * @return A created workshop
   */
  createWorkshop(workshop: Workshop): Promise<Workshop>

  /**
   * Returns all workshops that have available slots at any point in the future
   * @return A list of matching workshops
   */
  getAvailableWorkshops(): Promise<Workshop[]>

  /**
   * Returns all workshops that have a matching string in their title
   * @param str A string to search for in workshop titles
   * @return A list of matching workshops
   */
  searchWorkshops(str: string): Promise<Workshop[]>

  /**
   * Returns a list of workshops associated with the given category
   * @param category A category name
   * @return A list of matching workshops
   */
  getWorkshopsByCategory(category: string): Promise<Workshop[]> 

  /**
   * Returns a workshop associated with the given id
   * @param id A workshop id
   * @return A workshop associated with the given id
   */
  getWorkshop(id: string): Promise<Workshop>

  /**
   * Returns a list of workshop slots associated with the given workshop id
   * @param id A workshop id
   * @return A list of matching slots
   */
  getWorkshopSlots(id: string): Promise<Slot[]>

  /**
   * Returns a list of workshop bookings associated with the given workshop id
   * @param id A workshop id
   * @return A list of matching bookings
   */
  getWorkshopBookings(id: string): Promise<Booking[]>

  /**
   * Returns all workshops hosted by the given user
   * @param user_id A user id
   * @return A list of matching workshops
   */
  getUserWorkshops(user_id: string): Promise<Workshop[]>

  /**
   * Creates given slots
   * @param slots A list of slots to be created
   * @return A boolean representing the success of the method
   */
  createSlots(slots: Slot[]): Promise<boolean>

  /**
   * Returns a slot associated with the given id
   * @param id A slot id
   * @return A slot associated with the given id
   */
  getSlot(id: string): Slot

  /**
   * Returns all slot bookings associated with the given slot id
   * @param id A slot id
   * @return A list of matching bookings
   */
  getSlotBookings(id: string): Booking[]

  /**
   * Returns all bookings a user has made
   * @param user_id A user id
   * @return A list of matching bookings
   */
  getUserBookings(user_id: string): Promise<BookingDetails[]>

  /**
   * Books a workshop slot for the user
   * @param workshop_id A workshop id
   * @param slot_id A slot id
   * @param user_id A user id
   * @return A boolean representing the success of the method
   */
  bookSlot(workshop_id: string, slot_id: string, user_id: string): Promise<boolean>

  /**
   * Removes a booking with a given id
   * @param id A booking id
   * @return A boolean representing the success of the method
   */
  removeBooking(id: string): Promise<boolean>
}