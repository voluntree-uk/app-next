import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CookieConsent from "@components/Layout/CookieConsent";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => {
    return {
      refresh: refreshMock,
    };
  }),
}));

const setCookieMock = jest.fn();

jest.mock("cookies-next", () => ({
  setCookie: (key: string, data: any) => setCookieMock(key, data),
  hasCookie: jest.fn(),
  getCookie: jest.fn(),
}));

const onOpenMock = jest.fn();
const onCloseMock = jest.fn();


describe("Cookie Consent Form", () => { 
 
  beforeEach(() => {
    jest.resetModules();

    process.env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_PRIVACY_POLICY_URL: "http://local.test/privacy-policy",
    };

    render(
      <CookieConsent isOpen={true} onOpen={onOpenMock} onClose={onCloseMock} />
    );
  });

  test("renders a title, a message, an accept and a reject button", () => {
    const title = screen.getByText("Help us improve Voluntree?");
    expect(title).toBeInTheDocument();

    const message = screen.getByText(
      "It's important to understand how companies use your data!"
    );
    expect(message).toBeInTheDocument();

    const analytics = screen.getByText(
      "We are trying to make the most impactful platform we can! Analytics help us understand how you use the platform so we can improve it."
    );
    expect(analytics).toBeInTheDocument();

    const acceptButton = screen.getByRole("button", { name: "Accept Analytics" });
    expect(acceptButton).toBeInTheDocument();

    const rejectButton = screen.getByRole("button", { name: "Essential Only" });
    expect(rejectButton).toBeInTheDocument();
  });

  test("sets cookie to true when accept button is clicked", () => {
    const acceptButton = screen.getByRole("button", { name: "Accept Analytics" });
    expect(acceptButton).toBeInTheDocument();

    fireEvent.click(acceptButton);
    expect(setCookieMock).toHaveBeenCalled();
    expect(setCookieMock.mock.calls).toHaveLength(1);
    expect(setCookieMock.mock.calls[0][0]).toBe("analytics-consent");
    expect(setCookieMock.mock.calls[0][1]).toBe("true");

    expect(onCloseMock).toHaveBeenCalled();
    expect(onCloseMock.mock.calls).toHaveLength(1);

    expect(refreshMock).toHaveBeenCalled();
    expect(refreshMock.mock.calls).toHaveLength(1);
  });

  test("sets cookie to false when reject button is clicked", () => {
    const rejectButton = screen.getByRole("button", { name: "Essential Only" });
    expect(rejectButton).toBeInTheDocument();

    fireEvent.click(rejectButton);
    expect(setCookieMock).toHaveBeenCalled();
    expect(setCookieMock.mock.calls).toHaveLength(2);
    expect(setCookieMock.mock.calls[1][0]).toBe("analytics-consent");
    expect(setCookieMock.mock.calls[1][1]).toBe("false");

    expect(onCloseMock).toHaveBeenCalled();
    expect(onCloseMock.mock.calls).toHaveLength(2);

    expect(refreshMock).toHaveBeenCalled();
    expect(refreshMock.mock.calls).toHaveLength(2);
  });

});
