"use client";

import React, { startTransition, useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Goal, PiggyBank, CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { goals } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import { Form, FormAlert, FormIconInputField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { ProfileSetup } from "@/types/database";
import { goalsSchema, GoalsValues } from "@/utils/validation-schema";

export const GoalsForm = () => {
  const supabase = createClient();

  const form = useForm<GoalsValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      completedSteps: "",
      id: "",
      monthlySavingGoals: "0.00",
      budgetLimit: "0.00",
    },
  });

  const [state, formAction, isPending] = useActionState(goals, null);

  const onSubmit = (data: GoalsValues) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formAction(formData);
    });
  };

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const id = user.id;
        form.setValue("id", id);

        const { data } = await supabase
          .from("profile_setup")
          .select("*")
          .eq("id", id)
          .single<ProfileSetup>();

        if (data) {
          form.setValue("completedSteps", data.completed_steps.toString());
          form.setValue(
            "monthlySavingGoals",
            Number(data.monthly_saving_goals?.toString() ?? "0.00").toFixed(2),
          );
          form.setValue(
            "budgetLimit",
            Number(data.budget_limit?.toString() ?? "0.00").toFixed(2),
          );
        }
      }
    };

    getData();
  }, [form, supabase]);

  return (
    <BaseForm
      step={4}
      description="Goals"
      icon={Goal}
      title="Set Your Goals"
      subtitle="Define your financial goals"
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      backLink="/profile-setup/categories"
      submitLabel="Get Started"
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormAlert error={state?.error} />
          <FormIconInputField
            control={form.control}
            icon={<PiggyBank />}
            label="Monthly Saving Goals"
            name="monthlySavingGoals"
            type="number"
            step="0.01"
            inputMode="decimal"
          />
          <FormIconInputField
            control={form.control}
            icon={<CircleAlert />}
            label="Budget Limit"
            name="budgetLimit"
            type="number"
            step="0.01"
            inputMode="decimal"
          />
        </div>
      </Form>
    </BaseForm>
  );
};
