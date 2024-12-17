import { NavBar } from "@/components/profile-setup/nav/nav-bar";
import { Footer } from "@/components/shared/footer";

export default function ProfileSetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto max-w-5xl px-8 py-12">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
