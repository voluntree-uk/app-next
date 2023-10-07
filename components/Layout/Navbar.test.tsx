import { render, screen, fireEvent } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import "@testing-library/jest-dom";
import { RouterContext } from "next/dist/shared/lib/router-context";
import Navbar from "./Navbar";
import { createMockRouter } from "../../utils/test-utils/createMockRouter";

jest.mock("next/router");

jest.mock("../../utils/hooks", () => ({
  useSession: jest.fn(() => ({ user: null })),
}));

jest.mock("../../shared/auth/supabase", () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

jest.mock("../AuthenticationModal", () => ({
  __esModule: true,
  default: () => <div>AuthenticationModal</div>,
}));

const MockNavbar = () => (
  <RecoilRoot>
    <Navbar />
  </RecoilRoot>
);

describe("Navbar", () => {
  test("renders navbar links", () => {
    render(<MockNavbar />);

    const findWorkshopsLink = screen.getByRole("link", {
      name: "Find workshops",
    });
    const createWorkshopLink = screen.queryByRole("link", {
      name: "Create workshop",
    });

    expect(findWorkshopsLink).toBeInTheDocument();
    expect(createWorkshopLink).toBeInTheDocument();
  });

  test("renders login button when user is not authenticated", () => {
    render(<MockNavbar />);

    const loginButton = screen.getByRole("button", { name: "Log in" });

    expect(loginButton).toBeInTheDocument();
  });

  test("opens authentication modal when login button is clicked", () => {
    render(<MockNavbar />);

    const loginButton = screen.getByRole("button", { name: "Log in" });
    expect(loginButton).toBeInTheDocument();

    // const formElement = screen.queryByRole("form");
    // expect(formElement).toBeInTheDocument();
  });

  test("renders create workshop button when user is authenticated", () => {
    // Mocking authenticated user
    jest.mock("../../utils/hooks", () => ({
      useSession: jest.fn(() => ({ user: { name: "John Doe" } })),
    }));

    render(<MockNavbar />);

    const createWorkshopButton = screen.getByRole("link", {
      name: "Create workshop",
    });

    expect(createWorkshopButton).toBeInTheDocument();
  });

  test("redirects to create workshop page when create workshop button is clicked", () => {
    const router = createMockRouter({
      pathname: "/workshops/new",
    });

    render(
      <RouterContext.Provider value={router}>
        <MockNavbar />
      </RouterContext.Provider>
    );

    const createWorkshopButton = screen.getByRole("link", {
      name: "Create workshop",
    });
    fireEvent.click(createWorkshopButton);

    // Check if the router's push function was called with the correct path
    expect(router.push).toHaveBeenCalled();
  });
});
