"use client";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
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
import { signup } from "@/app/(auth)/actions";
import Link from "next/link";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useUserStore } from "@/stores/userStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpValues } from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{state.error}</AlertTitle>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button
                            className="absolute left-0 top-0"
                            disabled
                            variant="ghost"
                          >
                            <User size={16} />
                          </Button>
                          <Input
                            className="pl-12"
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
