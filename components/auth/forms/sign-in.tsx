"use client";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
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
import { startTransition, useActionState, useState } from "react";
import { signin } from "@/app/(auth)/actions";
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
import { signInSchema, SignInValues } from "@/utils/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export const SignInForm = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction, isPending] = useActionState(signin, null);
  const [showPassword, setShowPassword] = useState(false);

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
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{state.error}</AlertTitle>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <>
                          Password
                          <Button
                            asChild
                            className="p-0"
                            size="sm"
                            variant="link"
                          >
                            <Link href="/forgot-password">
                              Forgot password?
                            </Link>
                          </Button>
                        </>
                      </FormLabel>
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
