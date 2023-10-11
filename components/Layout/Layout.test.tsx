import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import { render, screen } from "@testing-library/react";
import Layout from "@components/Layout/Layout";

jest.mock("@components/Layout/Navbar", () => () => <div data-testid="navbar" />);
jest.mock("@components/Footer", () => () => <div data-testid="footer" />);

const children = <p>TestChildren</p>;

describe("Layout", () => {
  it("renders a navbar", () => {
    render(
      <RecoilRoot>
        <Layout>{children}</Layout>
      </RecoilRoot>
    );

    const navbar = screen.getByTestId("navbar");

    expect(navbar).toBeInTheDocument();
  });

  it("renders a footer", () => {
    const { container } = render(
      <RecoilRoot>
        <Layout>{children}</Layout>
      </RecoilRoot>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <RecoilRoot>
        <Layout>{children}</Layout>
      </RecoilRoot>
    );

    expect(screen.getByText("TestChildren")).toBeInTheDocument();
  });
});
