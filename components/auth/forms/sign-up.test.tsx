import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { SignUpForm } from "./sign-up";

jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
    <div data-testid="captcha">
      <button type="button" onClick={() => onSuccess("mock-captcha-token")}>
        Verify Captcha
      </button>
    </div>
  ),
}));

const mockFormAction = jest.fn();
const mockState: { error: string | null } = { error: null };
let mockIsPending = false;
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  startTransition: jest.fn((callback) => callback()),
  useActionState: jest.fn(() => [mockState, mockFormAction, mockIsPending]),
}));

jest.mock("@/app/(auth)/actions", () => ({
  signup: jest.fn(),
}));

const mockSetUser = jest.fn();
jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn((selector) => selector({ setUser: mockSetUser })),
}));

jest.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: "mock-site-key" },
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    mockFormAction.mockClear();
    mockSetUser.mockClear();
    mockIsPending = false;
    mockState.error = null;
  });

  it("should render initial form state correctly", () => {
    render(<SignUpForm />);

    // Check header elements
    expect(screen.getByTestId("user-plus-icon")).toBeInTheDocument();
    expect(screen.getByTestId("card-title")).toHaveTextContent(
      "Create Account",
    );
    expect(
      screen.getByText("Start managing your finances today"),
    ).toBeInTheDocument();

    // Check form fields
    expect(
      screen.getByPlaceholderText("Enter your full name"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();

    // Check submit button and link
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toHaveAttribute("href", "/signin");
  });

  it("should handle form submission with valid data", async () => {
    render(<SignUpForm />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "Password123!" },
    });

    // Complete captcha
    fireEvent.click(screen.getAllByText("Verify Captcha")[0]);

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      // Check if user store was updated
      expect(mockSetUser).toHaveBeenCalledWith({
        email: "john@example.com",
        name: "John Doe",
      });

      // Check form submission
      expect(mockFormAction).toHaveBeenCalled();
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("fullName")).toBe("John Doe");
      expect(formData.get("email")).toBe("john@example.com");
      expect(formData.get("password")).toBe("Password123!");
      expect(formData.get("confirmPassword")).toBe("Password123!");
      expect(formData.get("captchaToken")).toBe("mock-captcha-token");
    });
  });

  it("should validate required fields", async () => {
    render(<SignUpForm />);

    // Submit empty form
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockFormAction).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it("should validate password match", async () => {
    render(<SignUpForm />);

    // Fill form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "DifferentPassword123!" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", () => {
    mockIsPending = true;

    render(<SignUpForm />);

    const submitButton = screen.getByRole("button", { name: /signing up/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    mockState.error = "Email already exists";

    render(<SignUpForm />);

    expect(screen.getByText("Email already exists")).toBeInTheDocument();
  });
});
