import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import { ForgotPasswordForm } from "./forgot-password";

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

jest.mock("@/app/(auth)/actions", () => ({
  forgotPassword: jest.fn(),
}));

jest.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: "mock-site-key" },
}));

describe("ForgotPasswordForm", () => {
  const defaultEmail = "test@example.com";

  beforeEach(() => {
    mockFormAction.mockClear();
    mockIsPending = false;
    mockState.error = null;
    mockState.success = null;
  });

  it("should render initial form state correctly", () => {
    render(<ForgotPasswordForm />);

    // Check header content
    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
    expect(
      screen.getByText(/we'll send you a reset link/i),
    ).toBeInTheDocument();

    // Check form elements
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset instructions/i }),
    ).toBeInTheDocument();

    // Check back button
    const backButton = screen.getByRole("link", { name: /back to sign in/i });
    expect(backButton).toHaveAttribute("href", "/signin");
  });

  it("should handle form submission with valid email", async () => {
    render(<ForgotPasswordForm />);

    // Fill email
    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: defaultEmail } });

    // Complete captcha
    const captchaButton = screen.getAllByText("Verify Captcha")[0];
    fireEvent.click(captchaButton);

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: /send reset instructions/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("email")).toBe(defaultEmail);
      expect(formData.get("captchaToken")).toBe("mock-captcha-token");
    });
  });

  it("should validate required email field", async () => {
    render(<ForgotPasswordForm />);

    await act(async () => {
      // Submit form without email
      const submitButton = screen.getByRole("button", {
        name: /send reset instructions/i,
      });
      fireEvent.click(submitButton);
    });

    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", () => {
    mockIsPending = true;

    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", { name: /sending/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    mockState.error = "Email not found";
    mockState.success = null;

    render(<ForgotPasswordForm />);
    expect(screen.getByText("Email not found")).toBeInTheDocument();
  });

  it("should display success messages", () => {
    mockState.error = null;
    mockState.success = "Reset instructions sent";

    render(<ForgotPasswordForm />);
    expect(screen.getByText("Reset instructions sent")).toBeInTheDocument();
  });
});
