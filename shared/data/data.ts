import { ActionTrigger } from "@infra/api";
import {
  Profile,
  Workshop,
  WorkshopInterest,
  Slot,
  Booking,
  BookingDetails,
  FilterProps,
  UpcomingSession,
  PlatformStats,
  FeaturedReview
} from "@schemas";

export interface DataAccessor {
  /**
   * Creates given user profile
   * @param profile A profile to create
   * @return A created profile
   */
  createProfile(profile: Profile): Promise<Profile>

  /**
   * Updates given user profile
   * @param profile A profile to be updated
   * @return An updated profile
   */
  updateProfile(profile: Profile): Promise<Profile>

  /**
   * Checks whether the user with the given id has a profile
   * @param id A user id
   * @return A boolean representing whether the user has a profile
   */
  hasProfile(id: string): Promise<Boolean>

  /**
   * Returns a profile associated with the given id
   * @param id A profile/user id
   * @return A profile associated with the given id
   */
  getProfile(id: string): Promise<Profile>

  /**
   * Gets a JWT token for the currently logged in user
   * @return A JWT token if a user is logged in
   */
  getJWT(): Promise<string|undefined>

  /**
   * Creates given workshop
   * @param workshop A workshop to create
   * @return A created workshop
   */
  createWorkshop(workshop: Workshop): Promise<Workshop>

  /**
   * Updates given workshop
   * @param workshop A workshop to update
   * @return An updated workshop
   */
  updateWorkshop(workshop: Workshop): Promise<Workshop>

  /**
   * Cancels a workshop with a given id
   * @param workshop_id An id of the workshop to cancel
   * @return A boolean representing the success of the method
   */
  cancelWorkshop(workshop_id: string): Promise<boolean>

  /**
   * Adds a workshop interest
   * @param workshop_interest A workshop interest
   * @param workshop A workshop of interest
   * @return A boolean representing the success of the method
   */
  expressInterestInWorkshop(workshop_interest: WorkshopInterest, workshop: Workshop): Promise<boolean>

  /**
   * Returns all workshops that have available slots at any point in the future,
   * optionally filtered
   * @param filters A set of additional filters([FilterProps]) to be applied 
   * @return A list of matching workshops
   */
  filterAvailableWorkshops(filters: FilterProps): Promise<Workshop[]>

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
   * Cancels a slot
   * @param slot A slot to be cancelled
   * @return A boolean representing the success of the method
   */
  cancelSlot(slot: Slot): Promise<boolean>

  /**
   * Returns all bookings a user has made
   * @param user_id A user id
   * @return A list of matching bookings
   */
  getUserBookings(user_id: string): Promise<BookingDetails[]>

  /**
   * Books a workshop slot for the user
   * @param workshop A booked workshop
   * @param slot A booked slot
   * @param user_id A user id
   * @return A boolean representing the success of the method
   */
  bookSlot(workshop: Workshop, slot: Slot, user_id: string): Promise<boolean>

  /**
   * Cancels a booking with a given id
   * @param booking A booking to be cancelled
   * @param triggered_by Who triggered the cancellation
   * @return A boolean representing the success of the method
   */
  cancelBooking(booking: BookingDetails, triggered_by: ActionTrigger): Promise<boolean>

  /**
   * Submits a review for a booking
   * @param booking_id A booking id
   * @param rating Review rating out of 5
   * @param comment Review comment
   * @return A boolean representing the success of the method
   */
  reviewBooking(booking_id: string, rating: number, comment: string): Promise<boolean>

  /**
   * Returns an avatar public URL given the path
   * @param path An avatar path
   * @return The avatar public URL
   */
  getAvatarUrl(path: string): Promise<string>

  /**
   * Uploads an avatar given the path and the file body
   * @param path An avatar path
   * @param file A file body
   * @return A boolean representing the success of the method
   */
  uploadAvatar(path: string, file: string): Promise<boolean>

  /**
   * Returns upcoming workshop sessions sorted by date
   * @param limit Maximum number of sessions to return (default: 6)
   * @return A list of upcoming sessions with workshop, slot, host, and booking info
   */
  getUpcomingSessions(limit?: number): Promise<UpcomingSession[]>

  /**
   * Returns platform statistics (workshops, users, sessions, bookings)
   * @return Platform statistics
   */
  getPlatformStats(): Promise<PlatformStats>

  /**
   * Returns featured reviews for testimonials
   * @param limit Maximum number of reviews to return (default: 4)
   * @return A list of featured reviews with rating, comment, user name, and workshop name
   */
  getFeaturedReviews(limit?: number): Promise<FeaturedReview[]>
}