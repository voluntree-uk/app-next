import { ActionTrigger, InfrastructureAPI } from "./api";
import { clientData } from "../data/supabase";
import { BookingDetails, Profile, Slot, Workshop } from "../schemas";
import axios from "axios";
import { dateToReadable, isBeforeNow, parseUTCDateTime } from "@util/dates";

/**
 * An AWS API gateway implementation of the InfrastructureAPI
 */
class AWSInfrastructureAPI implements InfrastructureAPI {

  constructor(apiGatewayBaseUrl: string) {
    if (apiGatewayBaseUrl === "") {
      throw Error("Failed to initialise AWSAPIGateway, apiGatewayBaseUrl cannot be empty")
    }
  }

  private axios_instance = axios.create({
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async workshopConfirmation(workshop: Workshop): Promise<void> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const hasProfile = await clientData.hasProfile(workshop.user_id)
      if (!hasProfile) return
      const host: Profile = await clientData.getProfile(workshop.user_id)
      if (host) {
        const data = {
          host: {
            name: host.name,
            email: host.email
          },
          event: {
            name: workshop.name
          }
        }
        this.axios_instance.post(
          `${apiGatewayBaseUrl}/workshop/confirm`,
          JSON.stringify(data),
          { headers: { "Authorization": `Bearer ${jwt}` } }
        ).catch((err) => {
          console.error(`Failed to send workshop creation confirmation email: ${err}`)
        })
      }
    }
    return
  }

  async bookingConfirmation(booking: BookingDetails): Promise<void> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const host_user_id = booking.workshop.user_id
      const attendee_user_id = booking.user_id
      const booking_slot = booking.slot

