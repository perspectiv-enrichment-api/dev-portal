import { Navbar } from "@/components/auth/auth-navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-12 sm:pt-20 md:pt-28">
        {children}
      </main>
    </div>
  );
}
