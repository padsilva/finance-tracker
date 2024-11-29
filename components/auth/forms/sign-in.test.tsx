import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { SignInForm } from "./sign-in";

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
  signin: jest.fn(),
}));

jest.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: "mock-site-key" },
}));

describe("SignInForm", () => {
  beforeEach(() => {
    mockFormAction.mockClear();
    mockIsPending = false;
    mockState.error = null;
  });

  it("should render initial form state correctly", () => {
    render(<SignInForm />);

    // Check header elements
    expect(screen.getByTestId("login-icon")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();

    // Check form fields
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();

    // Check links
    expect(screen.getByText("Forgot password?")).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(screen.getByText("Sign Up")).toHaveAttribute("href", "/signup");

    // Check captcha
    expect(screen.getAllByTestId("captcha")).toHaveLength(2);

    // Check submit button
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should handle form submission with valid data", async () => {
    render(<SignInForm />);

    // Get form elements
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const captchaButton = screen.getAllByText("Verify Captcha")[0];
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Fill form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Verify captcha
    fireEvent.click(captchaButton);

    // Submit form
    fireEvent.click(submitButton);

    // Verify form submission
    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("email")).toBe("test@example.com");
      expect(formData.get("password")).toBe("password123");
      expect(formData.get("captchaToken")).toBe("mock-captcha-token");
    });
  });

  it("should validate required fields", async () => {
    render(<SignInForm />);

    await act(async () => {
      // Submit empty form
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);
    });

    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", () => {
    mockIsPending = true;

    render(<SignInForm />);

    const submitButton = screen.getByRole("button", { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    mockState.error = "Invalid credentials";

    render(<SignInForm />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
