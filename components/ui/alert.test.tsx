import { render } from "@testing-library/react";

import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert Components", () => {
  it("should render alert variants correctly", () => {
    const { container } = render(
      <>
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>This is a default alert</AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>This is a destructive alert</AlertDescription>
        </Alert>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render alert with custom className", () => {
    const { container } = render(
      <Alert className="custom-class">
        <AlertTitle className="title-class">Custom Alert</AlertTitle>
        <AlertDescription className="description-class">
          This is a custom styled alert
        </AlertDescription>
      </Alert>,
    );

    expect(container).toMatchSnapshot();
  });
});
