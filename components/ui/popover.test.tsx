import { render } from "@testing-library/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./popover";

// Mock portal to avoid ReactDOM.createPortal issues in tests
jest.mock("@radix-ui/react-popover", () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-root">{children}</div>
  ),
  Trigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="popover-trigger">{children}</button>
  ),
  Anchor: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-anchor">{children}</div>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-portal">{children}</div>
  ),
  Content: ({
    children,
    className,
    align,
    sideOffset,
  }: {
    children: React.ReactNode;
    className?: string;
    align?: string;
    sideOffset?: number;
  }) => (
    <div
      data-testid="popover-content"
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
    >
      {children}
    </div>
  ),
}));

describe("Popover Components", () => {
  it("should render basic popover correctly", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div>Basic Popover Content</div>
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom alignment", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Align Test</PopoverTrigger>
        <PopoverContent align="start">Start Aligned Content</PopoverContent>
        <PopoverContent align="center">Center Aligned Content</PopoverContent>
        <PopoverContent align="end">End Aligned Content</PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom offset", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Offset Test</PopoverTrigger>
        <PopoverContent sideOffset={8}>
          Content with Custom Offset
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger className="custom-trigger">
          Styled Trigger
        </PopoverTrigger>
        <PopoverContent className="custom-content">
          Custom Styled Content
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with anchor", () => {
    const { container } = render(
      <Popover>
        <PopoverAnchor>
          <div>Anchor Element</div>
        </PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Anchored Content</PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different animation states", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Animation Test</PopoverTrigger>
        <PopoverContent data-state="open">Open State Content</PopoverContent>
        <PopoverContent data-state="closed">
          Closed State Content
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different side positions", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Side Test</PopoverTrigger>
        <PopoverContent data-side="top">Top Content</PopoverContent>
        <PopoverContent data-side="right">Right Content</PopoverContent>
        <PopoverContent data-side="bottom">Bottom Content</PopoverContent>
        <PopoverContent data-side="left">Left Content</PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with complex content", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Complex Popover</PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="width">Width</label>
                <input
                  id="width"
                  className="col-span-2 h-8"
                  type="number"
                  defaultValue="100%"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="height">Height</label>
                <input
                  id="height"
                  className="col-span-2 h-8"
                  type="number"
                  defaultValue="25px"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with nested content", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Nested</PopoverTrigger>
        <PopoverContent>
          <Popover>
            <PopoverTrigger>Nested Trigger</PopoverTrigger>
            <PopoverContent>Nested Content</PopoverContent>
          </Popover>
        </PopoverContent>
      </Popover>,
    );

    expect(container).toMatchSnapshot();
  });
});
