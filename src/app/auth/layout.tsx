import { Video } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Video className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">YCS</span>
          </Link>
          <p className="text-sm text-muted-foreground">Youtube Creator Studio</p>
        </div>
        {children}
      </div>
    </div>
  );
}
