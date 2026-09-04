"use server";

import AboutPageClient from "@components/About/AboutPage";
import { buildCommunityMeetingCalendarUrl } from "@util/calendar";

export default async function AboutPage() {
  const calendarLink = buildCommunityMeetingCalendarUrl();
  return (
    <AboutPageClient calendarLink={calendarLink}/>
  );
}


