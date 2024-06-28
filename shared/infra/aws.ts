import { ActionTrigger, InfrastructureAPI } from "./api";
import { clientData } from "../data/supabase";
import { Profile, Slot } from "../schemas";
import axios from "axios";
import { dateToReadable, isBeforeNow } from "@util/dates";

/**
 * An AWS API gateway implementation of the InfrastructureAPI
 */
class AWSInfrastructureAPI implements InfrastructureAPI {

  private workshopCreationConfirmationEndpoint: string;
  private bookingConfirmationEndpoint: string;
  private bookingCancellationEndpoint: string;
  private scheduleSlotPostProcessingEndpoint: string;
  private cancelSlotPostProcessingEndpoint: string;
  private generateMeetingEndpoint: string;
  
  constructor(apiGatewayBaseUrl: string) {
    if (apiGatewayBaseUrl === "") {
      throw Error("Failed to initialise AWSAPIGateway, apiGatewayBaseUrl cannot be empty")
    }
    this.workshopCreationConfirmationEndpoint = `${apiGatewayBaseUrl}/workshopCreationConfirmation`
    this.bookingConfirmationEndpoint = `${apiGatewayBaseUrl}/bookingConfirmation`
    this.bookingCancellationEndpoint = `${apiGatewayBaseUrl}/bookingCancellation`
    this.scheduleSlotPostProcessingEndpoint = `${apiGatewayBaseUrl}/scheduleSlotPostProcessing`
    this.cancelSlotPostProcessingEndpoint = `${apiGatewayBaseUrl}/cancelSlotPostProcessing`
    this.generateMeetingEndpoint = `${apiGatewayBaseUrl}/generateOnlineMeeting`
  }

  private axios_instance = axios.create({
    headers: {
      'X-Voluntree-Auth': '*'
    }
  });

  async sendWorkshopCreationConfirmation(host_user_id: string, workshop_name: string): Promise<void> {
    const hasProfile = await clientData.hasProfile(host_user_id)
    if (!hasProfile) return
    const host: Profile = await clientData.getProfile(host_user_id)
    if (host) {
      const data = {
        host: {
          name: host.name,
          email: host.email
        },
        event: {
          name: workshop_name
        }
      }
      this.axios_instance.post(this.workshopCreationConfirmationEndpoint, JSON.stringify(data)).catch((err) => {
        console.error(`Failed to send workshop creation confirmation email: ${err}`)
      })
    }
    return
  }

  async sendBookingConfirmations(host_user_id: string, attendee_user_id: string, workshop_name: string, slot: Slot, join_link: string | undefined): Promise<void> {
    const hostHasProfile = await clientData.hasProfile(host_user_id)
    const attendeeHasProfile = await clientData.hasProfile(host_user_id)
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
          name: workshop_name,
          date: dateToReadable(slot.date),
          time: slot.start_time,
          join_link: join_link
        }
      }
      this.axios_instance.post(this.bookingConfirmationEndpoint, JSON.stringify(data)).catch((err) => {
        console.error(`Failed to send booking confirmation emails: ${err}`)
      })
    }
    return
  }

  async sendBookingCancellations(host_user_id: string, attendee_user_id: string, workshop_name: string, slot: Slot, triggered_by: ActionTrigger): Promise<void> {
    const hostHasProfile = await clientData.hasProfile(host_user_id)
    const attendeeHasProfile = await clientData.hasProfile(host_user_id)
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
          name: workshop_name,
          date: dateToReadable(slot.date),
          time: slot.start_time
        }
      }
      this.axios_instance.post(this.bookingCancellationEndpoint, JSON.stringify(data)).catch((err) => {
        console.error(`Failed to send booking cancellation emails: ${err}`)
      })
    }
    return
  }

  async scheduleSlotPostProcessing(slot_id: string, slot_end_timestamp: string): Promise<boolean> {
    if (!isBeforeNow(new Date(slot_end_timestamp))) {
      const data = {
        slot_id: slot_id,
        slot_end_timestamp: slot_end_timestamp
      }
      return this.axios_instance.post(this.scheduleSlotPostProcessingEndpoint, JSON.stringify(data)).then((response) => {
        return (response.status == 200) ? true : false
      }).catch((err) => {
        console.error(`Failed to execute schedule slot post processing request: ${err}`)
        return false
      })
    }
    return false
  }

  async cancelSlotPostProcessing(slot_id: string): Promise<boolean> {
    const data = {
      schedule_name: `Slot-${slot_id}`
    }
    return this.axios_instance.post(this.cancelSlotPostProcessingEndpoint, JSON.stringify(data)).then((response) => {
      return (response.status == 200) ? true : false
    }).catch((err) => {
      console.error(`Failed to execute cancel slot post processing request: ${err}`)
      return false
    })
  }

  async generateMeetingLink(meeting_name: string): Promise<string> {
    const data = {
      name: meeting_name
    }
    return this.axios_instance.post(this.generateMeetingEndpoint, JSON.stringify(data)).then((response) => {
      return (response.status == 200) ? response.data["message"] : null
    }).catch((err) => {
      console.error(`Failed to generate an online meeting link: ${err}`)
      return null
    })
  }
}

const apiGatewayBaseUrl: string = process.env.NEXT_PUBLIC_AWS_GATEWAY_BASE_URL || "";
export const api = new AWSInfrastructureAPI(apiGatewayBaseUrl);