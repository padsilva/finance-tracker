import { render, screen } from "@testing-library/react";
import { ThemeProviderProps } from "next-themes";

import { ThemeProvider } from "./theme-provider";

jest.mock("next-themes", () => ({
  ThemeProvider: jest.fn(({ children, ...props }) => (
    <div data-testid="next-themes-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
}));

describe("ThemeProvider", () => {
  const defaultProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: true,
  };

  it("should render children and pass props correctly", () => {
    render(
      <ThemeProvider {...defaultProps}>
        <div>Test Content</div>
      </ThemeProvider>,
    );

    const provider = screen.getByTestId("next-themes-provider");
    expect(provider).toBeInTheDocument();

    const content = screen.getByText("Test Content");
    expect(content).toBeInTheDocument();

    const passedProps = JSON.parse(provider.getAttribute("data-props") ?? "{}");
    expect(passedProps).toStrictEqual(defaultProps);
  });
});
