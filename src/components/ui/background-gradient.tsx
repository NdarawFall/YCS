import { cn } from "@/lib/utils";

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-red-950/20 blur-[120px]" />
      <div className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-red-950/10 blur-[100px]" />
    </div>
  );
}
