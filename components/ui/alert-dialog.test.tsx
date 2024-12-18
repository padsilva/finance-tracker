import * as React from "react";

import { render } from "@testing-library/react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

describe("Alert Dialog", () => {
  it("should render complete alert dialog", () => {
    const { container } = render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom classes", () => {
    const { container } = render(
      <AlertDialog>
        <AlertDialogTrigger className="custom-trigger">
          Open Dialog
        </AlertDialogTrigger>
        <AlertDialogContent className="custom-content">
          <AlertDialogHeader className="custom-header">
            <AlertDialogTitle className="custom-title">
              Custom Title
            </AlertDialogTitle>
            <AlertDialogDescription className="custom-description">
              Custom description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="custom-footer">
            <AlertDialogCancel className="custom-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="custom-action">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom HTML attributes", () => {
    const { container } = render(
      <AlertDialog>
        <AlertDialogTrigger aria-label="Open dialog">
          Open Dialog
        </AlertDialogTrigger>
        <AlertDialogContent role="alertdialog" aria-labelledby="title">
          <AlertDialogHeader>
            <AlertDialogTitle id="title">Accessible Title</AlertDialogTitle>
            <AlertDialogDescription id="desc">
              Accessible description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel aria-label="Cancel action">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction aria-label="Confirm action">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(container).toMatchSnapshot();
  });
});
