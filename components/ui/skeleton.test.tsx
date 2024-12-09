import { render } from "@testing-library/react";

import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
  it("should render basic skeleton correctly", () => {
    const { container } = render(<Skeleton />);

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Skeleton className="custom-skeleton h-8 w-32" />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different sizes", () => {
    const { container } = render(
      <>
        <Skeleton className="h-4 w-16" /> {/* Small */}
        <Skeleton className="h-6 w-24" /> {/* Medium */}
        <Skeleton className="h-8 w-32" /> {/* Large */}
        <Skeleton className="h-12 w-48" /> {/* Extra Large */}
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render common UI element skeletons", () => {
    const { container } = render(
      <div className="space-y-4">
        {/* Avatar skeleton */}
        <Skeleton className="h-12 w-12 rounded-full" />

        {/* Text line skeletons */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Card skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different shapes", () => {
    const { container } = render(
      <>
        <Skeleton className="h-8 w-8 rounded-full" /> {/* Circle */}
        <Skeleton className="h-8 w-32 rounded-md" /> {/* Rounded */}
        <Skeleton className="h-8 w-32 rounded-none" /> {/* Square */}
        <Skeleton className="h-8 w-32 rounded-full" /> {/* Pill */}
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render loading card layout", () => {
    const { container } = render(
      <div className="space-y-4 rounded-lg border p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render loading table layout", () => {
    const { container } = render(
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom animations", () => {
    const { container } = render(
      <>
        <Skeleton className="animate-pulse" /> {/* Default */}
        <Skeleton className="animate-[pulse_2s_ease-in-out_infinite]" />{" "}
        {/* Custom timing */}
        <Skeleton className="animate-none" /> {/* No animation */}
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render responsive skeletons", () => {
    const { container } = render(
      <Skeleton className="h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32" />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render grid layout skeletons", () => {
    const { container } = render(
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
