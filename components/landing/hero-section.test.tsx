import { render, screen } from "@testing-library/react";

import { featureList, HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("should render main heading with correct styling", () => {
    render(<HeroSection />);

    // Check main heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass(
      "mb-4",
      "text-4xl",
      "font-bold",
      "text-foreground",
    );

    // Check heading content
    expect(heading).toHaveTextContent("Smart Financial Management,");
    const emphasis = heading.querySelector("span");
    expect(emphasis).toHaveClass("text-primary");
    expect(emphasis).toHaveTextContent("Made Simple");
  });

  it("should render main description text", () => {
    render(<HeroSection />);

    const description = screen.getByText(
      "Track expenses, manage budgets, and achieve your financial goals with our intuitive platform.",
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("mb-8", "text-lg", "text-muted-foreground");
  });

  it("should render all feature items with correct content and structure", () => {
    render(<HeroSection />);

    // Check features grid container
    const gridContainer = screen.getByTestId("grid-container");
    expect(gridContainer).toHaveClass("grid", "grid-cols-2", "gap-6");

    // Check each feature
    featureList.forEach(({ icon, title, description }) => {
      // Check feature title
      const featureTitle = screen.getByRole("heading", {
        name: title,
        level: 3,
      });
      expect(featureTitle).toHaveClass("font-medium");

      // Check feature description
      const featureDescription = screen.getByText(description);
      expect(featureDescription).toHaveClass(
        "text-sm",
        "text-muted-foreground",
      );

      // Check feature icon
      const featureIcon = screen.getByTestId(`icon-${icon.displayName}`);
      expect(featureIcon).toBeInTheDocument();

      // Check feature container structure
      const featureContainer = featureTitle.closest('div[class*="flex"]');
      expect(featureContainer).toHaveClass("flex", "items-start", "gap-3");
    });
  });

  it("should apply correct styling to icons", () => {
    render(<HeroSection />);

    const iconContainers = screen.getAllByTestId(/icon-/);
    iconContainers.forEach((icon) => {
      const parentDiv = icon.parentElement;
      expect(parentDiv).toHaveClass("mt-1");
    });
  });

  it("should maintain correct grid layout", () => {
    render(<HeroSection />);

    // Check if there are exactly 4 feature items
    const featureItems = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.closest('div[class*="flex"]'));
    expect(featureItems).toHaveLength(4);

    // Check if they're in a grid container
    const gridContainer = featureItems[0]?.parentElement;
    expect(gridContainer).toHaveClass("grid", "grid-cols-2", "gap-6");
  });
});
