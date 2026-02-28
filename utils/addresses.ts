import { Workshop } from "@schemas";

function hasFullAddress(workshop: Workshop): boolean {
  const house = workshop.house?.trim();
  const street = workshop.street?.trim();
  const postcode = workshop.postcode?.trim();
  return !!(house || street) && !!postcode;
}

/**
 * Returns a readable address or location line for a workshop.
 * For virtual workshops, callers typically do not use this (they show "Online").
 * For in-person: shows full address if present, otherwise meeting_place + city/postcode.
 */
export function workshopToReadableAddress(workshop: Workshop): string {
  if (workshop.virtual) {
    return "Online";
  }
  if (hasFullAddress(workshop)) {
    const parts = [workshop.house, workshop.street].filter(Boolean).join(" ");
    return `${parts}, ${workshop.postcode}`.trim();
  }
  const place = workshop.meeting_place?.trim();
  const city = workshop.city?.trim();
  const postcode = workshop.postcode?.trim();
  const parts = [place, city, postcode].filter(Boolean);
  if (parts.length === 0) return "In-person (see description for location)";
  return parts.join(", ");
}