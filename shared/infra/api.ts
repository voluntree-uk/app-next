import { BookingDetails, Slot, Workshop } from "@schemas"

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
   * Schedule a slot post processing event
   * @param slot A slot for which the post processing is to be scheduled
   * @returns A boolean representing the operation success
   */
  scheduleSlotPostProcessing(slot: Slot): Promise<boolean>

  /**
   * Cancel a slot post processing event
   * @param slot A slot for which the post processing is to be cancelled
   * @returns A boolean representing the operation success
   */
  cancelSlotPostProcessing(slot: Slot): Promise<boolean>

  /**
   * Generates a URL for an online meeting
   * @param workshop The meeting for which to generate the meeting link
   * @returns A join URL
   */
  generateMeetingLink(workshop: Workshop): Promise<string>
}

export enum ActionTrigger {
  Host,
  Attendee,
}
