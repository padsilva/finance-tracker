import { render } from "@testing-library/react";
import Link from "next/link";

import { Button } from "./button";

describe("Button Component", () => {
  it("should render all button variants correctly", () => {
    const { container } = render(
      <>
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="link">Link Button</Button>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render all button sizes correctly", () => {
    const { container } = render(
      <>
        <Button size="default">Default Size</Button>
        <Button size="sm">Small Size</Button>
        <Button size="lg">Large Size</Button>
        <Button size="icon">Icon Size</Button>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom className", () => {
    const { container } = render(
      <Button className="custom-class">Custom Button</Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render as child component", () => {
    const { container } = render(
      <Button asChild>
        <Link href="/test">Link Button</Link>
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with icon", () => {
    const { container } = render(
      <>
        <Button>
          <svg
            data-testid="test-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M8 0L16 16H0z" />
          </svg>
          Button with Icon
        </Button>
        <Button size="icon">
          <svg
            data-testid="test-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M8 0L16 16H0z" />
          </svg>
        </Button>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render in disabled state", () => {
    const { container } = render(
      <>
        <Button disabled>Disabled Button</Button>
        <Button disabled variant="destructive">
          Disabled Destructive
        </Button>
        <Button disabled variant="outline">
          Disabled Outline
        </Button>
      </>,
    );

    expect(container).toMatchSnapshot();
  });
});
