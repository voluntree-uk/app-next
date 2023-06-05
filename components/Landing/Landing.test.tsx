import { render, screen } from "@testing-library/react";
import Landing from "./Landing";
import LandingHeading from "./LandingHeading";
import LandingHowItWorks from "./LandingHowItWorks";
import "@testing-library/jest-dom";

describe("Landing", () => {
  it("renders a heading", () => {
    render(<LandingHeading />);

    const heading = screen.getByText(
      /Societree is a knowledge-sharing platform with a difference./i
    );

    expect(heading).toBeInTheDocument();
  });

  it("renders a how it works section", () => {
    render(<LandingHowItWorks />);

    const heading = screen.getByText(/How Societree/i);

    expect(heading).toBeInTheDocument();
  });
});
