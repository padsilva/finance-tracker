import { PropsWithChildren } from "react";

import { render, screen } from "@testing-library/react";

import { LoadingSkeleton } from "./loading";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: PropsWithChildren<HTMLDivElement>) => (
      <div data-testid="motion-div" className={className}>
        {children}
      </div>
    ),
  },
}));

jest.mock("@/components/profile-setup/progress-bar", () => ({
  ProgressBar: ({
    step,
    description,
  }: {
    step: number;
    description: string;
  }) => (
    <div data-testid="progress-bar">
      <span>{`Step ${step} of 4`}</span>
      <span>{description}</span>
    </div>
  ),
}));

describe("LoadingSkeleton", () => {
  const defaultProps = {
    description: "Test Description",
    step: 1,
  };

  let mockId = 0;

  beforeEach(() => {
    mockId = 0;
    Object.defineProperty(window, "crypto", {
      value: { randomUUID: () => `mock-id-${mockId++}` },
    });
  });

  it("should render skeleton container with correct animation props", () => {
    render(<LoadingSkeleton {...defaultProps} />);

    const container = screen.getByTestId("motion-div");
    expect(container).toHaveClass("mx-auto sm:w-[500px]");
  });

  it("should render progress bar with correct step information", () => {
    render(<LoadingSkeleton {...defaultProps} />);

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveTextContent("Step 1 of 4");
    expect(progressBar).toHaveTextContent("Test Description");
  });

  it("should render input fields based on fieldsNumber prop", () => {
    render(<LoadingSkeleton {...defaultProps} fieldsNumber={2} />);

    // Test label skeletons
    const labelSkeletons = screen
      .getAllByRole("generic")
      .filter((element) => element.className.includes("h-4 w-20"));
    expect(labelSkeletons).toHaveLength(2);

    // Test input skeletons
    const inputSkeletons = screen
      .getAllByRole("generic")
      .filter((element) => element.className.includes("h-9 w-full"));
    expect(inputSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it("should render checkbox fields based on checkboxesNumber prop", () => {
    render(<LoadingSkeleton {...defaultProps} checkboxesNumber={3} />);

    const checkboxContainers = screen
      .getAllByRole("generic")
      .filter((element) =>
        element.className.includes(
          "flex w-full flex-row items-start space-x-3",
        ),
      );
    expect(checkboxContainers).toHaveLength(3);
  });

  it("should render back link when specified", () => {
    const { rerender } = render(<LoadingSkeleton {...defaultProps} />);

    // Without back link
    expect(
      screen
        .getAllByRole("generic")
        .filter((element) => element.className.includes("h-9 w-24")),
    ).toHaveLength(0);

    rerender(<LoadingSkeleton {...defaultProps} backLink />);

    // With back link
    expect(
      screen
        .getAllByRole("generic")
        .filter((element) => element.className.includes("h-9 w-24")),
    ).toHaveLength(1);
  });
});
