import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import {
  mockFormAction,
  resetMocks,
  setError,
  setLoadingState,
  setSuccess,
} from "@/utils/test-utils";

import { ResetPasswordForm } from "./reset-password";

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should render initial form state correctly", () => {
    render(<ResetPasswordForm />);

    // Check header content
    expect(screen.getAllByTestId("lock-icon")[0]).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your new password below"),
    ).toBeInTheDocument();

    // Check form elements
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();

    // Check buttons
    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeInTheDocument();
    const backButton = screen.getByRole("link", { name: /back to sign in/i });
    expect(backButton).toHaveAttribute("href", "/signin");
  });

  it("should handle form submission with valid passwords", async () => {
    render(<ResetPasswordForm />);

    // Fill form
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password",
    );

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123!" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("password")).toBe("Password123!");
      expect(formData.get("confirmPassword")).toBe("Password123!");
    });
  });

  it("should validate password match", async () => {
    render(<ResetPasswordForm />);

    // Fill mismatched passwords
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password",
    );

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "DifferentPassword123!" },
    });

    await act(async () => {
      // Submit form
      const submitButton = screen.getByRole("button", {
        name: /change password/i,
      });
      fireEvent.click(submitButton);
    });

    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should validate required fields", async () => {
    render(<ResetPasswordForm />);

    await act(async () => {
      // Submit empty form
      const submitButton = screen.getByRole("button", {
        name: /change password/i,
      });
      fireEvent.click(submitButton);
    });

    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", () => {
    setLoadingState(true);

    render(<ResetPasswordForm />);

    const submitButton = screen.getByRole("button", { name: /changing/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    setError("Reset link has expired");

    render(<ResetPasswordForm />);
    expect(screen.getByText("Reset link has expired")).toBeInTheDocument();
  });

  it("should display success messages", () => {
    setSuccess("Password changed successfully");

    render(<ResetPasswordForm />);
    expect(
      screen.getByText("Password changed successfully"),
    ).toBeInTheDocument();
  });
});
