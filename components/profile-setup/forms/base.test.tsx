import { render, screen } from "@testing-library/react";
import { Home } from "lucide-react";

import { BaseForm } from "./base";

describe("BaseForm", () => {
  const defaultProps = {
    step: 1,
    description: "Test Description",
    icon: Home,
    title: "Test Title",
    subtitle: "Test Subtitle",
    isPending: false,
    onSubmit: jest.fn((e) => e.preventDefault()),
    children: <div>Test Children</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with minimum required props", () => {
    render(<BaseForm {...defaultProps} />);

    // Check progress bar
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    // Check header content
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();

    // Check icon
    const icon = screen.getByTestId("base-form-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("h-12", "w-12", "text-primary");

    // Check form content
    expect(screen.getByText("Test Children")).toBeInTheDocument();

    // Check submit button
    const submitButton = screen.getByRole("button", { name: /continue/i });
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
  });

  it("should render back button when backLink is provided", () => {
    render(<BaseForm {...defaultProps} backLink="/previous" />);

    const backButton = screen.getByRole("link", { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/previous");
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });

  it("should show loading state when isPending is true", () => {
    render(<BaseForm {...defaultProps} isPending={true} />);

    const submitButton = screen.getByRole("button", { name: /sending/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });
});
