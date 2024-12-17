import { LoadingSkeleton } from "@/components/profile-setup/loading";

export default function Loading() {
  return (
    <LoadingSkeleton
      step={2}
      description="Financial Setup"
      backLink
      fieldsNumber={2}
    />
  );
}
