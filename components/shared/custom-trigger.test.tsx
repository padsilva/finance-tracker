import { render, screen } from "@testing-library/react";

import { CustomTrigger } from "./custom-trigger";

jest.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => (
    <button data-testid="sidebar-trigger">Toggle Sidebar</button>
  ),
}));

let mockUseIsMobile = false;
jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: jest.fn(() => mockUseIsMobile),
}));

describe("CustomTrigger", () => {
  it("should render button when on mobile", () => {
    mockUseIsMobile = true;

    render(<CustomTrigger />);

    const button = screen.getByRole("button", { name: /toggle sidebar/i });
    expect(button).toBeInTheDocument();
  });

  it("should not render anything when not on mobile", () => {
    mockUseIsMobile = false;

    const { container } = render(<CustomTrigger />);

    expect(container).toBeEmptyDOMElement();
  });
});
