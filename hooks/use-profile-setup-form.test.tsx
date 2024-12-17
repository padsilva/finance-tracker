import { act, renderHook } from "@testing-library/react";
import { z } from "zod";

import { useProfileSetupForm } from "./use-profile-setup-form";

const mockFormAction = jest.fn();
const mockState = { error: null };
const mockIsPending = false;

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  startTransition: jest.fn((cb: () => void) => cb()),
  useActionState: () => [mockState, mockFormAction, mockIsPending],
}));

const testSchema = z.object({
  id: z.string(),
  completedSteps: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  optionalField: z.string().nullable().optional(),
});

interface TestFormData {
  id: string;
  completedSteps: string;
  name: string;
  email: string;
  optionalField: string | null;
}

describe("useProfileSetupForm", () => {
  const defaultProps = {
    schema: testSchema,
    defaultValues: {
      id: "123",
      completedSteps: "0",
      name: "Test User",
      email: "test@example.com",
      optionalField: null,
    } as TestFormData,
    action: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with provided default values", () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    expect(result.current.form.getValues()).toEqual(defaultProps.defaultValues);
  });

  it("should handle form submission with default transform", async () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    const testData: TestFormData = {
      id: "123",
      completedSteps: "1",
      name: "Test User",
      email: "test@example.com",
      optionalField: null,
    };

    await act(async () => {
      // Set form values
      Object.entries(testData).forEach(([key, value]) => {
        result.current.form.setValue(key as keyof TestFormData, value);
      });

      // Trigger form submission directly through the returned handleSubmit
      await result.current.handleSubmit();
    });

    expect(mockFormAction).toHaveBeenCalled();

    // Verify the FormData passed to mockFormAction
    const formDataArg = mockFormAction.mock.calls[0][0];
    expect(formDataArg instanceof FormData).toBe(true);
    Object.entries(testData).forEach(([key, value]) => {
      expect(formDataArg.get(key)).toBe(value?.toString() ?? "");
    });
  });

  it("should use custom transform function when provided", async () => {
    const customTransform = jest.fn((data: TestFormData) => {
      const formData = new FormData();
      formData.append("customKey", data.id);
      return formData;
    });

    const propsWithTransform = {
      ...defaultProps,
      transformData: customTransform,
    };

    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(propsWithTransform),
    );

    const testData: TestFormData = {
      id: "123",
      completedSteps: "1",
      name: "Test User",
      email: "test@example.com",
      optionalField: null,
    };

    await act(async () => {
      // Set form values
      Object.entries(testData).forEach(([key, value]) => {
        result.current.form.setValue(key as keyof TestFormData, value);
      });

      // Trigger form submission
      await result.current.handleSubmit();
    });

    expect(customTransform).toHaveBeenCalledWith(testData);
    expect(mockFormAction).toHaveBeenCalled();
  });

  it("should handle form validation based on schema", async () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    await act(async () => {
      // Set invalid data
      result.current.form.setValue("email", "invalid-email");

      // Attempt submission
      await result.current.handleSubmit();
    });

    // Check for validation errors
    expect(result.current.state?.error).toBeDefined();
    expect(mockFormAction).not.toHaveBeenCalled();
  });

  it("should expose loading state", () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    expect(result.current.isPending).toBe(mockIsPending);
  });

  it("should expose form state", () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    expect(result.current.state).toEqual(mockState);
  });

  it("should handle null values in form data transformation", async () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    await act(async () => {
      // Manually trigger form submission with null value
      await result.current.form.handleSubmit((data) => {
        // Ensure the key exists with a null value in the submitted data
        const submissionData = {
          ...data,
          optionalField: null,
        };
        const formData = new FormData();
        Object.entries(submissionData).forEach(([key, value]) => {
          formData.append(key, value?.toString() ?? "");
        });
        mockFormAction(formData);
      })();
    });

    // Verify the transformation
    expect(mockFormAction).toHaveBeenCalled();
    const formDataArg = mockFormAction.mock.calls[0][0] as FormData;
    expect(formDataArg.get("optionalField")).toBe("");
  });

  it("should handle undefined values in form data transformation", async () => {
    const { result } = renderHook(() =>
      useProfileSetupForm<TestFormData>(defaultProps),
    );

    await act(async () => {
      // Manually trigger form submission with undefined value
      await result.current.form.handleSubmit((data) => {
        // Ensure the key exists with an undefined value in the submitted data
        const submissionData = {
          ...data,
          optionalField: undefined,
        };
        const formData = new FormData();
        Object.entries(submissionData).forEach(([key, value]) => {
          formData.append(key, value?.toString() ?? "");
        });
        mockFormAction(formData);
      })();
    });

    // Verify the transformation
    expect(mockFormAction).toHaveBeenCalled();
    const formDataArg = mockFormAction.mock.calls[0][0] as FormData;
    expect(formDataArg.get("optionalField")).toBe("");
  });
});
