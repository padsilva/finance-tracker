import { render, screen, within } from "@testing-library/react";

import { Footer } from "./footer";

describe("Footer", () => {
  const getYear = () => new Date().getFullYear();

  it("should render with correct content and styling", () => {
    render(<Footer />);

    // Get the footer element
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("mt-auto", "border-t", "bg-nav-footer");

    // Check the content wrapper
    const contentWrapper = within(footer).getByText(/FinanceTracker/i);
    expect(contentWrapper).toHaveClass(
      "py-6",
      "text-center",
      "text-sm",
      "text-muted-foreground",
    );

    // Check the copyright text includes current year
    const currentYear = getYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} FinanceTracker`)),
    ).toBeInTheDocument();
  });

  it("should always display the current year", () => {
    // Create multiple renders to verify the year is always current
    const { unmount } = render(<Footer />);
    const initialYear = getYear();

    // First check
    expect(
      screen.getByText(new RegExp(`© ${initialYear} FinanceTracker`)),
    ).toBeInTheDocument();

    // Cleanup first render
    unmount();

    // Mock a new date before second render
    const mockDate = new Date("2025-01-01T00:00:00.000Z");
    jest.setSystemTime(mockDate);

    // Render again
    render(<Footer />);

    // Check if new year is displayed
    expect(
      screen.getByText(
        new RegExp(`© ${mockDate.getFullYear()} FinanceTracker`),
      ),
    ).toBeInTheDocument();
  });
});
