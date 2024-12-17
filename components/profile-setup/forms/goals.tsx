"use client";

import { Goal, PiggyBank, CircleAlert } from "lucide-react";

import { goals } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import { Form, FormAlert, FormIconInputField } from "@/components/ui/form";
import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";
import { ProfileData } from "@/types/database";
import { goalsSchema, GoalsValues } from "@/utils/validation-schema";

interface GoalsFormProps {
  initialData: ProfileData;
}

export const GoalsForm: React.FC<GoalsFormProps> = ({ initialData }) => {
  const { user, profile } = initialData;
  const { form, state, isPending, handleSubmit } =
    useProfileSetupForm<GoalsValues>({
      schema: goalsSchema,
      defaultValues: {
        id: user.id,
        completedSteps: profile?.completed_steps?.toString() ?? "",
        monthlySavingGoals: Number(profile?.monthly_saving_goals ?? 0).toFixed(
          2,
        ),
        budgetLimit: Number(profile?.budget_limit ?? 0).toFixed(2),
      },
      action: goals,
    });

  return (
    <BaseForm
      step={4}
      description="Goals"
      icon={Goal}
      title="Set Your Goals"
      subtitle="Define your financial goals"
      isPending={isPending}
      onSubmit={handleSubmit}
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
