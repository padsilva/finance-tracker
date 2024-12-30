import { Brand } from "@/components/shared/brand";
import { UserMenu } from "@/components/shared/user-menu";
import { createClient } from "@/lib/supabase/server";

export async function NavBar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b bg-nav-footer">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
        <Brand />

        <UserMenu
          email={user?.email ?? ""}
          name={user?.user_metadata.full_name ?? "User"}
        />
      </div>
    </nav>
  );
}
