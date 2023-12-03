import { render, screen, fireEvent } from "@testing-library/react";
import LandingHeading from "@components/Landing/LandingHeading";
import LandingHowItWorks from "@components/Landing/LandingHowItWorks";
import "@testing-library/jest-dom";

describe("Landing", () => {
  it("renders a heading", () => {
    render(<LandingHeading />);

    const heading = screen.getByText(
      /Voluntree is a knowledge-sharing platform with a difference./i
    );

    expect(heading).toBeInTheDocument();
  });

  it("renders a how it works section", () => {
    render(<LandingHowItWorks />);

    expect(screen.getByText(/How Voluntree/i)).toBeInTheDocument();
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Find workshops')).toBeInTheDocument();
  });
});
