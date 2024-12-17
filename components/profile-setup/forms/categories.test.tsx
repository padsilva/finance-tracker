import { act } from "react";

import { render, screen, fireEvent } from "@testing-library/react";

import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";
import { Category } from "@/types/database";
import { categoryList } from "@/utils/categories";

import { CategoriesForm, getFormConfig } from "./categories";

jest.mock("@/app/profile-setup/actions", () => ({
  categories: jest.fn(),
}));

const mockHandleSubmit = jest.fn((e) => e.preventDefault());
jest.mock("@/hooks/use-profile-setup-form", () => ({
  useProfileSetupForm: jest.fn(() => ({
    form: { control: {}, handleSubmit: () => mockHandleSubmit },
    state: { error: null },
    isPending: false,
    handleSubmit: mockHandleSubmit,
  })),
}));

jest.mock("@/components/profile-setup/dialogs/category", () => ({
  CategoryDialog: ({
    onAddCategory,
  }: {
    onAddCategory: (cat: Category) => void;
  }) => (
    <button
      onClick={() => onAddCategory({ code: "new-cat", name: "New Category" })}
      data-testid="category-dialog"
    >
      Add Custom Category
    </button>
  ),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormAlert: () => <div data-testid="form-alert" />,
  FormField: ({ render }: { render: () => void }) => render(),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormMessage: () => <div data-testid="form-message" />,
  FormCheckboxField: ({ item }: { item: { code: string; name: string } }) => (
    <div data-testid="form-checkbox" data-category-code={item.code}>
      {item.name}
    </div>
  ),
}));

describe("CategoriesForm", () => {
  const mockInitialData = {
    user: {
      id: "test-id",
      email: "test@example.com",
      user_metadata: {},
    },
    profile: {
      id: "test-id",
      full_name: "Test User",
      expense_categories: [{ code: "custom-cat", name: "Custom Category" }],
      completed_steps: 2,
    },
  };

  const testCategories = [
    { code: "test1", name: "Test 1" },
    { code: "test2", name: "Test 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form with all initial categories", () => {
    render(<CategoriesForm initialData={mockInitialData} />);

    // Check base form is rendered
    expect(screen.getByTestId("base-form")).toBeInTheDocument();

    // Check all categories are rendered
    const checkboxes = screen.getAllByTestId("form-checkbox");
    const totalCategories =
      categoryList.length + mockInitialData.profile.expense_categories.length;
    expect(checkboxes).toHaveLength(totalCategories);

    // Check custom category is included
    const customCategory = screen.getByText("Custom Category");
    expect(customCategory).toBeInTheDocument();
  });

  it("should initialize form with correct profile data", () => {
    render(<CategoriesForm initialData={mockInitialData} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: mockInitialData.user.id,
          completedSteps: mockInitialData.profile.completed_steps.toString(),
          categories: ["custom-cat"],
        },
      }),
    );
  });

  it("should handle adding new custom category", async () => {
    render(<CategoriesForm initialData={mockInitialData} />);

    // Get initial category count
    const initialCheckboxes = screen.getAllByTestId("form-checkbox");
    const initialCount = initialCheckboxes.length;

    // Add new category
    const addButton = screen.getByTestId("category-dialog");
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Check new category is added
    const updatedCheckboxes = screen.getAllByTestId("form-checkbox");
    expect(updatedCheckboxes).toHaveLength(initialCount + 1);
    expect(screen.getByText("New Category")).toBeInTheDocument();
  });

  it("should handle missing profile data", () => {
    const dataWithoutProfile = {
      user: {
        id: "test-id",
        email: "test@example.com",
        user_metadata: {},
      },
      profile: null,
    };

    render(<CategoriesForm initialData={dataWithoutProfile} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: "test-id",
          completedSteps: "",
          categories: [],
        },
      }),
    );
  });

  it("should transform valid category data", () => {
    render(<CategoriesForm initialData={mockInitialData} />);

    const testData = {
      id: "test-id",
      completedSteps: "2",
      categories: ["test1", "test2"],
    };

    const config = getFormConfig(mockInitialData, testCategories);
    const formData = config.transformData(testData);

    // Verify all form data is correctly set
    expect(formData.get("id")).toBe("test-id");
    expect(formData.get("completedSteps")).toBe("2");

    const parsedCategories = JSON.parse(formData.get("categories") as string);
    expect(parsedCategories).toEqual(testCategories);
  });

  it("should throw error when category code is not found", () => {
    render(<CategoriesForm initialData={mockInitialData} />);

    const testData = {
      id: "test-id",
      completedSteps: "2",
      categories: ["non-existent-category"],
    };

    const config = getFormConfig(mockInitialData, testCategories);

    expect(() => config.transformData(testData)).toThrow(
      "Category not found: non-existent-category",
    );
  });
});
