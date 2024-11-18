"use client";

import { startTransition, useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { signup } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUserStore } from "@/stores/userStore";
import { signUpSchema, SignUpValues } from "@/utils/validation-schema";

import { FormAlert } from "./ui/form-alert";
import { InputField } from "./ui/input-field";

export const SignUpForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [state, formAction, isPending] = useActionState(signup, null);

  const onSubmit = (data: SignUpValues) => {
    const { email, fullName: name } = data;
    setUser({ email, name });

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
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Start managing your finances today</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full items-center gap-4">
                <FormAlert error={state?.error} />
                <InputField
                  control={form.control}
                  icon={<User size={16} />}
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                />
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
                <InputField
                  control={form.control}
                  icon={<Lock size={16} />}
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                />
              </div>
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?
        </p>
        <Button asChild className="p-1" variant="link">
          <Link href="/signin">Sign In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
