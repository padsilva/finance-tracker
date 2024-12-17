import { render, screen, fireEvent } from "@testing-library/react";

import { ErrorBoundary } from "./error";

describe("ErrorBoundary", () => {
  const mockError = new Error("Test error");
  const mockReset = jest.fn();
  const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it("should render error message correctly", () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load form data. Please try again."),
    ).toBeInTheDocument();
  });

  it("should log error to console", () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should call reset function when try again button is clicked", () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalled();
  });
});
