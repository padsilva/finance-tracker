"use client";

import { useEffect } from "react";

import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertButton,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  error,
  reset,
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert className="[&>svg]:top-4 [&>svg~*]:pl-0" variant="destructive">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg">Something went wrong!</AlertTitle>
      </div>
      <AlertDescription>
        Failed to load form data. Please try again.
      </AlertDescription>
      <AlertButton onClick={reset}>Try Again</AlertButton>
    </Alert>
  );
};
