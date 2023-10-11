import { render, screen } from "@testing-library/react";
import Show from "@components/Helpers/Show";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Show showIf>Welcome to Next.js!</Show>);

    const heading = screen.getByText(/Welcome to Next.js!/i);

    expect(heading).toBeInTheDocument();
  });

  it("renders nothing if showIf is false", () => {
    render(<Show showIf={false}>Welcome to Next.js!</Show>);

    const heading = screen.queryByText(/Welcome to Next.js!/i);

    expect(heading).not.toBeInTheDocument();
  });

  it("renders nothing if there is no children", () => {
    render(<Show showIf={false} />);

    const heading = screen.queryByText(/Welcome to Next.js!/i);

    expect(heading).not.toBeInTheDocument();
  });
});
