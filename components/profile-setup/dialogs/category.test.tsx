import { render, screen, fireEvent } from "@testing-library/react";

import { CategoryDialog } from "./category";

describe("CategoryDialog", () => {
  const mockOnAddCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog trigger button", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    expect(
      screen.getByRole("button", { name: /add custom category/i }),
    ).toBeInTheDocument();
  });

  it("should open dialog when trigger is clicked and render content correctly", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    fireEvent.click(
      screen.getByRole("button", { name: /add custom category/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add Category")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new custom category to track your spending"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter category name"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should handle category name input", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    fireEvent.click(
      screen.getByRole("button", { name: /add custom category/i }),
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "Test Category" } });

    expect(input).toHaveValue("Test Category");
  });

  it("should call onAddCategory with formatted category data when saved", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    fireEvent.click(
      screen.getByRole("button", { name: /add custom category/i }),
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "Test Category" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnAddCategory).toHaveBeenCalledWith({
      code: "test-category",
      name: "Test Category",
    });
  });

  it("should close dialog after successful save", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    fireEvent.click(
      screen.getByRole("button", { name: /add custom category/i }),
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "Test Category" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should does not save when name is empty", () => {
    render(<CategoryDialog onAddCategory={mockOnAddCategory} />);

    fireEvent.click(
      screen.getByRole("button", { name: /add custom category/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnAddCategory).not.toHaveBeenCalled();
    // Dialog should still be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
