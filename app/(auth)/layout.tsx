import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { NavBar } from "@/components/landing/nav-bar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto max-w-5xl px-8 py-12">
        <div className="flex flex-row gap-12">
          <HeroSection />
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
