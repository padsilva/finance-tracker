import { render, fireEvent, screen } from "@testing-library/react";
import { Mail, LockIcon, DollarSign, User, Building } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormInputField,
  FormIconInputField,
  FormSelectField,
  FormComboboxField,
  FormCheckboxField,
  FormAlert,
} from "./form";

// Test data
const mockSelectOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const mockComboboxItems = [
  { code: "food", name: "Food & Dining" },
  { code: "transport", name: "Transportation" },
];

describe("Form Components", () => {
  describe("Basic Components", () => {
    it("should render FormAlert variants", () => {
      const { container } = render(
        <div>
          <FormAlert error="Test error message" />
          <FormAlert success="Test success message" />
          <FormAlert />
        </div>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("Input Fields", () => {
    it("should render basic input fields", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            email: "",
            password: "",
          },
        });

        return (
          <Form {...form}>
            <FormInputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter email"
              icon={<Mail size={16} />}
            />
            <FormInputField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              icon={<LockIcon size={16} />}
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    // Test password visibility toggle
    it("should handle password visibility toggle", async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            password: "test123",
          },
        });

        return (
          <Form {...form}>
            <FormInputField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              icon={<LockIcon size={16} />}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const input = screen.getByPlaceholderText("Enter password");
      const toggleButton = screen.getByTestId("toggle-visibility");

      expect(input).toHaveAttribute("type", "password");

      fireEvent.click(toggleButton);

      expect(input).toHaveAttribute("type", "text");
    });

    it("should handle FormIconInputField with number formatting", async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            amount: "", // Provide default value
          },
        });
        return (
          <Form {...form}>
            <FormIconInputField
              control={form.control}
              name="amount"
              label="Amount"
              placeholder="0.00"
              icon={<DollarSign size={16} />}
              type="number"
              step="0.01"
              inputMode="decimal"
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const input = screen.getByPlaceholderText("0.00");

      fireEvent.change(input, { target: { value: "123.4567" } });

      fireEvent.blur(input);

      expect(input).toHaveValue(123.46);
    });
  });

  describe("Select Fields", () => {
    it("should render FormSelectField with options", () => {
      const TestComponent = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormSelectField
              control={form.control}
              name="type"
              label="Transaction Type"
              placeholder="Select type"
              icon={<User size={16} />}
              options={mockSelectOptions}
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it("should render FormSelectField with selected value", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { type: "income" },
        });
        return (
          <Form {...form}>
            <FormSelectField
              control={form.control}
              name="type"
              label="Transaction Type"
              placeholder="Select type"
              icon={<User size={16} />}
              options={mockSelectOptions}
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Combobox Fields", () => {
    it("should render FormComboboxField with items", () => {
      const TestComponent = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormComboboxField
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select category"
              icon={<Building size={16} />}
              items={mockComboboxItems}
              searchPlaceholder="Search categories..."
              emptyText="No category found."
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it("should render FormComboboxField with custom display format", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { category: "food" },
        });
        return (
          <Form {...form}>
            <FormComboboxField
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select category"
              icon={<Building size={16} />}
              items={mockComboboxItems}
              searchPlaceholder="Search categories..."
              emptyText="No category found."
              displayFormat={(item) =>
                `${item.code.toUpperCase()} - ${item.name}`
              }
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Checkbox Fields", () => {
    it("should render FormCheckboxField", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { categories: [] },
        });
        return (
          <Form {...form}>
            <FormCheckboxField
              control={form.control}
              name="categories"
              item={mockComboboxItems[0]}
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it("should handle checkbox selection and deselection", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { categories: ["food"] },
        });
        return (
          <Form {...form}>
            <FormCheckboxField
              control={form.control}
              name="categories"
              item={mockComboboxItems[0]}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Complete Form", () => {
    it("should render form with all field types", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            email: "",
            password: "",
            amount: "",
            type: "",
            category: "",
            categories: [],
          },
        });

        return (
          <Form {...form}>
            <div className="space-y-4">
              <FormInputField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter email"
                icon={<Mail size={16} />}
              />
              <FormInputField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                icon={<LockIcon size={16} />}
              />
              <FormIconInputField
                control={form.control}
                name="amount"
                label="Amount"
                placeholder="0.00"
                icon={<DollarSign size={16} />}
                type="number"
                step="0.01"
                inputMode="decimal"
              />
              <FormSelectField
                control={form.control}
                name="type"
                label="Transaction Type"
                placeholder="Select type"
                icon={<User size={16} />}
                options={mockSelectOptions}
              />
              <FormComboboxField
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select category"
                icon={<Building size={16} />}
                items={mockComboboxItems}
                searchPlaceholder="Search categories..."
                emptyText="No category found."
              />
              <div className="flex gap-4">
                {mockComboboxItems.map((item) => (
                  <FormCheckboxField
                    key={item.code}
                    control={form.control}
                    name="categories"
                    item={item}
                  />
                ))}
              </div>
            </div>
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Edge Cases", () => {
    it("should render FormDescription with proper accessibility attributes", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            test: "",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Field</FormLabel>
                  <FormControl>
                    <input {...field} />
                  </FormControl>
                  <FormDescription data-testid="form-description">
                    This is a test description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const description = screen.getByTestId("form-description");
      expect(description).toHaveClass("text-[0.8rem]", "text-muted-foreground");
      expect(description.id).toBeDefined(); // Check if ID is set for accessibility
    });

    it("should handle checkbox empty array values", async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            categories: [], // Initialize as empty array instead of undefined
          },
        });

        return (
          <Form {...form}>
            <FormCheckboxField
              control={form.control}
              name="categories"
              item={{ code: "test", name: "Test" }}
            />
          </Form>
        );
      };

      render(<TestComponent />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked(); // Initial state

      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });
  });
});
