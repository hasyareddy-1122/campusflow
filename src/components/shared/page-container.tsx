import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("container mx-auto py-6 md:py-8 space-y-6", className)}>
      {children}
    </div>
  );
}
