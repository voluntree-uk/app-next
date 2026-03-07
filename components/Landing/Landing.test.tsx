import { render, screen } from "@testing-library/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import LandingConnectInPerson from "@components/Landing/LandingConnectInPerson";
import "@testing-library/jest-dom";

describe("Landing", () => {
  it("renders hero heading with in-person and online messaging", () => {
    render(<LandingHeading />);

    expect(
      screen.getByText(/Learn new skills for free—online or in your community/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/In-person/)).toBeInTheDocument();
    expect(screen.getByText(/Online/)).toBeInTheDocument();
  });

  it("renders how it works section with Learn and Host", () => {
    render(<LandingHowItWorks />);

    expect(screen.getByText(/How Voluntree Works/i)).toBeInTheDocument();
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Host")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Browse workshops/i })
    ).toHaveAttribute("href", "/workshops");
  });

  it("renders connect in person section with CTA", () => {
    render(<LandingConnectInPerson />);

    expect(
      screen.getByText(/Connect with your community in person/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Find in-person workshops/i })
    ).toHaveAttribute("href", "/workshops?location=in-person");
  });
});
