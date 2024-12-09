import { Loader2, ArrowRight, ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";

import { StaticProgressBar } from "@/components/profile-setup/progress-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface BaseFormProps {
  step: number;
  description: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  backLink?: string;
  submitLabel?: string;
  children: React.ReactNode;
}

export const BaseForm = ({
  step,
  description,
  icon,
  title,
  subtitle,
  isPending,
  onSubmit,
  backLink,
  submitLabel = "Continue",
  children,
}: BaseFormProps) => {
  const Icon = icon;

  return (
    <div className="mx-auto sm:w-[500px]">
      <StaticProgressBar step={step} description={description} />
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full p-5">
              <Icon
                className="h-12 w-12 text-primary"
                data-testid="base-form-icon"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            className="space-y-8"
            onSubmit={onSubmit}
            data-testid="base-form"
          >
            {children}
            <div className="flex justify-between">
              {backLink && (
                <Button asChild variant="ghost">
                  <Link href={backLink}>
                    <ArrowLeft data-testid="arrow-left-icon" /> Back
                  </Link>
                </Button>
              )}
              <Button
                disabled={isPending}
                type="submit"
                className={!backLink ? "ml-auto" : ""}
              >
                {isPending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      data-testid="loader-icon"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    {submitLabel}
                    <ArrowRight data-testid="arrow-right-icon" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
