import { LoadingSkeleton } from "@/components/profile-setup/loading";

export default function Loading() {
  return (
    <LoadingSkeleton
      step={3}
      description="Categories"
      backLink
      checkboxesNumber={7}
    />
  );
}
