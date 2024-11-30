jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
    <div data-testid="captcha">
      <button type="button" onClick={() => onSuccess("mock-captcha-token")}>
        Verify Captcha
      </button>
    </div>
  ),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  startTransition: (cb: () => void) => cb(),
  useActionState: () => [mockState, mockFormAction, mockIsPending],
}));

jest.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: "mock-site-key" },
}));

jest.mock("@/app/(auth)/actions", () => ({
  signin: jest.fn(),
  signup: jest.fn(),
  resendVerificationEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
}));

interface MockState {
  error: string | null;
  success?: string | null;
}

export const mockFormAction = jest.fn();
const mockState: MockState = { error: null, success: null };
let mockIsPending = false;

export const setLoadingState = (loading: boolean) => {
  mockIsPending = loading;
};

export const setError = (error: string | null) => {
  mockState.error = error;
};

export const setSuccess = (success: string | null) => {
  mockState.success = success;
};

export const resetMocks = () => {
  mockFormAction.mockClear();
  mockIsPending = false;
  mockState.error = null;
  mockState.success = null;
};
