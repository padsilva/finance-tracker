import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { SideBar } from "./side-bar";

let mockIsMobile = false;
jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: jest.fn(() => mockIsMobile),
}));

jest.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-button">{children}</div>
  ),
  SidebarTrigger: ({ closeIcon }: { closeIcon?: boolean }) => (
    <button data-testid="sidebar-trigger" data-close-icon={closeIcon}>
      Close Sidebar
    </button>
  ),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
}));

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
  { title: "Transactions", url: "/transactions", icon: "ArrowRightLeft" },
  { title: "Analytics", url: "/analytics", icon: "PieChart" },
  { title: "Settings", url: "/settings", icon: "Settings" },
];

describe("SideBar Component", () => {
  it("should render the sidebar with brand and all menu items", () => {
    render(
      <SidebarProvider defaultOpen>
        <SideBar />
      </SidebarProvider>,
    );

    expect(screen.getByText("FinanceTracker")).toBeInTheDocument();

    menuItems.forEach((item) => {
      const menuItem = screen.getByRole("link", { name: item.title });

      expect(menuItem).toBeInTheDocument();
      expect(menuItem).toHaveAttribute("href", item.url);
    });
  });

  it("should render SidebarTrigger with closeIcon when on mobile", () => {
    mockIsMobile = true;

    render(
      <SidebarProvider defaultOpen>
        <SideBar />
      </SidebarProvider>,
    );

    const trigger = screen.getByTestId("sidebar-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-close-icon", "true");
  });

  it("should not render SidebarTrigger when not on mobile", () => {
    mockIsMobile = false;

    render(
      <SidebarProvider defaultOpen>
        <SideBar />
      </SidebarProvider>,
    );

    expect(screen.queryByTestId("sidebar-trigger")).not.toBeInTheDocument();
  });
});
