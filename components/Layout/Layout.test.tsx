import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";
import Footer from "../Footer";
import Navbar from "./Navbar";

describe("Layout", () => {
  it("renders a navbar", () => {
    render(
      <RecoilRoot>
        <Layout>
          <Navbar />
        </Layout>
      </RecoilRoot>
    );

    const navbar = screen.getAllByRole("navigation");

    expect(navbar[0]).toBeInTheDocument();
  });

  it("renders a footer", () => {
    const { container } = render(
      <RecoilRoot>
        <Layout>
          <Footer />
        </Layout>
      </RecoilRoot>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <RecoilRoot>
        <Layout>
          <p>Test</p>
        </Layout>
      </RecoilRoot>
    );

    const paragraph = screen.getByText(/All rights reserved/i);

    expect(paragraph).toBeInTheDocument();
  });
});
