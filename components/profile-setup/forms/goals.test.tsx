import { render, screen } from "@testing-library/react";

import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";

import { GoalsForm } from "./goals";

jest.mock("@/app/profile-setup/actions", () => ({
  goals: jest.fn(),
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
}));

describe("GoalsForm", () => {
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
      monthly_saving_goals: 500.5,
      budget_limit: 1000.75,
      completed_steps: 3,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form with all required fields", () => {
    render(<GoalsForm initialData={mockInitialData} />);

    // Check base form is rendered
    expect(screen.getByTestId("base-form")).toBeInTheDocument();

    // Check all form fields are rendered
    expect(screen.getAllByTestId("form-icon-input")).toHaveLength(2); // Monthly Saving Goals and Budget Limit
  });

  it("should initialize form with correct profile data", () => {
    render(<GoalsForm initialData={mockInitialData} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: mockInitialData.user.id,
          completedSteps: mockInitialData.profile.completed_steps.toString(),
          monthlySavingGoals: Number(
            mockInitialData.profile.monthly_saving_goals,
          ).toFixed(2),
          budgetLimit: Number(mockInitialData.profile.budget_limit).toFixed(2),
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

    render(<GoalsForm initialData={dataWithoutProfile} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: "test-id",
          completedSteps: "",
          monthlySavingGoals: "0.00",
          budgetLimit: "0.00",
        },
      }),
    );
  });
});
