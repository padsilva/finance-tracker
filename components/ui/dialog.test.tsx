import { Cross2Icon } from "@radix-ui/react-icons";
import { render } from "@testing-library/react";

import {
  Dialog,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

// Mock portal to avoid ReactDOM.createPortal issues in tests
jest.mock("@radix-ui/react-dialog", () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-root">{children}</div>
  ),
  Trigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="dialog-trigger">{children}</button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-portal">{children}</div>
  ),
  Overlay: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-overlay" className={className}>
      {children}
    </div>
  ),
  Content: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  Close: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="dialog-close" className={className}>
      {children}
    </button>
  ),
  Title: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h2 data-testid="dialog-title" className={className}>
      {children}
    </h2>
  ),
  Description: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <p data-testid="dialog-description" className={className}>
      {children}
    </p>
  ),
}));

describe("Dialog Components", () => {
  it("should render basic dialog correctly", () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose>Close Dialog</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render dialog with custom styling", () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger className="custom-trigger">Open</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Custom Title</DialogTitle>
            <DialogDescription className="custom-description">
              Custom Description
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer">
            <DialogClose className="custom-close">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render dialog with complex content", () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open Settings</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Name</label>
              <input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username">Username</label>
              <input id="username" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <button type="submit">Save changes</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render dialog overlay with animations", () => {
    const { container } = render(
      <DialogOverlay className="custom-overlay" data-state="open" />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render dialog with different states", () => {
    const { container } = render(
      <Dialog>
        <DialogContent data-state="open">
          <DialogTitle>Open State</DialogTitle>
        </DialogContent>
        <DialogContent data-state="closed">
          <DialogTitle>Closed State</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render header with different alignments", () => {
    const { container } = render(
      <>
        <DialogHeader>
          <DialogTitle>Default Centered Header</DialogTitle>
        </DialogHeader>
        <DialogHeader className="sm:text-left">
          <DialogTitle>Left Aligned Header</DialogTitle>
        </DialogHeader>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render footer with different layouts", () => {
    const { container } = render(
      <>
        <DialogFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
        <DialogFooter className="flex-row justify-between">
          <button>Back</button>
          <div className="flex gap-2">
            <button>Cancel</button>
            <button>Next</button>
          </div>
        </DialogFooter>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with close button and icon", () => {
    const { container } = render(
      <DialogContent>
        <DialogTitle>Dialog with Close</DialogTitle>
        <DialogDescription>Content here</DialogDescription>
        <DialogClose>
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render responsive dialog content", () => {
    const { container } = render(
      <DialogContent className="max-w-[90%] md:max-w-[80%] lg:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Responsive Dialog</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>Left content</div>
          <div>Right content</div>
        </div>
      </DialogContent>,
    );

    expect(container).toMatchSnapshot();
  });
});
