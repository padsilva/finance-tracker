"use client";

import { User, Flag, Languages } from "lucide-react";

import { personalInfo } from "@/app/profile-setup/actions";
import { BaseForm } from "@/components/profile-setup/forms/base";
import {
  Form,
  FormAlert,
  FormComboboxField,
  FormIconInputField,
  FormSelectField,
} from "@/components/ui/form";
import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";
import { ProfileData } from "@/types/database";
import { countryList } from "@/utils/countries";
import {
  personalInfoSchema,
  PersonalInfoValues,
} from "@/utils/validation-schema";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

interface PersonalFormProps {
  initialData: ProfileData;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({ initialData }) => {
  const { user, profile } = initialData;
  const { form, state, isPending, handleSubmit } =
    useProfileSetupForm<PersonalInfoValues>({
      schema: personalInfoSchema,
      defaultValues: {
        id: user.id,
        completedSteps: profile?.completed_steps?.toString() ?? "",
        fullName: user.user_metadata.full_name ?? "",
        displayName: profile?.display_name ?? "",
        language: profile?.language ?? "",
        country: profile?.country ?? "",
      },
      action: personalInfo,
    });

  return (
    <BaseForm
      step={1}
      description="Personal Information"
      icon={User}
      title="Let's get started!"
      subtitle="Tell us a bit about yourself"
      isPending={isPending}
      onSubmit={handleSubmit}
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
