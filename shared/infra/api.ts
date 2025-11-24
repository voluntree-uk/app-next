import { BookingDetails, Profile, Slot, Workshop } from "@schemas"

export interface InfrastructureAPI {
  /**
   * Sends a workshop creation confirmation email to the host 
   * @param workshop Workshop details
   */
  workshopConfirmation(workshop: Workshop): Promise<void>

  /**
   * Sends a booking confirmation email to both the host and the attendee
   * @param booking A booking to be confirmed
   */
  bookingConfirmation(booking: BookingDetails): Promise<void>

  /**
   * Sends a booking cancellation email to both the host and the attendee
   * @param booking A booking to be cancelled
   * @param triggered_by Action triggered by
   */
  bookingCancellation(booking: BookingDetails, triggered_by: ActionTrigger): Promise<void>

  /**
   * Schedule a slot reminder and post processing events
   * @param slot A slot for which the events are to be scheduled
   * @returns A boolean representing the operation success
   */
  scheduleSlot(slot: Slot): Promise<boolean>

  /**
   * Cancel a slot reminder and post processing events
   * @param slot A slot for which the events are to be cancelled
   * @returns A boolean representing the operation success
   */
  cancelSlot(slot: Slot): Promise<boolean>

  /**
   * Generates a URL for an online meeting
   * @param workshop The meeting for which to generate the meeting link
   * @returns A join URL
   */
  generateMeetingLink(workshop: Workshop): Promise<string>

  /**
   * Sends a workshop interest email to the host
   * @param workshop The workshop for which to show interest
   */
  showWorkshopInterest(workshop: Workshop): Promise<void>

  /**
   * Sends a welcome email to a newly onboarded user
   * @param name The user's name
   * @param email The user's email
   */
  welcomeUser({name, email}: {name: string, email: string}): Promise<void>

  /**
   * Sends a contact form submission email
   * @param name The contact's name
   * @param email The contact's email
   * @param purpose The purpose of the contact
   * @param message The contact's message
   */
  contactUs({name, email, purpose, message}: {name: string, email: string, purpose: string, message: string}): Promise<void>
}

export enum ActionTrigger {
  Host,
  Attendee,
}
