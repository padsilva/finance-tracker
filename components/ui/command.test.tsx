import { render } from "@testing-library/react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";

jest.mock("cmdk", () => {
  const Root: React.FC<{ children?: React.ReactNode; className?: string }> = ({
    children,
    className,
  }) => (
    <div data-testid="command-root" className={className}>
      {children}
    </div>
  );
  Root.displayName = "Command";

  const Input: React.FC<
    { className?: string } & React.InputHTMLAttributes<HTMLInputElement>
  > = ({ className, ...props }) => (
    <input data-testid="command-input" className={className} {...props} />
  );
  Input.displayName = "CommandInput";

  const List: React.FC<{ children?: React.ReactNode; className?: string }> = ({
    children,
    className,
  }) => (
    <div data-testid="command-list" className={className}>
      {children}
    </div>
  );
  List.displayName = "CommandList";

  // Return the mock with the same structure as the actual module
  return {
    Command: {
      Root,
      Input: {
        Input,
        displayName: "CommandInput",
      },
      List,
      Empty: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Group: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Item: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Separator: () => <hr />,
      displayName: "Command",
    },
  };
});

describe("Command Components", () => {
  it("should render CommandDialog correctly", () => {
    const { container } = render(
      <CommandDialog>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </CommandDialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render CommandGroup with custom styling", () => {
    const { container } = render(
      <CommandGroup className="custom-group" heading="Custom Group">
        <CommandItem>Item 1</CommandItem>
        <CommandItem>Item 2</CommandItem>
      </CommandGroup>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render CommandItem in different states", () => {
    const { container } = render(
      <>
        <CommandItem>Default Item</CommandItem>
        <CommandItem data-selected={true}>Selected Item</CommandItem>
        <CommandItem data-disabled={true}>Disabled Item</CommandItem>
        <CommandItem className="custom-item">Custom Item</CommandItem>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render CommandShortcut with custom className", () => {
    const { container } = render(
      <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render CommandSeparator with custom styling", () => {
    const { container } = render(
      <CommandSeparator className="custom-separator" />,
    );

    expect(container).toMatchSnapshot();
  });
});
