import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@components/Layout/Navbar";
import { User } from "@supabase/supabase-js";

const routerPushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => {
    return {
      push: routerPushMock,
      refresh: jest.fn(),
    };
  })
}));

var actualUser: User | null = null

const signOutMock = jest.fn();
jest.mock("@util/supabase/client", () => ({
  createClient: jest.fn(() => {
    return {
      auth: {
        getUser: jest.fn(() => {
          return {
            data: {
              user: actualUser,
            },
          };
        }),
        signOut: signOutMock,
      },
    };
  }),
}));

describe("Without a user", () => {

  beforeEach(() => {
    render(
      <RecoilRoot>
        <Navbar user={actualUser} />
      </RecoilRoot>
    );
  })

  test("renders navbar links and login button", () => {
    const findWorkshopsLink = screen.getByText("Find workshops");
    expect(findWorkshopsLink).toBeInTheDocument();
    expect(findWorkshopsLink.getAttribute("href")).toEqual("/workshops");

    const createWorkshopLink = screen.getByText("Create workshop");
    expect(createWorkshopLink).toBeInTheDocument();
    expect(createWorkshopLink.getAttribute("href")).toEqual("/workshops/new");

    const loginButton = screen.getByRole("button", { name: "Log in" });
    expect(loginButton).toBeInTheDocument();
  });

  test("dousen't render user avatar", () => {
    const avatar = screen.queryByRole("img", { name: "avatar" });
    expect(avatar).not.toBeInTheDocument();
  });

  test("doesn't render user controls dropdown", () => {
    const profileLink = screen.queryByText("Profile");
    expect(profileLink).not.toBeInTheDocument();

    const dashboardLink = screen.queryByText("Dashboard");
    expect(dashboardLink).not.toBeInTheDocument();

    const logoutLink = screen.queryByText("Log out");
    expect(logoutLink).not.toBeInTheDocument();
  });

  test("navigates to login page when login button is clicked", () => {
    const loginButton = screen.getByRole("button", { name: "Log in" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(routerPushMock).toHaveBeenCalled();
    expect(routerPushMock.mock.calls).toHaveLength(1);
    expect(routerPushMock.mock.calls[0][0]).toBe("/login");
  });

});

describe("With a user", () => {

  beforeEach(() => {
    actualUser = {
      id: "test-id",
      app_metadata: {},
      user_metadata: {},
      aud: "test",
      created_at: "2024-01-01T00:00:00"
    }
    render(
      <RecoilRoot>
        <Navbar user={actualUser} />
      </RecoilRoot>
    );
  });

  test("renders navbar links", () => {
    const findWorkshopsLink = screen.getByText("Find workshops");
    expect(findWorkshopsLink).toBeInTheDocument();
    expect(findWorkshopsLink.getAttribute("href")).toEqual("/workshops");

    const createWorkshopLink = screen.getByText("Create workshop");
    expect(createWorkshopLink).toBeInTheDocument();
    expect(createWorkshopLink.getAttribute("href")).toEqual("/workshops/new");
  });

  test("doesn't render login button", () => {
    const loginButton = screen.queryByRole("button", { name: "Log in" });
    expect(loginButton).not.toBeInTheDocument();
  });

  test("renders user avatar", () => {
    const avatar = screen.queryByRole("img", { name: "avatar" });
    expect(avatar).toBeInTheDocument();
  });

  test("renders user controls dropdown", () => {
    const profileLink = screen.getByText("Profile");
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.parentElement?.getAttribute("href")).toEqual("/user/test-id");

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.parentElement?.getAttribute("href")).toEqual("/me/dashboard");

    const logoutLink = screen.getByText("Log out");
    expect(logoutLink).toBeInTheDocument();
  });

  test("logs user out when log out button is clicked", () => {
    const logoutLink = screen.getByText("Log out");
    
    fireEvent.click(logoutLink);
    expect(signOutMock).toHaveBeenCalled();
  });  
})
