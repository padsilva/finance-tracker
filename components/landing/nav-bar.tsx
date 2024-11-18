"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const NavBar: React.FC = () => {
  const path = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
          <>
            <div className="hidden gap-4 md:flex">
              <Button asChild className="text-muted-foreground" variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden [&_svg]:size-6"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </>
        ) : null}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && path !== "/email-confirmed" && (
        <div className="border-t dark:border-background md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            <Button
              asChild
              className="w-full text-muted-foreground"
              variant="ghost"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
