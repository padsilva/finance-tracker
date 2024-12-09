"use client";

import { ErrorBoundary } from "@/components/profile-setup/error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PersonalError(props: Readonly<ErrorProps>) {
  return <ErrorBoundary {...props} />;
}
