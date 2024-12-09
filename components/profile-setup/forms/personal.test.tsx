import { render, screen } from "@testing-library/react";

import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";

import { PersonalForm } from "./personal";

jest.mock("@/app/profile-setup/actions", () => ({
  personalInfo: jest.fn(),
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
  FormSelectField: () => <div data-testid="form-select" />,
  FormComboboxField: () => <div data-testid="form-combobox" />,
}));

describe("PersonalForm", () => {
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
      display_name: "TestUser",
      language: "en",
      country: "US",
      completed_steps: 0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form with all required fields", () => {
    render(<PersonalForm initialData={mockInitialData} />);

    // Check base form is rendered
    expect(screen.getByTestId("base-form")).toBeInTheDocument();

    // Check all form fields are rendered
    expect(screen.getAllByTestId("form-icon-input")).toHaveLength(2); // Full Name and Display Name
    expect(screen.getByTestId("form-select")).toBeInTheDocument(); // Language
    expect(screen.getByTestId("form-combobox")).toBeInTheDocument(); // Country
  });

  it("should initialize form with correct profile data", () => {
    render(<PersonalForm initialData={mockInitialData} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: mockInitialData.user.id,
          completedSteps: mockInitialData.profile.completed_steps.toString(),
          fullName: mockInitialData.user.user_metadata.full_name,
          displayName: mockInitialData.profile.display_name,
          language: mockInitialData.profile.language,
          country: mockInitialData.profile.country,
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

    render(<PersonalForm initialData={dataWithoutProfile} />);

    expect(useProfileSetupForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          id: "test-id",
          completedSteps: "",
          fullName: "",
          displayName: "",
          language: "",
          country: "",
        },
      }),
    );
  });
});
