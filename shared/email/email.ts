import { User } from "../schemas";

export interface EmailSender {

  /**
   * Sends a booking confirmation email to both the host
   * and the attendee
   * @param host_user_id A host user id
   * @param attendee_user_id An attendee user id
   * @return A success boolean
   */
  sendBookingConfirmationEmails(host_user_id: string, attendee_user_id: string): Promise<boolean>

  /**
   * Sends a booking cancellation email to both the host 
   * and the attendee
   * @param host_user_id A host user id
   * @param attendee_user_id An attendee user id
   * @return A success boolean
   */
  sendBookingCancellationEmails(host_user_id: string, attendee_user_id: string): Promise<boolean>
}