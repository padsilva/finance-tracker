import { LoadingSkeleton } from "@/components/profile-setup/loading";

export default function Loading() {
  return (
    <LoadingSkeleton step={4} description="Goals" backLink fieldsNumber={2} />
  );
}
