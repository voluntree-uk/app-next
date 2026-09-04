import {
  buildCommunityMeetingCalendarUrl,
  getNextMeetingStart,
} from "./calendar";

// The biweekly series anchors to Wed 2026-09-09 18:00 Europe/London (= 17:00Z in BST).
// These "now" values exercise the advance logic around the first occurrence.
const MEETING_START_UTC = "2026-09-09T17:00:00Z"; // the first meeting's actual start instant
const WED_FIRST_HOUR = "2026-09-09T17:59:59Z";    // late in the first meeting, before it ends
const THU_AFTER = "2026-09-10T12:00:00Z";         // day after first
const WED_SECOND = "2026-09-23T17:00:00Z";        // second occurrence start instant
const WINTER = "2026-12-15T12:00:00Z";            // after DST ends (GMT)

describe("getNextMeetingStart", () => {
  it("returns the first meeting when now is before it", () => {
    const start = getNextMeetingStart(new Date(MEETING_START_UTC));
    expect(start.toISOString()).toBe("2026-09-09T17:00:00.000Z");
  });

  it("skips an in-progress meeting and returns the next occurrence", () => {
    const start = getNextMeetingStart(new Date(WED_FIRST_HOUR));
    expect(start.toISOString()).toBe("2026-09-23T17:00:00.000Z");
  });

  it("advances biweekly once the current occurrence has passed", () => {
    const start = getNextMeetingStart(new Date(THU_AFTER));
    expect(start.toISOString()).toBe("2026-09-23T17:00:00.000Z");

    const second = getNextMeetingStart(new Date(WED_SECOND));
    expect(second.toISOString()).toBe("2026-09-23T17:00:00.000Z");
  });

  it("keeps landing on Wednesdays, even across DST (winter GMT)", () => {
    const start = getNextMeetingStart(new Date(WINTER));
    expect(start.toISOString()).toBe("2026-12-16T18:00:00.000Z");
  });
});

describe("buildCommunityMeetingCalendarUrl", () => {
  it("uses the meeting timezone (Europe/London) not UTC", () => {
    const url = buildCommunityMeetingCalendarUrl(new Date("2026-09-04T12:00:00Z"));
    expect(url).toContain("ctz=Europe%2FLondon");

    const start = getNextMeetingStart(new Date("2026-09-04T12:00:00Z"));
    expect(url).toContain("dates=20260909T180000%2F20260909T190000");
    expect(start.toISOString()).toBe("2026-09-09T17:00:00.000Z");
  });

  it("encodes the biweekly Wednesday recurrence rule", () => {
    const url = buildCommunityMeetingCalendarUrl(new Date("2026-09-04T12:00:00Z"));
    expect(url).toContain(
      "recur=RRULE%3AFREQ%3DWEEKLY%3BINTERVAL%3D2%3BBYDAY%3DWE",
    );
  });

  it("embeds the meeting title, description and join details", () => {
    const url = buildCommunityMeetingCalendarUrl(new Date("2026-09-04T12:00:00Z"));
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("text=Voluntree+Community+Meeting");
    expect(url).toContain("meet.google.com");
    expect(url).toContain("location=Online");
  });

  it("the start time always lands on a Wednesday 18:00 wall-clock in the timezone", () => {
    const start = getNextMeetingStart(new Date(WINTER));
    expect(start.toISOString()).toBe("2026-12-16T18:00:00.000Z");
    const url = buildCommunityMeetingCalendarUrl(new Date(WINTER));
    expect(url).toMatch(/dates=\d{8}T180000/);
  });
});