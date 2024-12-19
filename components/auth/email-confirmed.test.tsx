import { render, screen, fireEvent, act } from "@testing-library/react";

import { EmailConfirmed } from "./email-confirmed";

describe("EmailConfirmed", () => {
  const originalClose = window.close;

  beforeEach(() => {
    window.close = jest.fn();
  });

  afterEach(() => {
    window.close = originalClose;
  });

  it("should render initial state correctly", () => {
    render(<EmailConfirmed />);

    // Check card structure
    expect(screen.getByTestId("card-title")).toHaveTextContent(
      "Email Confirmed!",
    );

    // Check icon
    expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();

    // Check messages
    expect(
      screen.getByText(/your email has been successfully verified/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this tab will automatically close in 5 seconds/i),
    ).toBeInTheDocument();

    // Check button
    const closeButton = screen.getByRole("button", { name: /close tab/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("w-full");

    // Check manual close message
    expect(
      screen.getByText(/if the tab doesn't close automatically/i),
    ).toBeInTheDocument();
  });

  it("should update countdown every second", () => {
    render(<EmailConfirmed />);

    // Initial state
    expect(screen.getByText(/5 seconds/i)).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/4 seconds/i)).toBeInTheDocument();

    // Advance timer by 2 more seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/2 seconds/i)).toBeInTheDocument();
  });

  it("should attempt to close window when countdown reaches 0", () => {
    render(<EmailConfirmed />);

    // Advance timer to completion
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(window.close).toHaveBeenCalled();
  });

  it("should attempt to close window when button is clicked", () => {
    render(<EmailConfirmed />);

    const closeButton = screen.getByRole("button", { name: /close tab/i });
    fireEvent.click(closeButton);

    expect(window.close).toHaveBeenCalled();
  });

  it("should clear interval on unmount", () => {
    const { unmount } = render(<EmailConfirmed />);

    const clearInterval = jest.spyOn(global, "clearInterval");

    unmount();

    expect(clearInterval).toHaveBeenCalled();
    clearInterval.mockRestore();
  });

  it("should show correct styling for card components", () => {
    render(<EmailConfirmed />);

    // Check main card
    const card = screen.getByTestId("card-main");
    expect(card).toHaveClass("mx-auto", "max-w-md");

    // Check icon container
    const iconContainer = screen.getByTestId("icon-container");
    expect(iconContainer).toHaveClass("rounded-full", "bg-blue-100", "p-5");

    // Check text styling
    const mainText = screen.getByText(
      /your email has been successfully verified/i,
    );
    expect(mainText).toHaveClass("mb-6", "text-sm", "text-muted-foreground");

    const countdownText = screen.getByText(
      /this tab will automatically close/i,
    );
    expect(countdownText).toHaveClass("text-sm", "text-secondary-foreground");
  });

  it("should maintain 0 countdown if window.close fails", () => {
    // Mock window.close to do nothing (simulating browser restriction)
    window.close = jest.fn().mockImplementation(() => {});

    render(<EmailConfirmed />);

    // Advance past 5 seconds
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    // Should show 0 seconds
    expect(screen.getByText(/0 seconds/i)).toBeInTheDocument();
  });

  it("should have proper card layout structure", () => {
    render(<EmailConfirmed />);

    // Check CardHeader
    const header = screen.getByTestId("card-header");
    expect(header).toBeInTheDocument();

    // Check CardContent
    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();

    // Check CardFooter
    const footer = screen.getByTestId("card-footer");
    expect(footer).toHaveClass("flex", "flex-col", "gap-3");
  });
});
