import { render } from "@testing-library/react";

import { Progress } from "./progress";

// Mock Radix UI Progress primitive
jest.mock("@radix-ui/react-progress", () => ({
  Root: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="progress-root" className={className} {...props}>
      {children}
    </div>
  ),
  Indicator: ({
    className,
    style,
    ...props
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid="progress-indicator"
      className={className}
      style={style}
      {...props}
    />
  ),
}));

describe("Progress Component", () => {
  it("should render with default state (no value)", () => {
    const { container } = render(<Progress />);

    expect(container).toMatchSnapshot();
  });

  it("should render with different progress values", () => {
    const { container } = render(
      <>
        <Progress value={0} />
        <Progress value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Progress className="custom-progress h-4" value={50} />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should handle edge cases", () => {
    const { container } = render(
      <>
        <Progress value={-10} /> {/* Should clamp to 0 */}
        <Progress value={150} /> {/* Should clamp to 100 */}
        <Progress value={undefined} />
        <Progress value={null} />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different sizes", () => {
    const { container } = render(
      <>
        <Progress className="h-1" value={50} />
        <Progress className="h-2" value={50} />
        <Progress className="h-3" value={50} />
        <Progress className="h-4" value={50} />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom colors", () => {
    const { container } = render(
      <>
        <Progress className="bg-red-200 [&>div]:bg-red-500" value={50} />
        <Progress className="bg-green-200 [&>div]:bg-green-500" value={50} />
        <Progress className="bg-blue-200 [&>div]:bg-blue-500" value={50} />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with aria attributes", () => {
    const { container } = render(
      <Progress
        value={75}
        aria-label="Download progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={75}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with data attributes", () => {
    const { container } = render(
      <Progress
        value={50}
        data-testid="custom-progress"
        data-state="loading"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render in different states", () => {
    const { container } = render(
      <>
        <Progress value={0} className="opacity-50" /> {/* Inactive */}
        <Progress value={100} className="opacity-100" /> {/* Complete */}
        <Progress value={50} className="animate-pulse" /> {/* Loading */}
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom animations", () => {
    const { container } = render(
      <>
        <Progress
          value={50}
          className="transition-all duration-500 ease-in-out"
        />
        <Progress
          value={50}
          className="animate-[progress_1s_ease-in-out_infinite]"
        />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with decorative elements", () => {
    const { container } = render(
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>50%</span>
        </div>
        <Progress value={50} />
        <div className="text-xs text-muted-foreground">Processing...</div>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
