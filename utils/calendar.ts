import { addDays, addMinutes } from "date-fns";
import config from "@config";

const meeting = config.communityMeeting;

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/**
 * Returns the wall-clock (year, month, day, hour, minute, second) of `date`
 * as displayed in the given IANA timezone.
 */
function wallClockParts(timezone: string, date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, number> = {};
  for (const piece of formatter.formatToParts(date)) {
    if (piece.type !== "literal") parts[piece.type] = Number(piece.value);
  }
  return parts;
}

/**
 * Converts a wall-clock datetime in the given timezone to the UTC instant that
 * displays as that wall-clock time. Correct across DST transitions.
 */
function wallClockToUtc(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const wall = wallClockParts(timezone, new Date(naiveUtc));
  const wallAsUtc = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );
  return new Date(naiveUtc + (naiveUtc - wallAsUtc));
}

/**
 * Returns the start time (as a `Date`) of the next upcoming meeting, computed
 * by stepping forward from the configured anchor by `intervalWeeks` until it is
 * after `now`. Always lands in the future, so the generated event never shows a
 * stale date.
 */
export function getNextMeetingStart(now: Date = new Date()): Date {
  const [year, month, day] = meeting.anchorDate.split("-").map(Number);
  const [hour, minute] = meeting.time.split(":").map(Number);
  const anchor = wallClockToUtc(meeting.timezone, year, month, day, hour, minute);
  const stepDays = meeting.intervalWeeks * 7;
  const nowMs = now.getTime();
  let candidate = anchor;
  while (candidate.getTime() < nowMs) {
    candidate = addDays(candidate, stepDays);
  }
  return candidate;
}

/**
 * Computes the recurring day-of-week (BYDAY token) from the anchor date, so the
 * recurrence rule follows the configured schedule automatically.
 */
function meetingWeekday(): string {
  const [year, month, day] = meeting.anchorDate.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return WEEKDAYS[weekday];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Formats a date as the local wall-clock time in the meeting timezone, in the
 * `YYYYMMDDTHHMMSS` form Google's `action=TEMPLATE` deep link expects (no `Z`).
 */
function toGoogleDates(start: Date, durationMinutes: number): string {
  const startParts = wallClockParts(meeting.timezone, start);
  const endParts = wallClockParts(meeting.timezone, addMinutes(start, durationMinutes));
  const format = (p: Record<string, number>) =>
    `${p.year}${pad(p.month)}${pad(p.day)}T${pad(p.hour)}${pad(p.minute)}00`;
  return `${format(startParts)}/${format(endParts)}`;
}

/**
 * Builds a Google Calendar `action=TEMPLATE` link for the next upcoming biweekly
 * community meeting, anchored to an always-future date.
 */
export function buildCommunityMeetingCalendarUrl(now: Date = new Date()): string {
  const start = getNextMeetingStart(now);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: meeting.title,
    dates: toGoogleDates(start, meeting.durationMinutes),
    details: `${meeting.description}\n${meeting.joinDetails}`,
    location: "Online",
    ctz: meeting.timezone,
    recur: `RRULE:FREQ=WEEKLY;INTERVAL=${meeting.intervalWeeks};BYDAY=${meetingWeekday()}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}