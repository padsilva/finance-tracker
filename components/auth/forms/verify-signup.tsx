"use client";

import { startTransition, useActionState, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { resendVerificationEmail } from "@/app/(auth)/actions";
import { ConfirmationListener } from "@/components/auth/confirmation-listener";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormAlert } from "@/components/ui/form";
import { env } from "@/lib/env";
import { useUserStore } from "@/stores/userStore";
import { resendSchema, ResendValues } from "@/utils/validation-schema";

export const VerifySignUpForm = () => {
  const user = useUserStore((state) => state.user);
  const form = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: user?.email },
  });

  const [state, formAction, isPending] = useActionState(
    resendVerificationEmail,
    null,
  );
  const [captchaToken, setCaptchaToken] = useState("");

  const onSubmit = (data: ResendValues) => {
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
            <Mail className="h-8 w-8 text-primary" data-testid="mail-icon" />
          </div>
        </div>
        <CardTitle className="text-2xl">Email Confirmation</CardTitle>
        <CardDescription>
          {`We've sent a confirmation link to `}
          <span className="font-medium text-primary">{user?.email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormAlert error={state?.error} success={state?.success} />
              <ConfirmationListener />
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
                    Resending...
                  </>
                ) : (
                  "Resend Confirmation Email"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button asChild className="w-full" variant="outline">
          <Link href="/signin">
            <ArrowLeft data-testid="arrow-left-icon" /> Back to Sign In
          </Link>
        </Button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Please click the link in your email to verify your account.
          </p>
          <p className="text-xs text-muted-foreground">
            {`Once verified, you'll be automatically redirected.`}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