      const hostHasProfile = await clientData.hasProfile(host_user_id)
      const attendeeHasProfile = await clientData.hasProfile(attendee_user_id)
      if (hostHasProfile && attendeeHasProfile) {
        const host: Profile = await clientData.getProfile(host_user_id)
        const attendee: Profile = await clientData.getProfile(attendee_user_id)

        const data = {
          host: {
            name: host.name,
            email: host.email
          },
          user: {
            name: attendee.name,
            email: attendee.email
          },
          event: {
            name: booking.workshop.name,
            date: dateToReadable(booking_slot.date, booking_slot.start_time),
            start_time: booking_slot.start_time,
            end_time: booking_slot.end_time,
            join_link: booking.workshop.meeting_link
          }
        }
        this.axios_instance.post(
          `${apiGatewayBaseUrl}/booking/confirm`,
          JSON.stringify(data),
          { headers: { "Authorization": `Bearer ${jwt}` } }
        ).catch((err) => {
          console.error(`Failed to send booking confirmation emails: ${err}`)
        })
      }
    } else {
      console.error(`Failed to obtain a JWT token`)
    }
  }

  async bookingCancellation(booking: BookingDetails, triggered_by: ActionTrigger): Promise<void> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const host_user_id = booking.workshop.user_id
      const attendee_user_id = booking.user_id
      const booking_slot = booking.slot

      const hostHasProfile = await clientData.hasProfile(host_user_id)
      const attendeeHasProfile = await clientData.hasProfile(attendee_user_id)
      if (hostHasProfile && attendeeHasProfile) {
        const host: Profile = await clientData.getProfile(host_user_id)
        const attendee: Profile = await clientData.getProfile(attendee_user_id)
        const data = {
          host: {
            name: host.name,
            email: host.email,
            didCancel: triggered_by === ActionTrigger.Host
          },
          user: {
            name: attendee.name,
            email: attendee.email,
            didCancel: triggered_by === ActionTrigger.Attendee
          },
          event: {
            name: booking.workshop.name,
            date: dateToReadable(booking_slot.date, booking_slot.start_time),
            time: booking_slot.start_time
          }
        }
        this.axios_instance.post(
          `${apiGatewayBaseUrl}/booking/cancel`,
          JSON.stringify(data),
          { headers: { "Authorization": `Bearer ${jwt}` } }
        ).catch((err) => {
          console.error(`Failed to send booking cancellation emails: ${err}`)
        })
      }
    } else {
      console.error(`Failed to obtain a JWT token`)
    }
  }

  async scheduleSlot(slot: Slot): Promise<boolean> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      // Parse UTC datetime and format as ISO 8601 UTC timestamp
      const slotEndDate = parseUTCDateTime(slot.date, slot.end_time);
      const slot_end_timestamp = slotEndDate.toISOString().replace("Z","");

      if (!isBeforeNow(slot.date, slot.end_time)) {
        const data = {
          slot_id: slot.id,
          slot_end_timestamp: slot_end_timestamp
        }
        return this.axios_instance.post(
          `${apiGatewayBaseUrl}/session/events/schedule`,
          JSON.stringify(data),
          { headers: { "Authorization": `Bearer ${jwt}` } }
        ).then((response) => {
          return (response.status == 200) ? true : false
        }).catch((err) => {
          console.error(`Failed to execute schedule slot events request: ${err}`)
          return false
        })
      }
      return false
    } else {
      console.error(`Failed to obtain a JWT token`)
      return false
    }
  }

  async cancelSlot(slot: Slot): Promise<boolean> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const data = {
        slot_id: slot.id
      }
      return this.axios_instance.post(
        `${apiGatewayBaseUrl}/session/events/cancel`,
        JSON.stringify(data),
        { headers: { "Authorization": `Bearer ${jwt}` } }
      ).then((response) => {
        return (response.status == 200) ? true : false
      }).catch((err) => {
        console.error(`Failed to execute cancel slot events request: ${err}`)
        return false
      })
    } else {
      console.error(`Failed to obtain a JWT token`)
      return false
    }
  }

  async generateMeetingLink(workshop: Workshop): Promise<string> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const data = {
        name: workshop.name
      }
      return this.axios_instance.post(
        `${apiGatewayBaseUrl}/meeting-room/create`,
        JSON.stringify(data),
        { headers: { "Authorization": `Bearer ${jwt}` } }
      ).then((response) => {
        return (response.status == 200) ? response.data["message"] : null
      }).catch((err) => {
        console.error(`Failed to generate an online meeting link: ${err}`)
        return null
      })
    } else {
      throw new Error("Failed to obtain a JWT token")
    }
  }

  async showWorkshopInterest(workshop: Workshop): Promise<void> {
    const jwt = await clientData.getJWT()
    if (jwt) {
      const host: Profile = await clientData.getProfile(workshop.user_id)
      if (host) {
        const data = {
          host: {
            name: host.name,
            email: host.email
          },
          event: {
            name: workshop.name
          }
        }
        this.axios_instance.post(
          `${apiGatewayBaseUrl}/workshop/show-interest`,
          JSON.stringify(data),
          { headers: { "Authorization": `Bearer ${jwt}` } }
        ).catch((err) => {
          console.error(`Failed to send workshop show interest email: ${err}`)
        })
      }
    }
    return
  }

  async welcomeUser({name, email}: {name: string, email: string}): Promise<void> {
    const jwt = await clientData.getJWT();
    if (jwt && email) {
      const data = {
        user: {
          name: name,
          email: email,
        }
      };

      this.axios_instance
        .post(`${apiGatewayBaseUrl}/user/welcome`, JSON.stringify(data), {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .catch((err) => {
          console.error(`Failed to send welcome email: ${err}`);
        });
    }
  }

  async contactUs({name, email, purpose, message}: {name: string, email: string, purpose: string, message: string}): Promise<void> {
    const data = {
      name: name,
      email: email,
      purpose: purpose,
      message: message,
    };

    this.axios_instance
      .post(`${apiGatewayBaseUrl}/contact`, JSON.stringify(data))
      .catch((err) => {
        console.error(`Failed to send contact form email: ${err}`);
      });
  }
}

const apiGatewayBaseUrl: string = process.env.NEXT_PUBLIC_AWS_GATEWAY_BASE_URL || "";
export const api = new AWSInfrastructureAPI(apiGatewayBaseUrl);