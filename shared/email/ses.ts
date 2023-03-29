import { EmailSender } from "./email";
import { data } from "../data/supabase";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Profile } from "../schemas";

/**
 * An AWS Simple Emailing Service (SES) implementation of the EmailSender interface
 */
class SESEmailSender implements EmailSender {

  client = new SESv2Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || '',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
    }
  });

  emails = {
    from: "no-reply@societree.co.uk",
    bounce: "bounce@societree.co.uk",
    templates: {
      confirm_attendee: "confirm-booking-for-attendee",
      confirm_host: "confirm-booking-for-host",
      cancel_attendee: "cancel-booking-for-attendee",
      cancel_host: "cancel-booking-for-host"
    }
  }
  
  async sendBookingConfirmationEmails(host_user_id: string, attendee_user_id: string): Promise<boolean> {
    const host = await data.getProfile(host_user_id)
    const host_email = this.makeSendEmailCommand(host, this.emails.templates.confirm_host, { name: host.name });

    const attendee = await data.getProfile(attendee_user_id)
    const attendee_email = this.makeSendEmailCommand(attendee, this.emails.templates.confirm_attendee, { name: attendee.name });
    
    try {
      await this.client.send(host_email);
      await this.client.send(attendee_email);
      return true
    } catch (error: any) {
      console.error(error.message)
      return false
    }
  }

  async sendBookingCancellationEmails(host_user_id: string, attendee_user_id: string): Promise<boolean> {
    const host = await data.getProfile(host_user_id)
    const host_email = this.makeSendEmailCommand(host, this.emails.templates.cancel_host, { name: host.name });

    const attendee = await data.getProfile(attendee_user_id)
    const attendee_email = this.makeSendEmailCommand(attendee, this.emails.templates.cancel_attendee, { name: attendee.name });

    try {
      await this.client.send(host_email);
      await this.client.send(attendee_email);
      return true
    } catch (error: any) {
      console.error(error.message)
      return false
    }
  }

  private makeSendEmailCommand(recipient: Profile, template_name: string, template_data: object): SendEmailCommand {
    return new SendEmailCommand({
      FromEmailAddress: this.emails.from,
      Destination: {
        ToAddresses: [ recipient.email ],
      },
      FeedbackForwardingEmailAddress: this.emails.bounce,
      Content: {
        Template: {
          TemplateName: template_name,
          TemplateData: JSON.stringify(template_data),
        },
      },
    });
  }
}

export const email = new SESEmailSender();