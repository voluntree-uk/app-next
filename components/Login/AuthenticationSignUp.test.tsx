import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthenticationSignUp from "./AuthenticationSignUp";

import { Providers } from "../../app/providers";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockToast = jest.fn();

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));

const mockSignUp = jest.fn();
const mockRouter = { back: jest.fn(), refresh: jest.fn(), push: jest.fn() };

describe("Authentication Sign Up", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue(mockToast);
    render(
      <Providers>
        <AuthenticationSignUp signUp={mockSignUp} />
      </Providers>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders the component", () => {
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("I accept")).toBeInTheDocument();
    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("shows error toast if passwords do not match", async () => {
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByText("I accept"));

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Passwords must match",
          status: "error",
        })
      );
    });
  });

  it("shows success toast and redirects on successful sign-up", async () => {
    mockSignUp.mockResolvedValue({ success: true, error: undefined });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("I accept"));

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success",
          description: "Verify your email to continue",
          status: "success",
        })
      );
    });
  });

  test("shows error toast on unsuccessful sign-up", async () => {
    mockSignUp.mockResolvedValue({ success: false, error: "Sign up failed" });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("I accept"));

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Sign Up Unsuccessful",
          description: "Sign up failed",
          status: "error",
        })
      );
    });
  });
});
