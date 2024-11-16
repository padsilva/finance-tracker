"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
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
import { startTransition, useActionState, useState } from "react";
import { resetPassword } from "@/app/(auth)/actions";
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
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [state, formAction, isPending] = useActionState(resetPassword, null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button
                            className="absolute left-0 top-0"
                            disabled
                            variant="ghost"
                          >
                            <Lock size={16} />
                          </Button>
                          <Input
                            className="pl-12"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            className="absolute right-0 top-0 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            variant="ghost"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button
                            className="absolute left-0 top-0"
                            disabled
                            variant="ghost"
                          >
                            <Lock size={16} />
                          </Button>
                          <Input
                            className="pl-12"
                            placeholder="Confirm your password"
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            className="absolute right-0 top-0 text-muted-foreground"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            type="button"
                            variant="ghost"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
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
            <ArrowLeft /> Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
