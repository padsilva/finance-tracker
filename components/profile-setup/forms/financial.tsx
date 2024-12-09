"use client";

import { Wallet, HandCoins, Banknote } from "lucide-react";

import { financialSetup } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import {
  Form,
  FormAlert,
  FormComboboxField,
  FormIconInputField,
} from "@/components/ui/form";
import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";
import { ProfileData } from "@/types/database";
import { currencyList } from "@/utils/currencies";
import {
  FinancialSetupValues,
  financialSetupSchema,
} from "@/utils/validation-schema";

interface FinancialFormProps {
  initialData: ProfileData;
}

export const FinancialForm: React.FC<FinancialFormProps> = ({
  initialData,
}) => {
  const { user, profile } = initialData;
  const { form, state, isPending, handleSubmit } =
    useProfileSetupForm<FinancialSetupValues>({
      schema: financialSetupSchema,
      defaultValues: {
        id: user.id,
        completedSteps: profile?.completed_steps?.toString() ?? "",
        startingBalance: Number(profile?.starting_balance ?? 0).toFixed(2),
        currency: profile?.currency ?? "",
      },
      action: financialSetup,
    });

  return (
    <BaseForm
      step={2}
      description="Financial Setup"
      icon={Wallet}
      title="Financial Setup"
      subtitle="Set your financial preferences"
      isPending={isPending}
      onSubmit={handleSubmit}
      backLink="/profile-setup/personal"
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormAlert error={state?.error} />
          <FormComboboxField
            control={form.control}
            name="currency"
            label="Currency"
            icon={<Banknote />}
            items={currencyList}
            placeholder="Select currency"
            searchPlaceholder="Search currency..."
            emptyText="No currency found."
            displayFormat={(item) => `${item.code} (${item.name})`}
          />
          <FormIconInputField
            control={form.control}
            icon={<HandCoins />}
            label="Starting Balance"
            name="startingBalance"
            type="number"
            step="0.01"
            inputMode="decimal"
          />
        </div>
      </Form>
    </BaseForm>
  );
};
