import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  startOfWeek,
  endOfWeek,
  isSunday,
  isWeekend,
  nextMonday,
  nextSaturday,
  nextSunday,
  add
} from "date-fns";

dayjs.extend(relativeTime);
dayjs.extend(utc);

/**
 * Parses a UTC date and time string into a Date object.
 * @param date UTC date string (YYYY-MM-DD)
 * @param time UTC time string (HH:mm:ss or HH:mm)
 * @returns Date object representing the UTC datetime in local timezone
 */
export function parseUTCDateTime(date: string, time: string): Date {
  // Combine date and time, ensure time has seconds if missing
  const timeWithSeconds = time.length === 5 ? `${time}:00` : time;
  const utcString = `${date}T${timeWithSeconds}Z`;
  return new Date(utcString);
}

/**
 * Converts local date and time strings to UTC format.
 * This function handles both start and end times.
 * @param localDate Local date string (YYYY-MM-DD)
 * @param localStartTime Local start time string (HH:mm:ss or HH:mm)
 * @param localEndTime Local end time string (HH:mm:ss or HH:mm)
 * @returns Object with UTC date, start_time, and end_time strings
 */
export function localSlotToUTC(localDate: string, localStartTime: string, localEndTime: string): { date: string; start_time: string; end_time: string } {
  // Normalize time format to include seconds
  const startTimeWithSeconds = localStartTime.length === 5 ? `${localStartTime}:00` : localStartTime;
  const endTimeWithSeconds = localEndTime.length === 5 ? `${localEndTime}:00` : localEndTime;

  // Create Date objects from local date/time strings
  // The browser will interpret these as local time
  const localStartDate = new Date(`${localDate}T${startTimeWithSeconds}`);
  const localEndDate = new Date(`${localDate}T${endTimeWithSeconds}`);

  // Convert to UTC
  const utcStartYear = localStartDate.getUTCFullYear();
  const utcStartMonth = String(localStartDate.getUTCMonth() + 1).padStart(2, '0');
  const utcStartDay = String(localStartDate.getUTCDate()).padStart(2, '0');
  const utcStartHours = String(localStartDate.getUTCHours()).padStart(2, '0');
  const utcStartMinutes = String(localStartDate.getUTCMinutes()).padStart(2, '0');
  const utcStartSeconds = String(localStartDate.getUTCSeconds()).padStart(2, '0');

  const utcEndHours = String(localEndDate.getUTCHours()).padStart(2, '0');
  const utcEndMinutes = String(localEndDate.getUTCMinutes()).padStart(2, '0');
  const utcEndSeconds = String(localEndDate.getUTCSeconds()).padStart(2, '0');

  return {
    date: `${utcStartYear}-${utcStartMonth}-${utcStartDay}`,
    start_time: `${utcStartHours}:${utcStartMinutes}:${utcStartSeconds}`,
    end_time: `${utcEndHours}:${utcEndMinutes}:${utcEndSeconds}`,
  };
}

/**
 * Converts UTC date and time strings to local timezone for display.
 * @param utcDate UTC date string (YYYY-MM-DD)
 * @param utcTime UTC time string (HH:mm:ss or HH:mm)
 * @returns Local time string (HH:mm)
 */
export function utcTimeToLocal(utcDate: string, utcTime: string): string {
  const timeWithSeconds = utcTime.length === 5 ? `${utcTime}:00` : utcTime;
  // Parse as UTC datetime
  const utcDateTime = new Date(`${utcDate}T${timeWithSeconds}Z`);

  // Get local time components
  const localHours = String(utcDateTime.getHours()).padStart(2, '0');
  const localMinutes = String(utcDateTime.getMinutes()).padStart(2, '0');

  return `${localHours}:${localMinutes}`;
}

/**
 * Returns the given date as a readable string.
 * Assumes the date string is in UTC format (YYYY-MM-DD).
 * @param date the UTC date string to convert to a readable string
 * @param time the UTC time string to convert to a readable string
 * @param include_weekday a boolean flag determining whether to include
 * weekdays in the output string
 * @returns given date as a readable string in local timezone
 */
