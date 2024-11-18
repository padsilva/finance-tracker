"use client";

import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startTransition, useActionState } from "react";
import { forgotPassword } from "@/app/(auth)/actions";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "./ui/input-field";
import { FormAlert } from "./ui/form-alert";

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  const onSubmit = (data: ForgotPasswordValues) => {
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
            <Lock className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          {`Enter your email address and we'll send you a reset link`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full items-center gap-4">
                <FormAlert error={state?.error} success={state?.success} />
                <InputField
                  control={form.control}
                  icon={<Mail size={16} />}
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href="/signin">
            <ArrowLeft /> Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
