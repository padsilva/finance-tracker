import { render } from "@testing-library/react";

import { Label } from "./label";

describe("Label Component", () => {
  it("should render default label correctly", () => {
    const { container } = render(<Label>Default Label</Label>);

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Label className="custom-class">Custom Label</Label>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with htmlFor attribute", () => {
    const { container } = render(
      <div>
        <Label htmlFor="test-input">Input Label</Label>
        <input id="test-input" type="text" />
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with disabled state", () => {
    const { container } = render(
      <div>
        <Label>
          <input type="checkbox" disabled />
          <span>Disabled checkbox label</span>
        </Label>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with required state", () => {
    const { container } = render(
      <div>
        <Label>
          Required field
          <span className="ml-1 text-red-500">*</span>
        </Label>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with different variants", () => {
    const { container } = render(
      <>
        <Label className="text-sm">Small Label</Label>
        <Label className="text-base">Medium Label</Label>
        <Label className="text-lg">Large Label</Label>
        <Label className="font-bold">Bold Label</Label>
        <Label className="italic">Italic Label</Label>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with ARIA attributes", () => {
    const { container } = render(
      <Label htmlFor="test-input" aria-label="Test label" aria-required="true">
        ARIA Label
      </Label>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with data attributes", () => {
    const { container } = render(
      <Label data-testid="test-label" data-cy="cypress-label">
        Test Label
      </Label>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with nested content", () => {
    const { container } = render(
      <Label>
        <span className="font-bold">Profile</span>
        <span className="ml-2 text-gray-500">(Optional)</span>
      </Label>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render in form context", () => {
    const { container } = render(
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <input
          id="username"
          type="text"
          className="peer"
          placeholder="Enter username"
        />
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          type="email"
          className="peer"
          placeholder="Enter email"
        />
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
