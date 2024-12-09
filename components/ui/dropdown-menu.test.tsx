import * as React from "react";

import { render } from "@testing-library/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";

describe("Dropdown Menu", () => {
  it("should render basic dropdown", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render dropdown with all item types", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Regular Item</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={true}>
            Checkbox Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="1">
            <DropdownMenuRadioItem value="1">Radio 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2">Radio 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            With Shortcut
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render nested dropdown with sub menu", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
              <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with groups", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Group 1</DropdownMenuLabel>
            <DropdownMenuItem>Group 1 Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group 1 Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Group 2</DropdownMenuLabel>
            <DropdownMenuItem>Group 2 Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group 2 Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with inset items", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          <DropdownMenuSubTrigger inset>Inset Sub Menu</DropdownMenuSubTrigger>
          <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with custom classes", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">
            Custom Item
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem className="custom-checkbox" checked>
            Custom Checkbox
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioItem className="custom-radio" value="1">
            Custom Radio
          </DropdownMenuRadioItem>
          <DropdownMenuLabel className="custom-label">
            Custom Label
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="custom-separator" />
          <DropdownMenuShortcut className="custom-shortcut">
            ⌘C
          </DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render disabled states", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          <DropdownMenuCheckboxItem disabled checked>
            Disabled Checkbox
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioItem disabled value="1">
            Disabled Radio
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with portal", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem>Portal Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    expect(container).toMatchSnapshot();
  });

  it("should render DropdownMenuShortcut with default and custom classes", () => {
    const { container } = render(
      <div>
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        <DropdownMenuShortcut className="custom-shortcut">
          ⌘S
        </DropdownMenuShortcut>
        <DropdownMenuShortcut aria-label="Save" data-testid="shortcut">
          ⌘S
        </DropdownMenuShortcut>
        <DropdownMenuShortcut>
          <span>⌘</span>
          <span>S</span>
        </DropdownMenuShortcut>
      </div>,
    );

    expect(container).toMatchSnapshot();
  });
});
