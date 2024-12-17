"use client";

import { startTransition, useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { ZodSchema } from "zod";

import { PrevState } from "@/app/profile-setup/actions";

interface BaseFormData {
  id: string;
  completedSteps: string;
}

interface UseProfileSetupFormProps<T extends BaseFormData> {
  schema: ZodSchema;
  defaultValues: DefaultValues<T>;
  action: (
    _prevState: PrevState,
    formData: FormData,
  ) => Promise<{
    error: string;
  }>;
  transformData?: (data: T) => FormData;
}

export const useProfileSetupForm = <T extends BaseFormData>({
  schema,
  defaultValues,
  action,
  transformData,
}: UseProfileSetupFormProps<T>) => {
  const [state, formAction, isPending] = useActionState(action, null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<T> = (data) => {
    startTransition(() => {
      const formData = transformData
        ? transformData(data)
        : Object.entries(data).reduce((fd, [key, value]) => {
            fd.append(key, value?.toString() ?? "");
            return fd;
          }, new FormData());

      formAction(formData);
    });
  };

  return {
    form,
    state,
    isPending,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
