import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import {
  mockFormAction,
  resetMocks,
  setError,
  setLoadingState,
} from "@/utils/test-utils";

import { SignUpForm } from "./sign-up";

describe("SignUpForm", () => {
  beforeEach(() => {
    resetMocks();
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
    setLoadingState(true);

    render(<SignUpForm />);

    const submitButton = screen.getByRole("button", { name: /signing up/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    setError("Email already exists");

    render(<SignUpForm />);

    expect(screen.getByText("Email already exists")).toBeInTheDocument();
  });
});
