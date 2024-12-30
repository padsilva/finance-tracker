import { render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { SideBar } from "./side-bar";

jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: jest.fn().mockReturnValue(false),
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
});
