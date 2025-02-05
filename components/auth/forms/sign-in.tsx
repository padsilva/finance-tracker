"use client";

import { startTransition, useActionState, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowRight, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { signin } from "@/app/(auth)/actions";
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
import { signInSchema, SignInValues } from "@/utils/validation-schema";

export const SignInForm = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction, isPending] = useActionState(signin, null);
  const [captchaToken, setCaptchaToken] = useState("");

  const onSubmit = (data: SignInValues) => {
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
            <LogIn className="h-8 w-8 text-primary" data-testid="login-icon" />
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full items-center gap-4">
                <FormAlert error={state?.error} />
                <FormInputField
                  control={form.control}
                  icon={<Mail size={16} data-testid="mail-icon" />}
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                />
                <FormInputField
                  control={form.control}
                  icon={<Lock size={16} data-testid="lock-icon" />}
                  label={
                    <div className="flex items-center justify-between">
                      Password
                      <Button asChild className="p-0" size="sm" variant="link">
                        <Link href="/forgot-password">Forgot password?</Link>
                      </Button>
                    </div>
                  }
                  name="password"
                  placeholder="Enter your password"
                  type="password"
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
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      data-testid="loader-icon"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight data-testid="arrow-right-icon" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">{`Don't have an account?`}</p>
        <Button asChild className="p-1" variant="link">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
