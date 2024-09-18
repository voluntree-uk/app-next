import { render, screen } from "@testing-library/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import "@testing-library/jest-dom";

describe("Landing", () => {
  test("renders a heading", () => {
    render(<LandingHeading />);

    const heading = screen.getByText(
      /Voluntree is a skill and knowledge sharing platform with a difference./i
    );

    expect(heading).toBeInTheDocument();
  });

  test("renders a how it works section", () => {
    render(<LandingHowItWorks />);

    expect(screen.getByText(/How Voluntree works/i)).toBeInTheDocument();

    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();

    expect(screen.getByText("Create workshop")).toBeInTheDocument();
    expect(screen.getByText("Browse workshops")).toBeInTheDocument();
    expect(screen.getByText("Finances page")).toBeInTheDocument();
  });
});
