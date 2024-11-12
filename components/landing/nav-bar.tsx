import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const NavBar: React.FC = () => (
  <nav className="border-b bg-nav-footer">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
      <div className="flex items-center space-x-3">
        <Image
          src="/icon.svg"
          alt="FinanceTracker Logo"
          width={32}
          height={32}
          priority
        />
        <span className="text-xl font-bold">FinanceTracker</span>
      </div>
      <div className="flex gap-4">
        <Button asChild className="text-muted-foreground" variant="ghost">
          <Link href="/">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  </nav>
);
