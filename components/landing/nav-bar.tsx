"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar: React.FC = () => {
  const path = usePathname();

  return (
    <nav className="border-b bg-nav-footer">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/icon.svg"
            alt="FinanceTracker Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-xl font-bold">FinanceTracker</span>
        </div>
        {path !== "/email-confirmed" ? (
          <div className="flex gap-4">
            <Button asChild className="text-muted-foreground" variant="ghost">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};
