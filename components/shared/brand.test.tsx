import { render, screen } from "@testing-library/react";

import { Brand } from "./brand";

describe("Brand Component", () => {
  it("should render with logo by default", () => {
    render(<Brand />);

    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
    expect(screen.getByText("FinanceTracker")).toBeInTheDocument();
  });

  it("should render without logo when withLogo is false", () => {
    render(<Brand withLogo={false} />);

    expect(screen.queryByTestId("brand-logo")).not.toBeInTheDocument();
    expect(screen.getByText("FinanceTracker")).toBeInTheDocument();
  });
});
