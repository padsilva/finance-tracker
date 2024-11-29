import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { VerifySignUpForm } from "./verify-signup";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
    <div data-testid="captcha">
      <button type="button" onClick={() => onSuccess("mock-captcha-token")}>
        Verify Captcha
      </button>
    </div>
  ),
}));

jest.mock("@/app/(auth)/actions", () => ({
  resendVerificationEmail: jest.fn(),
}));

const mockUser = {
  email: "test@example.com",
  name: "Test User",
};
const mockSetUser = jest.fn();
jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn((selector) =>
    selector({ user: mockUser, setUser: mockSetUser }),
  ),
}));

const mockFormAction = jest.fn();
const mockState: {
  error: string | null;
  success: string | null;
} = { error: null, success: null };
let mockIsPending = false;
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  startTransition: jest.fn((callback) => callback()),
  useActionState: jest.fn(() => [mockState, mockFormAction, mockIsPending]),
}));

jest.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: "mock-site-key" },
}));

const mockSupabase = {
  auth: {
    getUser: jest.fn(() => ({
      data: {
        user: {
          id: "123",
          email: "test@example.com",
          email_confirmed_at: null,
        },
      },
      error: null,
    })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
  },
};
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe("VerifySignUpForm", () => {
  beforeEach(() => {
    mockFormAction.mockClear();
    mockSetUser.mockClear();
    mockIsPending = false;
    mockState.error = null;
    mockState.success = null;
  });

  it("should render initial form state correctly", () => {
    render(<VerifySignUpForm />);

    // Check header content
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
    expect(screen.getByText("Email Confirmation")).toBeInTheDocument();

    // Check if user email is displayed
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    // Check for confirmation listener
    expect(screen.getByTestId("confirmation-listener")).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toHaveAttribute("href", "/signin");
  });

  it("should handle resend email submission with valid data", async () => {
    render(<VerifySignUpForm />);

    // Complete captcha
    const captchaButton = screen.getAllByText("Verify Captcha")[0];
    fireEvent.click(captchaButton);

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: /resend confirmation email/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("email")).toBe(mockUser.email);
      expect(formData.get("captchaToken")).toBe("mock-captcha-token");
    });
  });

  it("should show loading state during submission", () => {
    mockIsPending = true;

    render(<VerifySignUpForm />);

    const submitButton = screen.getByRole("button", { name: /resending/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    mockState.error = "Failed to send confirmation email";
    mockState.success = null;

    render(<VerifySignUpForm />);

    expect(
      screen.getByText("Failed to send confirmation email"),
    ).toBeInTheDocument();
  });

  it("should display success messages", () => {
    mockState.error = null;
    mockState.success = "Confirmation email sent successfully";

    render(<VerifySignUpForm />);

    expect(
      screen.getByText("Confirmation email sent successfully"),
    ).toBeInTheDocument();
  });
});
