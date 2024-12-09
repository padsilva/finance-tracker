import { LoadingSkeleton } from "@/components/profile-setup/loading";

export default function Loading() {
  return (
    <LoadingSkeleton
      step={1}
      description="Personal Information"
      fieldsNumber={4}
    />
  );
}
