"use client";

import { useEffect, useState } from "react";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EmailConfirmed = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Close tab when countdown reaches 0
          window.close();
          // If window.close() doesn't work (due to browser restrictions),
          // we'll keep showing 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <div
            className="rounded-full bg-blue-100 p-5"
            data-testid="icon-container"
          >
            <CheckCircle2
              className="h-8 w-8 text-primary"
              data-testid="check-circle-icon"
            />
          </div>
        </div>
        <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-6 text-sm text-muted-foreground">
          Your email has been successfully verified. You can now close this tab
          and return to the application.
        </p>
        <p className="text-sm text-secondary-foreground">
          This tab will automatically close in {countdown} seconds...
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full" onClick={() => window.close()}>
          Close Tab
        </Button>
        <p className="text-xs text-muted-foreground">
          {`If the tab doesn't close automatically, you can safely close it
          manually.`}
        </p>
      </CardFooter>
    </Card>
  );
};
