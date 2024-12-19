import { render, screen, fireEvent } from "@testing-library/react";

import { UserMenu } from "./user-menu";

const mockLogout = jest.fn(() => Promise.resolve());
jest.mock("@/app/actions", () => ({
  logout: () => mockLogout(),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onSelect,
  }: {
    children: React.ReactNode;
    onSelect?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }) => (
    <div
      data-testid="dropdown-item"
      onClick={(e) => onSelect?.(e)}
      role="menuitem"
    >
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-trigger">{children}</div>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-header">{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-footer">{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-title">{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-description">{children}</div>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="cancel-button">{children}</button>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="confirm-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("UserMenu", () => {
  const defaultProps = {
    email: "test@example.com",
    name: "Test User",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render user name in trigger button", () => {
    render(<UserMenu {...defaultProps} />);
    expect(screen.getByTestId("user-menu-button")).toHaveTextContent(
      defaultProps.name,
    );
  });

  it("should show dropdown content when clicked", async () => {
    render(<UserMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("user-menu-button"));

    expect(screen.getByText(defaultProps.email)).toBeInTheDocument();
    expect(screen.getAllByText("Log out")[0]).toBeInTheDocument();
  });

  it("should show confirmation dialog with correct content", () => {
    render(<UserMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(screen.getByTestId("alert-title")).toHaveTextContent(
      "Are you sure you want to logout?",
    );
    expect(screen.getByTestId("alert-description")).toHaveTextContent(
      "You will need to sign in again to access your account.",
    );
    expect(screen.getByTestId("cancel-button")).toHaveTextContent("Cancel");
    expect(screen.getByTestId("confirm-button")).toHaveTextContent("Log out");
  });

  it("should call logout function when confirmed in dialog", async () => {
    render(<UserMenu {...defaultProps} />);

    const triggerButton = screen.getByTestId("user-menu-button");
    fireEvent.click(triggerButton);

    const logoutItem = screen.getAllByText("Log out")[0];
    fireEvent.click(logoutItem);

    const confirmButton = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("should not call logout when cancelled", () => {
    render(<UserMenu {...defaultProps} />);

    const cancelButton = screen.getByTestId("cancel-button");
    fireEvent.click(cancelButton);

    expect(mockLogout).not.toHaveBeenCalled();
  });
});
