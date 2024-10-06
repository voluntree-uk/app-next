import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AuthenticationForm from "./AuthenticationForm";
import { Providers } from "../../app/providers"; // Assuming Providers is a component that wraps AuthenticationForm

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
}));

describe("AuthenticationForm", () => {
  const mockSignUp = jest.fn();
  const mockSignIn = jest.fn();
  const mockResetPassword = jest.fn();

  beforeEach(() => {
    render(
      <Providers>
        <AuthenticationForm
          signUp={mockSignUp}
          signIn={mockSignIn}
          resetPassword={mockResetPassword}
        />
      </Providers>
    );
  });

  it("renders Login and Sign Up tabs", () => {
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders AuthenticationLogin component when Login tab is selected", () => {
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Log in to your account")).toBeInTheDocument();
  });

  it("renders AuthenticationSignUp component when Sign Up tab is selected", () => {
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });
});
