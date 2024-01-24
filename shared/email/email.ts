import { Slot } from "@schemas"

export interface EmailSender {
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
   * @param slot Booked slot
   * @param join_link A link to the 
   */
  sendBookingConfirmations(host_user_id: string, attendee_user_id: string, slot: Slot, join_link: string): Promise<void>

  /**
   * Sends a booking cancellation email to both the host and the attendee
   * @param host_user_id A host user id
   * @param attendee_user_id An attendee user id
   * @param slot Slot to cancel
   * @param triggered_by Action triggered by
   */
  sendBookingCancellations(host_user_id: string, attendee_user_id: string, slot: Slot, triggered_by: ActionTrigger): Promise<void>
}

export enum ActionTrigger {
  Host,
  Attendee,
}