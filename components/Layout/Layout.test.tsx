import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

jest.mock("./Navbar", () => () => <div data-testid="navbar" />);
jest.mock("../Footer", () => () => <div data-testid="footer" />);

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
