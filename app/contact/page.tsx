"use server";

import ContactForm from "./contact-form";
import { api } from "@infra/aws";

export default async function ContactPage() {
  const submitContact = async (
    name: string,
    email: string,
    purpose: string,
    message: string
  ): Promise<{ success: boolean; error: string | undefined }> => {
    "use server";

    try {
      await api.contactUs({ name, email, purpose, message });
      return {
        success: true,
        error: undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to send message. Please try again later.",
      };
    }
  };

  return <ContactForm submitContact={submitContact} />;
}

