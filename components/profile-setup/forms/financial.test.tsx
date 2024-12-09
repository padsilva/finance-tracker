import { render, screen } from "@testing-library/react";

import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";

import { FinancialForm } from "./financial";

jest.mock("@/app/profile-setup/actions", () => ({
  financialSetup: jest.fn(),
}));

jest.mock("@/hooks/use-profile-setup-form", () => ({
  useProfileSetupForm: jest.fn(() => ({
    form: { control: {}, handleSubmit: () => jest.fn() },
    state: { error: null },
    isPending: false,
    handleSubmit: jest.fn(),
  })),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormAlert: () => <div data-testid="form-alert" />,
  FormIconInputField: () => <div data-testid="form-icon-input" />,
  FormComboboxField: ({
    displayFormat,
  }: {
    displayFormat: (item: { code: string; name: string }) => string;
  }) => (
    <div
      data-testid="form-combobox"
      data-display-format={displayFormat({ code: "USD", name: "US Dollar" })}
    />
  ),
}));

describe("FinancialForm", () => {
  const mockInitialData = {
    user: {
      id: "test-id",
      email: "test@example.com",
      user_metadata: {
        full_name: "Test User",
      },
    },
    profile: {
      id: "test-id",
      full_name: "Test User",
      starting_balance: 1000,
      currency: "EUR",
      completed_steps: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form with all required fields", () => {
    render(<FinancialForm initialData={mockInitialData} />);

    // Check base form is rendered
    expect(screen.getByTestId("base-form")).toBeInTheDocument();

    // Check all form fields are rendered
    expect(screen.getByTestId("form-combobox")).toBeInTheDocument(); // Currency
    expect(screen.getByTestId("form-icon-input")).toBeInTheDocument(); // Starting Balance
  });

  it("should initialize form with correct profile data", () => {
    render(<FinancialForm initialData={mockInitialData} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: mockInitialData.user.id,
          completedSteps: mockInitialData.profile.completed_steps.toString(),
          startingBalance: Number(
            mockInitialData.profile.starting_balance,
          ).toFixed(2),
          currency: mockInitialData.profile.currency,
        },
      }),
    );
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

    render(<FinancialForm initialData={dataWithoutProfile} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: "test-id",
          completedSteps: "",
          startingBalance: "0.00",
          currency: "",
        },
      }),
    );
  });

  it("should format currency display correctly", () => {
    render(<FinancialForm initialData={mockInitialData} />);

    const currencyField = screen.getByTestId("form-combobox");
    expect(currencyField).toHaveAttribute(
      "data-display-format",
      "USD (US Dollar)",
    );
  });
});
