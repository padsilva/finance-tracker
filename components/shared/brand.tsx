import Image from "next/image";

interface BrandProps {
  withLogo?: boolean;
}

export const Brand: React.FC<BrandProps> = ({ withLogo = true }) => (
  <div className="flex items-center gap-3">
    {withLogo ? (
      <Image
        data-testid="brand-logo"
        src="/icon.svg"
        alt="FinanceTracker Logo"
        width={32}
        height={32}
        priority
      />
    ) : null}
    <span className="text-lg font-bold md:text-xl">FinanceTracker</span>
  </div>
);
