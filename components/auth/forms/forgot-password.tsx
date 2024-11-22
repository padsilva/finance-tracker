"use client";

import { startTransition, useActionState, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { forgotPassword } from "@/app/(auth)/actions";
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
import { env } from "@/lib/env";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/utils/validation-schema";

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const [state, formAction, isPending] = useActionState(forgotPassword, null);
  const [captchaToken, setCaptchaToken] = useState("");

  const onSubmit = (data: ForgotPasswordValues) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append("captchaToken", captchaToken);
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
                <FormInputField
                  control={form.control}
                  icon={<Mail size={16} />}
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex min-h-[140px] justify-center sm:min-h-[72px]">
                <Turnstile
                  className={`hidden sm:block`}
                  onSuccess={setCaptchaToken}
                  siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                />
                <Turnstile
                  className={`block sm:hidden`}
                  onSuccess={setCaptchaToken}
                  options={{ size: "compact" }}
                  siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
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
