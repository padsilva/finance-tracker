import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import {
  mockFormAction,
  resetMocks,
  setError,
  setLoadingState,
  setSuccess,
} from "@/utils/test-utils";

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

const mockEmail = "test@example.com";

const mockSupabase = {
  auth: {
    getUser: jest.fn(() => ({
      data: {
        user: {
          id: "123",
          email: mockEmail,
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
    resetMocks();
  });

  it("should render initial form state correctly", () => {
    render(<VerifySignUpForm email={mockEmail} />);

    // Check header content
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
    expect(screen.getByText("Email Confirmation")).toBeInTheDocument();

    // Check if user email is displayed
    expect(screen.getByText(mockEmail)).toBeInTheDocument();

    // Check for confirmation listener
    expect(screen.getByTestId("confirmation-listener")).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toHaveAttribute("href", "/signin");
  });

  it("should handle resend email submission with valid data", async () => {
    render(<VerifySignUpForm email={mockEmail} />);

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
    });

    const formData = mockFormAction.mock.calls[0][0];
    expect(formData.get("email")).toBe(mockEmail);
    expect(formData.get("captchaToken")).toBe("mock-captcha-token");
  });

  it("should show loading state during submission", () => {
    setLoadingState(true);

    render(<VerifySignUpForm email={mockEmail} />);

    const submitButton = screen.getByRole("button", { name: /resending/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    setError("Failed to send confirmation email");

    render(<VerifySignUpForm email={mockEmail} />);

    expect(
      screen.getByText("Failed to send confirmation email"),
    ).toBeInTheDocument();
  });

  it("should display success messages", () => {
    setSuccess("Confirmation email sent successfully");

    render(<VerifySignUpForm email={mockEmail} />);

    expect(
      screen.getByText("Confirmation email sent successfully"),
    ).toBeInTheDocument();
  });
});
