"use client";

import { ArrowLeft, Loader2, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { ConfirmationListener } from "@/components/auth/confirmation-listener";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { resendSchema, ResendValues } from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { resendVerificationEmail } from "@/app/(auth)/actions";
import { FormAlert } from "./ui/form-alert";

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

  const onSubmit = (data: ResendValues) => {
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
            <Mail className="h-8 w-8 text-primary" />
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
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
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
            <ArrowLeft /> Back to Sign In
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
