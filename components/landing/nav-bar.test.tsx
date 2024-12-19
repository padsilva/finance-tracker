import { render, screen, fireEvent, within } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { NavBar } from "./nav-bar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("NavBar", () => {
  const mockPathname = jest.mocked(usePathname);

  beforeEach(() => {
    // Default path
    mockPathname.mockReturnValue("/");
  });

  it("should render logo and brand name", () => {
    render(<NavBar />);

    // Check logo
    const logo = screen.getByAltText("FinanceTracker Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("width", "32");
    expect(logo).toHaveAttribute("height", "32");

    // Check brand name
    const brandName = screen.getByText("FinanceTracker");
    expect(brandName).toBeInTheDocument();
    expect(brandName).toHaveClass("text-xl", "font-bold");
  });

  it("should render desktop navigation when not on email-confirmed page", () => {
    render(<NavBar />);

    const desktopNav = screen.getByRole("navigation");
    expect(desktopNav).toHaveClass("border-b", "bg-nav-footer");

    // Check desktop buttons
    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const getStartedButton = screen.getByRole("link", { name: /get started/i });

    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(getStartedButton).toHaveAttribute("href", "/signup");
  });

  it("should handle mobile menu toggle", () => {
    render(<NavBar />);

    // Initially menu should be closed
    expect(screen.queryByRole("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

    // Open menu
    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(menuButton);

    // Check if menu is open
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    const mobileNav = within(screen.getByTestId("mobile-menu")).getAllByRole(
      "link",
    );
    expect(mobileNav).toHaveLength(2); // Sign In and Get Started links

    // Close menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("should not render navigation on email-confirmed page", () => {
    mockPathname.mockReturnValue("/email-confirmed");
    render(<NavBar />);

    // Should only show logo and brand name
    expect(screen.getByText("FinanceTracker")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /toggle menu/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /sign in/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /get started/i }),
    ).not.toBeInTheDocument();
  });

  it("should handle mobile menu visibility correctly", () => {
    render(<NavBar />);

    // Initially mobile menu should be hidden
    expect(
      screen.queryByText("Sign In")?.closest(".border-t"),
    ).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));

    // Mobile menu should be visible
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveClass("dark:border-background", "md:hidden");
  });

  // Test responsive behavior
  it("should show/hide elements based on viewport", () => {
    render(<NavBar />);

    // Desktop menu
    const desktopMenu = screen.getByTestId("desktop-menu");
    expect(desktopMenu).toHaveClass("hidden", "gap-4", "md:flex");

    // Mobile menu button
    const mobileMenuButton = screen.getByRole("button", {
      name: /toggle menu/i,
    });
    expect(mobileMenuButton).toHaveClass("md:hidden");
  });
});
