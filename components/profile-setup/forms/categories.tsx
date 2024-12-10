"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tags } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { createClient } from "@/lib/supabase/client";
import { ProfileSetup } from "@/types/database";
import { Category, categoryList } from "@/utils/categories";
import { CategoriesValues, categoriesSchema } from "@/utils/validation-schema";

export const CategoriesForm = () => {
  const supabase = createClient();

  const form = useForm<CategoriesValues>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      completedSteps: "",
      id: "",
      categories: [],
    },
  });

  const [state, formAction, isPending] = useActionState(categories, null);
  const [allCategories, setAllCategories] = useState<Category[]>(categoryList);

  const handleAddCategory = (newCategory: Category) => {
    setAllCategories((prev) => [...prev, newCategory]);
  };

  const getSelectedCategories = (selectedCodes: string[]) => {
    return selectedCodes.map((code) => {
      const category = allCategories.find((cat) => cat.code === code);
      if (!category) throw new Error(`Category not found: ${code}`);
      return category;
    });
  };

  const onSubmit = (data: CategoriesValues) => {
    startTransition(() => {
      const { categories, completedSteps, id } = data;
      const selectedCategories = getSelectedCategories(categories);

      const formData = new FormData();
      formData.append("completedSteps", completedSteps);
      formData.append("id", id);
      formData.append("categories", JSON.stringify(selectedCategories));
      formAction(formData);
    });
  };

  const mergeCategories = (userCategories: Category[]) => {
    return [...categoryList, ...userCategories].filter(
      (cat, index, self) =>
        index === self.findIndex((c) => c.code === cat.code),
    );
  };

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data: profile } = await supabase
        .from("profile_setup")
        .select("*")
        .eq("id", user.id)
        .single<ProfileSetup>();

      if (profile) {
        form.setValue("id", user.id);
        form.setValue("completedSteps", profile.completed_steps.toString());

        const userCategories = profile.expense_categories ?? [];
        form.setValue(
          "categories",
          userCategories.map((cat) => cat.code),
        );

        const mergedCategories = mergeCategories(userCategories);
        setAllCategories(mergedCategories);
      }
    };

    loadUserData();
  }, [form, supabase]);

  return (
    <BaseForm
      step={3}
      description="Categories"
      icon={Tags}
      title="Expense Categories"
      subtitle="Select categories to track your spending"
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
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
                <FormItem className="flex flex-wrap gap-3 space-y-0">
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
