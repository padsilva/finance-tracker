"use client";

import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
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
import { signin } from "@/app/(auth)/actions";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { signInSchema, SignInValues } from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "./ui/input-field";
import { FormAlert } from "./ui/form-alert";

export const SignInForm = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction, isPending] = useActionState(signin, null);

  const onSubmit = (data: SignInValues) => {
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
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full items-center gap-4">
                <FormAlert error={state?.error} />
                <InputField
                  control={form.control}
                  icon={<Mail size={16} />}
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                />
                <InputField
                  control={form.control}
                  icon={<Lock size={16} />}
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight />
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
