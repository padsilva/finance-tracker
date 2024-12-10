"use client";

import React, { startTransition, useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Flag, Languages } from "lucide-react";
import { useForm } from "react-hook-form";

import { personalInfo } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import {
  Form,
  FormAlert,
  FormComboboxField,
  FormIconInputField,
  FormSelectField,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { ProfileSetup } from "@/types/database";
import { countryList } from "@/utils/countries";
import {
  personalInfoSchema,
  PersonalInfoValues,
} from "@/utils/validation-schema";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

export const PersonalForm = () => {
  const supabase = createClient();

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      completedSteps: "",
      id: "",
      fullName: "",
      displayName: "",
    },
  });

  const [state, formAction, isPending] = useActionState(personalInfo, null);

  const onSubmit = (data: PersonalInfoValues) => {
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
        form.setValue("fullName", user.user_metadata.full_name);

        const { data } = await supabase
          .from("profile_setup")
          .select("*")
          .eq("id", id)
          .single<ProfileSetup>();

        if (data) {
          form.setValue("completedSteps", data.completed_steps.toString());
          form.setValue("displayName", data.display_name ?? "");
          form.setValue("language", data.language ?? "");
          form.setValue("country", data.country ?? "");
        }
      }
    };

    getData();
  }, [form, supabase]);

  return (
    <BaseForm
      step={1}
      description="Personal Information"
      icon={User}
      title="Let's get started!"
      subtitle="Tell us a bit about yourself"
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormAlert error={state?.error} />
          <FormIconInputField
            control={form.control}
            icon={<User size={16} />}
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
          />
          <FormIconInputField
            control={form.control}
            icon={<User size={16} />}
            label="Display Name"
            name="displayName"
            placeholder="Enter your display name"
          />
          <FormSelectField
            control={form.control}
            name="language"
            label="Language"
            icon={<Languages />}
            options={languageOptions}
            placeholder="Select a language"
          />
          <FormComboboxField
            control={form.control}
            name="country"
            label="Country"
            icon={<Flag />}
            items={countryList}
            placeholder="Select country"
            searchPlaceholder="Search country..."
            emptyText="No country found."
          />
        </div>
      </Form>
    </BaseForm>
  );
};
