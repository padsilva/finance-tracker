"use client";

import { ErrorBoundary } from "@/components/profile-setup/error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError(props: Readonly<ErrorProps>) {
  return <ErrorBoundary {...props} />;
}
