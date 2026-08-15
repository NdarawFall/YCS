import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 relative">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Logo size="lg" />
          <p className="text-xs font-medium text-muted-foreground tracking-wide">
            Le Studio des Créateurs YouTube
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
