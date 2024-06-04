import { Slot } from "@schemas"

export interface InfrastructureAPI {
  /**
   * Sends a workshop creation confirmation email to the host 
   * @param host_user_id A host user id
   * @param workshop_name A workshop name
   */
  sendWorkshopCreationConfirmation(host_user_id: string, workshop_name: string): Promise<void>

  /**
   * Sends a booking confirmation email to both the host and the attendee
   * @param host_user_id A host user id
   * @param attendee_user_id An attendee user id
   * @param workshop_name A workshop name
   * @param slot Booked slot
   * @param join_link A link to the 
   */
  sendBookingConfirmations(host_user_id: string, attendee_user_id: string, workshop_name: string, slot: Slot, join_link: string): Promise<void>

  /**
   * Sends a booking cancellation email to both the host and the attendee
   * @param host_user_id A host user id
   * @param attendee_user_id An attendee user id
   * @param workshop_name A workshop name
   * @param slot Slot to cancel
   * @param triggered_by Action triggered by
   */
  sendBookingCancellations(host_user_id: string, attendee_user_id: string, workshop_name: string, slot: Slot, triggered_by: ActionTrigger): Promise<void>

  /**
   * Schedule a slot post processing event
   * @param slot_id A slot id for which the post processing is to be scheduled
   * @param slot_end_timestamp A timestamp of when the slot finishes in YYYY-MM-DD'T'HH:mm:ss format
   * @returns A boolean representing the operation success
   */
  scheduleSlotPostProcessing(slot_id: string, slot_end_timestamp: string): Promise<boolean>

  /**
   * Cancel a slot post processing event
   * @param slot_id A slot id for which the post processing is to be cancelled
   * @returns A boolean representing the operation success
   */
  cancelSlotPostProcessing(slot_id: string): Promise<boolean>

  /**
   * Generates a URL for an online meeting
   * @param meeting_name The meeting name
   * @returns A join URL
   */
  generateMeetingLink(meeting_name: string): Promise<string>
}

export enum ActionTrigger {
  Host,
  Attendee,
}