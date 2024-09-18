import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import { render, screen } from "@testing-library/react";
import Layout from "@components/Layout/Layout";

jest.mock("@components/Layout/Navbar", () => () => (
  <div data-testid="navbar" />
));
jest.mock("@components/Layout/CookieConsent", () => () => (
  <div data-testid="cookie-consent" />
));
jest.mock("@components/Footer", () => () => (
  <div data-testid="footer" />
));

const children = <p>TestChildren</p>;
const user = null

describe("Layout", () => {

  test("renders a navbar", () => {
    render(
      <RecoilRoot>
        <Layout user={user}>{children}</Layout>
      </RecoilRoot>
    );
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
  });

  test("renders a footer", () => {
    render(
      <RecoilRoot>
        <Layout user={user}>{children}</Layout>
      </RecoilRoot>
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });

  test("renders a cookie consent", () => {
    render(
      <RecoilRoot>
        <Layout user={user}>{children}</Layout>
      </RecoilRoot>
    );
    const cookieConsent = screen.getByTestId("cookie-consent");
    expect(cookieConsent).toBeInTheDocument();
  });

  test("renders children", () => {
    render(
      <RecoilRoot>
        <Layout user={user}>{children}</Layout>
      </RecoilRoot>
    );
    expect(screen.getByText("TestChildren")).toBeInTheDocument();
  });
});
