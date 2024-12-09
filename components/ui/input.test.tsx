import { render } from "@testing-library/react";

import { Input } from "./input";

describe("Input Component", () => {
  it("should render default input correctly", () => {
    const { container } = render(<Input />);

    expect(container).toMatchSnapshot();
  });

  it("should render different input types correctly", () => {
    const { container } = render(
      <>
        <Input type="text" placeholder="Text input" />
        <Input type="password" placeholder="Password input" />
        <Input type="email" placeholder="Email input" />
        <Input type="number" placeholder="Number input" />
        <Input type="tel" placeholder="Telephone input" />
        <Input type="search" placeholder="Search input" />
        <Input type="url" placeholder="URL input" />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Input className="custom-class" placeholder="Custom styled input" />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different states", () => {
    const { container } = render(
      <>
        <Input disabled placeholder="Disabled input" />
        <Input readOnly placeholder="Readonly input" />
        <Input required placeholder="Required input" />
        <Input aria-invalid placeholder="Invalid input" />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different sizes via className", () => {
    const { container } = render(
      <>
        <Input className="h-8 text-sm" placeholder="Small input" />
        <Input className="h-10" placeholder="Default input" />
        <Input className="h-12 text-lg" placeholder="Large input" />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with prefix and suffix", () => {
    const { container } = render(
      <>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input className="pl-7" placeholder="Amount" type="number" />
        </div>
        <div className="relative">
          <Input className="pr-12" placeholder="Weight" type="number" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">kg</span>
        </div>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with form attributes", () => {
    const { container } = render(
      <>
        <Input
          name="username"
          form="test-form"
          autoComplete="username"
          placeholder="Username"
        />
        <Input
          name="password"
          form="test-form"
          autoComplete="current-password"
          type="password"
          placeholder="Password"
        />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with ARIA attributes", () => {
    const { container } = render(
      <>
        <Input
          aria-label="Search"
          aria-describedby="search-desc"
          placeholder="Search..."
        />
        <Input
          aria-required="true"
          aria-invalid="true"
          aria-errormessage="error-msg"
          placeholder="Required field"
        />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with data attributes", () => {
    const { container } = render(
      <Input
        data-testid="test-input"
        data-cy="cypress-input"
        placeholder="Test input"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
