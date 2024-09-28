import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WorkshopList } from "@components/Dashboard/WorkshopList";
import { Workshop } from "@schemas";

var workshops: Workshop[] = [];
const navigateMock = jest.fn();
const getWorkshopSlotsMock = jest
  .fn()
  .mockImplementation((id: string) => {
    if (id === "with-slots") {
      return Promise.resolve([
        {
          id: "test1",
          workshop_id: "id",
          date: "3025-11-11",
          start_time: "17:00:00",
          end_time: "18:00:00",
          capacity: 3,
        },
      ]);
    } else {
      return Promise.resolve([]);
    }
  });

jest.mock("@data/supabase", () => ({
  clientData: {
    getWorkshopSlots: (id: string) => getWorkshopSlotsMock(id),
  }
}));

async function renderComponent() {
  await act(async () =>
    render(<WorkshopList workshops={workshops} navigate={navigateMock} />)
  );
}

describe("Dashboard Workshop List", () => {  

  describe("Without workshops", () => {
    beforeEach(() => renderComponent());

    test("renders headings", () => {
      renderComponent();

      const heading = screen.getByText("Hosted workshops (0)");
      expect(heading).toBeInTheDocument();

      const description = screen.getByText("Workshops that you are hosting");
      expect(description).toBeInTheDocument();
    });

    test("renders no results", () => {
      const noResults = screen.getByText("No Workshops Found");
      expect(noResults).toBeInTheDocument();
    })

    test("no call to getWorkshopSlots", () => {
      expect(getWorkshopSlotsMock.mock.calls).toHaveLength(0);
    });

  });

  describe("With workshops", () => {

    describe("Without slots", () => {
      beforeEach(() => {
        workshops = [
          {
            id: "test-workshop",
            name: "Test Workshop",
            user_id: "test-user",
            description: "testing the app",
            category: "technology",
            virtual: true,
            meeting_link: "http://mock.call.client/call-id",
          },
        ];
        // getWorkshopSlotsMock.mockResolvedValue([]);
        renderComponent()
      });

      test("renders headings", () => {
        const heading = screen.getByText("Hosted workshops (1)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops that you are hosting");
        expect(description).toBeInTheDocument();
      });

      test("renders workshop card", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        const location = screen.getByText("Online Event");
        expect(location).toBeInTheDocument();

        const dates = screen.getByText("0 upcoming dates");
        expect(dates).toBeInTheDocument();

        const manageButton = screen.getByRole("button", { name: "Manage" });
        expect(manageButton).toBeInTheDocument();
      });

      test("navigates to workshop when title is clicked", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        fireEvent.click(title);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(1);
        expect(navigateMock.mock.calls[0][0]).toBe("test-workshop");
      });

      test("navigates to workshop when manage button is clicked", () => {
        const manageButton = screen.getByRole("button", { name: "Manage" });
        expect(manageButton).toBeInTheDocument();

        fireEvent.click(manageButton);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(3);
        expect(navigateMock.mock.calls[1][0]).toBe("test-workshop");
        expect(navigateMock.mock.calls[2][0]).toBe("test-workshop");
      });

      test("does not render no results", () => {
        const noResults = screen.queryByText("No Workshops Found");
        expect(noResults).not.toBeInTheDocument();
      });
    });

    describe("With slots", () => {
      beforeEach(async () => {
        workshops = [
          {
            id: "with-slots",
            name: "Test Workshop",
            user_id: "test-user",
            description: "testing the app",
            category: "technology",
            virtual: true,
            meeting_link: "http://mock.call.client/call-id",
          },
        ];
        await renderComponent();
      });

      test("renders headings", () => {
        const heading = screen.getByText("Hosted workshops (1)");
        expect(heading).toBeInTheDocument();

        const description = screen.getByText("Workshops that you are hosting");
        expect(description).toBeInTheDocument();
      });

      test("renders workshop card", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        const location = screen.getByText("Online Event");
        expect(location).toBeInTheDocument();

        const dates = screen.getByText("1 upcoming date");
        expect(dates).toBeInTheDocument();

        const manageButton = screen.getByRole("button", { name: "Manage" });
        expect(manageButton).toBeInTheDocument();
      });

      test("navigates to workshop when title is clicked", () => {
        const title = screen.getByText("Test Workshop");
        expect(title).toBeInTheDocument();

        fireEvent.click(title);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(4);
        expect(navigateMock.mock.calls[3][0]).toBe("with-slots");
      });

      test("navigates to workshop when manage button is clicked", () => {
        const manageButton = screen.getByRole("button", { name: "Manage" });
        expect(manageButton).toBeInTheDocument();

        fireEvent.click(manageButton);
        expect(navigateMock).toHaveBeenCalled();
        expect(navigateMock.mock.calls).toHaveLength(6);
        expect(navigateMock.mock.calls[4][0]).toBe("with-slots");
        expect(navigateMock.mock.calls[5][0]).toBe("with-slots");
      });

      test("does not render no results", () => {
        const noResults = screen.queryByText("No Workshops Found");
        expect(noResults).not.toBeInTheDocument();
      });
    });
  })
})