import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookingDetails } from "@schemas";
import { BookingList, Type } from "@components/Dashboard/BookingList";

const navigateMock = jest.fn();
const reviewBookingMock = jest.fn();
const cancelBookingMock = jest.fn();

jest.mock("@data/supabase", () => ({
  clientData: {
    reviewBooking: () => reviewBookingMock(),
    cancelBooking: () => cancelBookingMock(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => {
    return {
      replace: jest.fn(),
    };
  }),
  useSearchParams: jest.fn(() => {
    return {
      get: (id: string) => jest.fn(),
    };
  }),
  usePathname: jest.fn()
}));

// Needed for testing the ReviewModal overlay
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

async function renderComponent(bookings: BookingDetails[], type: Type) {
  await act(async () =>
    render(<BookingList bookings={bookings} type={type} navigate={navigateMock} />)
  );
}

describe("Dashboard Booking List", () => {  

  describe("Upcoming bookings", () => {

    describe("Without bookings", () => {
      beforeEach(() => {
        renderComponent([], Type.Upcoming);
      });

      test("renders headings", () => {
        const heading = screen.getByText("Upcoming bookings (0)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops you are going to soon");
        expect(description).toBeInTheDocument();
      });

      test("renders no results", () => {
        const noResults = screen.getByText("No Bookings Found");
        expect(noResults).toBeInTheDocument();
      });

    })

    describe("With bookings", () => {
      beforeEach(() => {
        const bookings: BookingDetails[] = [
          {
            id: "test-booking",
            workshop_id: "test-workshop",
            user_id: "test-user",
            slot_id: "test-slot",
            workshop: {
              id: "test-workshop",
              name: "Test Workshop",
              user_id: "test-host",
              description: "testing the app",
              category: "technology",
              virtual: true,
              meeting_link: "http://mock.call.client/call-id",
            },
            slot: {
              id: "test-slot",
              workshop_id: "test-workshop",
              date: "3025-11-11",
              start_time: "17:00:00",
              end_time: "18:00:00",
              capacity: 3,
            },
          },
        ];
        renderComponent(bookings, Type.Upcoming)
      });

      test("renders headings", () => {
        const heading = screen.getByText("Upcoming bookings (1)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops you are going to soon");
        expect(description).toBeInTheDocument();
      });

      test("renders booking card", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        const date = screen.getByText("Friday, November 11, 3025");
        expect(date).toBeInTheDocument();

        const time = screen.getByText("17:00 - 18:00");
        expect(time).toBeInTheDocument();

        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        expect(cancelButton).toBeInTheDocument();
      });

      test("navigates to workshop when title is clicked", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        fireEvent.click(title);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(1);
        expect(navigateMock.mock.calls[0][0]).toBe("test-workshop");
      });

      test("opens confirm dialog when cancel button is clicked", () => {
        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);

        const title = screen.getByText("Cancel Booking");
        expect(title).toBeInTheDocument();

        const description = screen.getByText("Are you sure you want to cancel this booking? This action cannot be undone.");
        expect(description).toBeInTheDocument();
      });
    });
    
  });

  describe("Past bookings", () => {
    describe("Without bookings", () => {
      beforeEach(() => {
        renderComponent([], Type.Past);
      });

      test("renders headings", () => {
        const heading = screen.getByText("Past bookings (0)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops that you recently attended");
        expect(description).toBeInTheDocument();
      });

      test("renders no results", () => {
        const noResults = screen.getByText("No Bookings Found");
        expect(noResults).toBeInTheDocument();
      });
    });

    describe("With nonreviewed bookings", () => {
      beforeEach(() => {
        const bookings: BookingDetails[] = [
          {
            id: "test-booking",
            workshop_id: "test-workshop",
            user_id: "test-user",
            slot_id: "test-slot",
            review_rating: null,
            workshop: {
              id: "test-workshop",
              name: "Test Workshop",
              user_id: "test-host",
              description: "testing the app",
              category: "technology",
              virtual: true,
              meeting_link: "http://mock.call.client/call-id",
            },
            slot: {
              id: "test-slot",
              workshop_id: "test-workshop",
              date: "1903-03-07",
              start_time: "11:00:00",
              end_time: "12:00:00",
              capacity: 3,
            },
          },
        ];
        renderComponent(bookings, Type.Past);
      });

      test("renders headings", () => {
        const heading = screen.getByText("Past bookings (1)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops that you recently attended");
        expect(description).toBeInTheDocument();
      });

      test("renders booking card", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        const date = screen.getByText("Saturday, March 7, 1903");
        expect(date).toBeInTheDocument();

        const time = screen.getByText("11:00 - 12:00");
        expect(time).toBeInTheDocument();

        const reviewButton = screen.getByRole("button", { name: "Review" });
        expect(reviewButton).toBeInTheDocument();
      });

      test("navigates to workshop when title is clicked", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        fireEvent.click(title);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(2);
        expect(navigateMock.mock.calls[1][0]).toBe("test-workshop");
      });

      test("opens confirm dialog when cancel button is clicked", () => {
        const reviewButton = screen.getByRole("button", { name: "Review" });
        expect(reviewButton).toBeInTheDocument();

        fireEvent.click(reviewButton);

        const rating = screen.getByText("How would you rate this workshop:");
        expect(rating).toBeInTheDocument();

        const moreInfo = screen.getByText("Additional information (optional):");
        expect(moreInfo).toBeInTheDocument();
      });
    });

    describe("With reviewed bookings", () => {
      beforeEach(() => {
        const bookings: BookingDetails[] = [
          {
            id: "test-booking",
            workshop_id: "test-workshop",
            user_id: "test-user",
            slot_id: "test-slot",
            review_rating: 5.0,
            workshop: {
              id: "test-workshop",
              name: "Test Workshop",
              user_id: "test-host",
              description: "testing the app",
              category: "technology",
              virtual: true,
              meeting_link: "http://mock.call.client/call-id",
            },
            slot: {
              id: "test-slot",
              workshop_id: "test-workshop",
              date: "1903-03-07",
              start_time: "11:00:00",
              end_time: "12:00:00",
              capacity: 3,
            },
          },
        ];
        renderComponent(bookings, Type.Past);
      });

      test("renders headings", () => {
        const heading = screen.getByText("Past bookings (1)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops that you recently attended");
        expect(description).toBeInTheDocument();
      });

      test("renders booking card", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        const date = screen.getByText("Saturday, March 7, 1903");
        expect(date).toBeInTheDocument();

        const time = screen.getByText("11:00 - 12:00");
        expect(time).toBeInTheDocument();

        const reviewButton = screen.getByRole("button", { name: "Reviewed" });
        expect(reviewButton).toBeInTheDocument();
      });

      test("navigates to workshop when title is clicked", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        fireEvent.click(title);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(3);
        expect(navigateMock.mock.calls[2][0]).toBe("test-workshop");
      });
    });
  });
})