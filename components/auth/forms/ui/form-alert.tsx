import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormAlertProps {
  error?: string;
  success?: string;
}

export function FormAlert({ error, success }: Readonly<FormAlertProps>) {
  if (!error && !success) {
    return null;
  }

  const isError = !!error;
  const message = error ?? success;

  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
