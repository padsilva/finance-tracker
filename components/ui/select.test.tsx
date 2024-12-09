import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { render } from "@testing-library/react";

import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select";

jest.mock("@radix-ui/react-select", () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-root">{children}</div>
  ),
  Group: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  Value: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-value">{children}</span>
  ),
  Trigger: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <button data-testid="select-trigger" className={className} {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-portal">{children}</div>
  ),
  Content: ({
    className,
    children,
    position,
    ...props
  }: {
    className?: string;
    children: React.ReactNode;
    position?: string;
  }) => (
    <div
      data-testid="select-content"
      className={className}
      data-position={position}
      {...props}
    >
      {children}
    </div>
  ),
  Viewport: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="select-viewport" className={className}>
      {children}
    </div>
  ),
  Label: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <span data-testid="select-label" className={className}>
      {children}
    </span>
  ),
  Item: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="select-item" className={className}>
      {children}
    </div>
  ),
  ItemText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-item-text">{children}</span>
  ),
  ItemIndicator: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-item-indicator">{children}</span>
  ),
  Separator: ({ className }: { className?: string }) => (
    <div data-testid="select-separator" className={className} />
  ),
  ScrollUpButton: ({ className }: { className?: string }) => (
    <button data-testid="select-scroll-up" className={className}>
      <ChevronUpIcon />
    </button>
  ),
  ScrollDownButton: ({ className }: { className?: string }) => (
    <button data-testid="select-scroll-down" className={className}>
      <ChevronDownIcon />
    </button>
  ),
  Icon: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-icon">{children}</span>
  ),
}));

describe("Select Components", () => {
  it("should render basic select correctly", () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render grouped select options", () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group 1</SelectLabel>
            <SelectItem value="1.1">Option 1.1</SelectItem>
            <SelectItem value="1.2">Option 1.2</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Group 2</SelectLabel>
            <SelectItem value="2.1">Option 2.1</SelectItem>
            <SelectItem value="2.2">Option 2.2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue className="custom-value">Select</SelectValue>
        </SelectTrigger>
        <SelectContent className="custom-content">
          <SelectItem className="custom-item" value="test">
            Test Option
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render in disabled state", () => {
    const { container } = render(
      <Select>
        <SelectTrigger disabled>
          <SelectValue>Disabled Select</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test" disabled>
            Disabled Option
          </SelectItem>
          <SelectItem value="enabled">Enabled Option</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with scroll buttons", () => {
    const { container } = render(
      <SelectContent>
        <SelectScrollUpButton />
        <SelectGroup>
          {Array.from({ length: 20 }).map((_, i) => (
            <SelectItem key={i} value={`option${i}`}>
              Option {i + 1}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectScrollDownButton />
      </SelectContent>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different positions", () => {
    const { container } = render(
      <>
        <SelectContent position="popper">Popper Content</SelectContent>
        <SelectContent position="item-aligned">Item Content</SelectContent>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different states", () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue>Select Option</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Option</SelectItem>
          <SelectItem value="focused" data-state="focused">
            Focused Option
          </SelectItem>
          <SelectItem value="selected" data-state="selected">
            Selected Option
          </SelectItem>
          <SelectItem value="disabled" disabled>
            Disabled Option
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with placeholder and selected value", () => {
    const { container } = render(
      <Select defaultValue="selected">
        <SelectTrigger>
          <SelectValue placeholder="Select an option">
            Selected Option
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="selected">Selected Option</SelectItem>
          <SelectItem value="other">Other Option</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(container).toMatchSnapshot();
  });
});
