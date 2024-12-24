import { PropsWithChildren } from "react";

import { render, screen } from "@testing-library/react";

import { ProgressBar, StaticProgressBar } from "./progress-bar";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: PropsWithChildren<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
    span: ({ children, className }: PropsWithChildren<HTMLSpanElement>) => (
      <span className={className}>{children}</span>
    ),
  },
}));

describe("ProgressBar", () => {
  const defaultProps = {
    step: 2,
    description: "Test Description",
  };

  it("should render animated progress bar with correct content", () => {
    render(<ProgressBar {...defaultProps} />);

    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    const progressBar = screen.getByTestId("progress-indicator");
    expect(progressBar).toHaveStyle("transform: translateX(-50%);");
  });

  it("should render static progress bar with correct content", () => {
    render(<StaticProgressBar {...defaultProps} />);

    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    const progressBar = screen.getByTestId("progress-indicator");
    expect(progressBar).toHaveStyle("transform: translateX(-50%);");
  });

  it("should calculate progress value correctly", () => {
    const { rerender } = render(<StaticProgressBar {...defaultProps} />);

    const progressBar = screen.getByTestId("progress-indicator");
    expect(progressBar).toHaveStyle("transform: translateX(-50%);");

    rerender(<StaticProgressBar description="Test" step={4} />);
    expect(progressBar).toHaveStyle("transform: translateX(-0%);");
  });
});
