import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "neutral",
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent?: "neutral" | "income" | "expense" | "brand";
  loading?: boolean;
}) {
  const accentClass = {
    neutral: "bg-muted text-muted-foreground",
    income: "bg-income/10 text-income",
    expense: "bg-expense/10 text-expense",
    brand: "bg-accent text-accent-foreground",
  }[accent];

  return (
    <div className="card-surface p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-muted-foreground">{label}</p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accentClass}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-32" />
      ) : (
        <p className="num mt-3 text-[32px] leading-none font-semibold text-navy">{value}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
