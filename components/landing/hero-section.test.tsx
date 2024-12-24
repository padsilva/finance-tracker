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
    const emphasis = screen.getByTestId("hero-emphasis");
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
    });
  });
});
