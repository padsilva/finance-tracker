import { render } from "@testing-library/react";

import { Checkbox } from "./checkbox";

describe("Checkbox Component", () => {
  it("should render unchecked checkbox correctly", () => {
    const { container } = render(<Checkbox />);

    expect(container).toMatchSnapshot();
  });

  it("should render checked checkbox correctly", () => {
    const { container } = render(<Checkbox checked />);

    expect(container).toMatchSnapshot();
  });

  it("should render disabled states correctly", () => {
    const { container } = render(
      <>
        <Checkbox disabled />
        <Checkbox disabled checked />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Checkbox className="custom-checkbox-class" />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with form attributes", () => {
    const { container } = render(
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" name="terms" required />
          <label htmlFor="terms">Accept terms and conditions</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" name="marketing" />
          <label htmlFor="marketing">Receive marketing emails</label>
        </div>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with ARIA attributes", () => {
    const { container } = render(
      <Checkbox
        aria-label="Accept terms"
        aria-required="true"
        aria-describedby="terms-description"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render indeterminate state", () => {
    const { container } = render(<Checkbox checked="indeterminate" />);

    expect(container).toMatchSnapshot();
  });

  it("should render with different sizes via className", () => {
    const { container } = render(
      <>
        <Checkbox className="h-3 w-3" />
        <Checkbox /> {/* Default size */}
        <Checkbox className="h-5 w-5" />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render in a form group context", () => {
    const { container } = render(
      <div className="space-y-4">
        <div role="group" aria-labelledby="group-label">
          <div id="group-label" className="font-medium">
            Select options
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="option1" />
              <label htmlFor="option1">Option 1</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="option2" />
              <label htmlFor="option2">Option 2</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="option3" />
              <label htmlFor="option3">Option 3</label>
            </div>
          </div>
        </div>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with data attributes", () => {
    const { container } = render(
      <Checkbox
        data-testid="test-checkbox"
        data-state="checked"
        data-disabled=""
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
