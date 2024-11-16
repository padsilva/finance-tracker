"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { startTransition, useActionState } from "react";
import { forgotPassword } from "@/app/(auth)/actions";
import Link from "next/link";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{state.error}</AlertTitle>
                  </Alert>
                )}
                {state?.success && (
                  <Alert variant="default">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>{state.success}</AlertTitle>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button
                            className="absolute left-0 top-0"
                            disabled
                            variant="ghost"
                          >
                            <Mail size={16} />
                          </Button>
                          <Input
                            className="pl-12"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
