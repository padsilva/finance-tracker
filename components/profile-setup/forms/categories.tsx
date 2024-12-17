"use client";

import { useState } from "react";

import { Tags } from "lucide-react";

import { categories } from "@/app/profile-setup/actions";
import { CategoryDialog } from "@/components/profile-setup/dialogs/category";
import { BaseForm } from "@/components/profile-setup/forms/base";
import {
  Form,
  FormAlert,
  FormCheckboxField,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useProfileSetupForm } from "@/hooks/use-profile-setup-form";
import { Category, ProfileData } from "@/types/database";
import { categoryList } from "@/utils/categories";
import { CategoriesValues, categoriesSchema } from "@/utils/validation-schema";

interface CategoriesFormProps {
  initialData: ProfileData;
}

const getSelectedCategories = (
  allCategories: Category[],
  selectedCodes: string[],
) => {
  return selectedCodes.map((code) => {
    const category = allCategories.find((cat) => cat.code === code);
    if (!category) {
      throw new Error(`Category not found: ${code}`);
    }
    return category;
  });
};

const transformCategoryData = (
  data: CategoriesValues,
  allCategories: Category[],
) => {
  const { categories, completedSteps, id } = data;
  const selectedCategories = getSelectedCategories(allCategories, categories);

  const formData = new FormData();
  formData.append("completedSteps", completedSteps);
  formData.append("id", id);
  formData.append("categories", JSON.stringify(selectedCategories));
  return formData;
};

export const getFormConfig = (
  initialData: ProfileData,
  allCategories: Category[],
) => ({
  schema: categoriesSchema,
  defaultValues: {
    id: initialData.user.id,
    completedSteps: initialData.profile?.completed_steps?.toString() ?? "",
    categories:
      initialData.profile?.expense_categories?.map((cat) => cat.code) ?? [],
  },
  action: categories,
  transformData: (data: CategoriesValues) =>
    transformCategoryData(data, allCategories),
});

export const CategoriesForm: React.FC<CategoriesFormProps> = ({
  initialData,
}) => {
  const userCategories = initialData.profile?.expense_categories ?? [];

  const mergedCategories = [...categoryList, ...userCategories].filter(
    (cat, index, self) => index === self.findIndex((c) => c.code === cat.code),
  );

  const [allCategories, setAllCategories] =
    useState<Category[]>(mergedCategories);

  const { form, state, isPending, handleSubmit } =
    useProfileSetupForm<CategoriesValues>(
      getFormConfig(initialData, allCategories),
    );

  const handleAddCategory = (newCategory: Category) => {
    setAllCategories((prev) => [...prev, newCategory]);
  };

  return (
    <BaseForm
      step={3}
      description="Categories"
      icon={Tags}
      title="Expense Categories"
      subtitle="Select categories to track your spending"
      isPending={isPending}
      onSubmit={handleSubmit}
      backLink="/profile-setup/financial"
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormAlert error={state?.error} />
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <div className="space-y-4">
                <FormItem className="flex flex-wrap justify-between gap-3 space-y-0">
                  {allCategories.map((category) => (
                    <FormCheckboxField
                      key={category.code}
                      control={form.control}
                      name="categories"
                      item={category}
                    />
                  ))}
                </FormItem>
                <CategoryDialog onAddCategory={handleAddCategory} />
                <FormMessage />
              </div>
            )}
          />
        </div>
      </Form>
    </BaseForm>
  );
};
