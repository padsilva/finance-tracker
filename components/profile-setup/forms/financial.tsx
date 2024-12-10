"use client";

import React, { startTransition, useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet, HandCoins, Banknote } from "lucide-react";
import { useForm } from "react-hook-form";

import { financialSetup } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import {
  Form,
  FormAlert,
  FormComboboxField,
  FormIconInputField,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { ProfileSetup } from "@/types/database";
import { currencyList } from "@/utils/currencies";
import {
  FinancialSetupValues,
  financialSetupSchema,
} from "@/utils/validation-schema";

export const FinancialForm = () => {
  const supabase = createClient();

  const form = useForm<FinancialSetupValues>({
    resolver: zodResolver(financialSetupSchema),
    defaultValues: {
      completedSteps: "",
      id: "",
      startingBalance: "0.00",
    },
  });

  const [state, formAction, isPending] = useActionState(financialSetup, null);

  const onSubmit = (data: FinancialSetupValues) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // Format starting balance to 2 decimal places
        const formattedValue =
          key === "startingBalance" ? Number(value).toFixed(2) : value;
        formData.append(key, formattedValue);
      });
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
          form.setValue("currency", data.currency ?? "");
          form.setValue(
            "startingBalance",
            Number(data.starting_balance?.toString() ?? "0.00").toFixed(2),
          );
        }
      }
    };

    getData();
  }, [form, supabase]);

  return (
    <BaseForm
      step={2}
      description="Financial Setup"
      icon={Wallet}
      title="Financial Setup"
      subtitle="Set your financial preferences"
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
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
