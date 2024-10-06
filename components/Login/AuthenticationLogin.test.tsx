import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthenticationLogin from "./AuthenticationLogin";
import { Providers } from "../../app/providers";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));

const mockSignIn = jest.fn();
const mockResetPassword = jest.fn();
const mockRouter = { back: jest.fn(), refresh: jest.fn() };
const mockToast = jest.fn();

describe("AuthenticationLogin", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue(mockToast);
    render(
      <Providers>
        <AuthenticationLogin
          signIn={mockSignIn}
          resetPassword={mockResetPassword}
        />
      </Providers>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    expect(screen.getByText("Log in to your account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  it("renders reset password form correctly", async () => {
    fireEvent.click(screen.getByText("Forgot Password?"));
    waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
      expect(screen.getByText("Back to login")).toBeInTheDocument();
    });
  });

  it("submits login form successfully", async () => {
    mockSignIn.mockResolvedValue({ success: true, error: undefined });
    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign in"));
    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password")
    );
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Login Successful" })
      )
    );
    expect(mockRouter.back).toHaveBeenCalled();
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("shows error on login failure", async () => {
    mockSignIn.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });
    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign in"));
    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password")
    );
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login Unsuccessful",
          description: "Invalid credentials",
          status: "error",
        })
      )
    );
  });

  it("submits reset password form successfully", async () => {
    mockResetPassword.mockResolvedValue({ success: true, error: undefined });
    fireEvent.click(screen.getByText("Forgot Password?"));
    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com")
    );
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Check your email to complete password reset",
        })
      )
    );
  });

  it("shows error on reset password failure", async () => {
    mockResetPassword.mockResolvedValue({
      success: false,
      error: "Email not found",
    });
    fireEvent.click(screen.getByText("Forgot Password?"));
    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com")
    );
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password Reset Unsuccessful",
          description: "Email not found",
          status: "error",
        })
      )
    );
  });
});
