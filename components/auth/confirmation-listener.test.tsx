import { act, render, screen, waitFor } from "@testing-library/react";

import { createClient } from "@/lib/supabase/client";

import { ConfirmationListener } from "./confirmation-listener";

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
};
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

describe("ConfirmationListener", () => {
  let mockSupabase: {
    auth: {
      getUser: jest.Mock;
      onAuthStateChange: jest.Mock;
    };
  };
  let mockUnsubscribe: jest.Mock;

  beforeEach(() => {
    // Setup Supabase unsubscribe mock
    mockUnsubscribe = jest.fn();

    // Setup Supabase auth mock
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        })),
      },
    };

    // Setup createClient mock
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123",
          email: "test@example.com",
          email_confirmed_at: null,
        },
      },
      error: null,
    });

    render(<ConfirmationListener />);

    expect(screen.getByTestId("refresh-icon")).toBeInTheDocument();
    expect(
      screen.getByText(/waiting for email confirmation/i),
    ).toBeInTheDocument();
  });

  it("should cleanup subscription on unmount", () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { unmount } = render(<ConfirmationListener />);
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("should apply correct styling", () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    render(<ConfirmationListener />);

    const container = screen
      .getByText(/waiting for email confirmation/i)
      .closest("p");
    expect(container).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "gap-2",
      "text-lg",
    );

    const refreshIcon = screen.getByTestId("refresh-icon");
    expect(refreshIcon).toHaveClass(
      "h-5",
      "w-5",
      "animate-spin",
      "text-primary",
    );
  });

  it("should handle SIGNED_IN event", async () => {
    // Initially unconfirmed
    mockSupabase.auth.getUser
      .mockResolvedValueOnce({
        data: {
          user: {
            id: "123",
            email: "test@example.com",
            email_confirmed_at: null,
          },
        },
        error: null,
      })
      // When checked after SIGNED_IN event
      .mockResolvedValueOnce({
        data: {
          user: {
            id: "123",
            email: "test@example.com",
            email_confirmed_at: new Date().toISOString(),
          },
        },
        error: null,
      });

    render(<ConfirmationListener />);

    // Get the callback that was passed to onAuthStateChange
    const [[authStateCallback]] =
      mockSupabase.auth.onAuthStateChange.mock.calls;

    act(() => {
      // Trigger SIGNED_IN event
      authStateCallback("SIGNED_IN");
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
    });
  });

  it("should handle USER_UPDATED event", async () => {
    // Initially unconfirmed
    mockSupabase.auth.getUser
      .mockResolvedValueOnce({
        data: {
          user: {
            id: "123",
            email: "test@example.com",
            email_confirmed_at: null,
          },
        },
        error: null,
      })
      // When checked after USER_UPDATED event
      .mockResolvedValueOnce({
        data: {
          user: {
            id: "123",
            email: "test@example.com",
            email_confirmed_at: new Date().toISOString(),
          },
        },
        error: null,
      });

    render(<ConfirmationListener />);

    // Get the callback that was passed to onAuthStateChange
    const [[authStateCallback]] =
      mockSupabase.auth.onAuthStateChange.mock.calls;

    act(() => {
      // Trigger USER_UPDATED event
      authStateCallback("USER_UPDATED");
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
    });
  });

  it("should not trigger email confirmation check for other events", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123",
          email: "test@example.com",
          email_confirmed_at: null,
        },
      },
      error: null,
    });

    render(<ConfirmationListener />);

    // Get the callback that was passed to onAuthStateChange
    const [[authStateCallback]] =
      mockSupabase.auth.onAuthStateChange.mock.calls;

    // Initial getUser call count
    const initialCallCount = mockSupabase.auth.getUser.mock.calls.length;

    // Trigger other event types
    await authStateCallback("SIGNED_OUT");
    await authStateCallback("PASSWORD_RECOVERY");

    // Verify getUser wasn't called again
    expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(initialCallCount);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});