import { render } from "@testing-library/react";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

describe("Card Components", () => {
  it("should render basic card correctly", () => {
    const { container } = render(
      <Card>
        <CardContent>Basic Card Content</CardContent>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render full card with all subcomponents", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content of the card</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom classNames", () => {
    const { container } = render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Custom Title</CardTitle>
          <CardDescription className="custom-description">
            Custom Description
          </CardDescription>
        </CardHeader>
        <CardContent className="custom-content">
          <p>Custom Content</p>
        </CardContent>
        <CardFooter className="custom-footer">
          <p>Custom Footer</p>
        </CardFooter>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render card with nested content", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Nested Content Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Nested Card</CardTitle>
            </CardHeader>
            <CardContent>Nested content</CardContent>
          </Card>
        </CardContent>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with data-testid attributes", () => {
    const { container } = render(
      <Card>
        <CardHeader data-testid="card-header">
          <CardTitle data-testid="card-title">Test Title</CardTitle>
          <CardDescription data-testid="card-description">
            Test Description
          </CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">
          <p>Test content</p>
        </CardContent>
        <CardFooter data-testid="card-footer">
          <p>Test footer</p>
        </CardFooter>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render card with different content types", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Mixed Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Text content</p>
            <button type="button">A button</button>
            <div className="grid grid-cols-2 gap-2">
              <div>Grid item 1</div>
              <div>Grid item 2</div>
            </div>
          </div>
        </CardContent>
      </Card>,
    );

    expect(container).toMatchSnapshot();
  });
});
