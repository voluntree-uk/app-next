import { Workshop } from "../shared/schemas";

export function workshopToReadableAddress(workshop: Workshop) {
  return `${workshop.house} ${workshop.street}, ${workshop.postcode}`;
}