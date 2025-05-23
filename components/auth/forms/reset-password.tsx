"use client";

import { startTransition, useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { resetPassword } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormAlert, FormInputField } from "@/components/ui/form";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/utils/validation-schema";

export const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [state, formAction, isPending] = useActionState(resetPassword, null);

  const onSubmit = (data: ResetPasswordValues) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formAction(formData);
    });
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-5">
            <Lock className="h-8 w-8 text-primary" data-testid="lock-icon" />
          </div>
        </div>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full items-center gap-4">
                <FormAlert error={state?.error} success={state?.success} />
                <FormInputField
                  control={form.control}
                  icon={<Lock size={16} data-testid="lock-icon" />}
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
                <FormInputField
                  control={form.control}
                  icon={<Lock size={16} data-testid="lock-icon" />}
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                />
              </div>
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      data-testid="loader-icon"
                    />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href="/signin">
            <ArrowLeft data-testid="arrow-left-icon" /> Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
