import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

import { UserMenu } from "./user-menu";

export async function NavBar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <span className="text-lg font-bold md:text-xl">FinanceTracker</span>
        </div>

        <UserMenu
          email={user?.email ?? ""}
          name={user?.user_metadata.full_name ?? "User"}
        />
      </div>
    </nav>
  );
}