export function dateToReadable(date: string, time: string = "00:00:00", include_weekday: boolean = true): string {
  const options: {
    weekday?: any;
    year?: any;
    month?: any;
    day?: any;
  } = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (include_weekday) options.weekday = "long";

  // Parse as UTC date and convert to local for display
  // Create a Date object from UTC date string (treating it as UTC midnight)
  const utcDateObj = new Date(`${date}T${time}Z`);

  return utcDateObj.toLocaleDateString("en-US", options);
}

/**
 * Returns a given time interval as a readable string.
 * Assumes times are stored in UTC and converts them to local timezone for display.
 * @param utcDate UTC date string (YYYY-MM-DD) - needed to properly convert times across date boundaries
 * @param start_time UTC start time string (HH:mm:ss or HH:mm)
 * @param end_time UTC end time string (HH:mm:ss or HH:mm)
 * @returns given time interval as a readable string in local timezone
 */
export function timeToReadable(start_time: string, end_time: string, utcDate?: string): string {
  // If utcDate is provided, use it for accurate timezone conversion
  // Otherwise, use today's UTC date (fallback for backward compatibility during migration)
  const date = utcDate || new Date().toISOString().split('T')[0];

  const localStartTime = utcTimeToLocal(date, start_time);
  const localEndTime = utcTimeToLocal(date, end_time);

  return `${localStartTime} - ${localEndTime}`;
}

/**
 * Returns a given date in an ISO compliant format.
 * @param date a date to convert to an ISO string, today by default.
 * @returns given date in an ISO compliant format
 */
export function dateAsISOString(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
}

/**
 * Returns the end date of this week.
 * @returns end date of this week
 */
export function endOfThisWeekAsISOString(): string {
  const today = new Date();
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
  return dateAsISOString(endOfThisWeek);
}

/**
 * Returns the start date of next week.
 * @returns start date of next week
 */
export function startOfNextWeekAsISOString(): string {
  const today = new Date();
  const nextMon = nextMonday(today);
  const startOfNextWeek = startOfWeek(nextMon, { weekStartsOn: 1 });
  return dateAsISOString(startOfNextWeek);
}

/**
 * Returns the end date of next week.
 * @returns end date of next week
 */
export function endOfNextWeekAsISOString(): string {
  const today = new Date();
  const nextMon = nextMonday(today);
  const endOfNextWeek = endOfWeek(nextMon, { weekStartsOn: 1 });
  return dateAsISOString(endOfNextWeek);
}

/**
 * Returns the start date of this weekend. If it isn't the weekend
 * today it returns the following Saturday otherwise it returns
 * today's date regardless of whether it is Saturday or Sunday.
 * @returns start date of this weekend
 */
export function startOfThisWeekendAsISOString(): string {
  const today = new Date();
  if (isWeekend(today)) {
    return dateAsISOString(today)
  } else {
    return dateAsISOString(nextSaturday(today))
  }
}

/**
 * Returns the end date of this weekend. If it is Sunday it returns
 * today and otherwise it returns the following Sunday.
 * @returns end date of this weekend
 */
export function endOfThisWeekendAsISOString(): string {
  const today = new Date();
  if (isSunday(today)) {
    return dateAsISOString(today)
  } else {
    return dateAsISOString(nextSunday(today))
  }
}

/**
 * Checks if a date is before now.
 * Can accept either a Date object or UTC date+time strings.
 * @param dateOrUtcDate Either a Date object or UTC date string (YYYY-MM-DD)
 * @param utcTime Optional UTC time string (HH:mm:ss or HH:mm) - required if first param is a string
 * @returns true if the date/time is before now
 */
export function isBeforeNow(dateOrUtcDate: Date | string, utcTime?: string): boolean {
  let date: Date;

  if (dateOrUtcDate instanceof Date) {
    date = dateOrUtcDate;
  } else {
    // Parse UTC datetime strings
    if (!utcTime) {
      throw new Error("utcTime is required when dateOrUtcDate is a string");
    }
    date = parseUTCDateTime(dateOrUtcDate, utcTime);
  }

  const now = new Date();
  return date < now;
}

export function isOlderThan(date: Date, duration: Duration): boolean {
  return add(date, duration) < new Date()
}