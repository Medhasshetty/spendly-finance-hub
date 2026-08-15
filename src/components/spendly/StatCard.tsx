import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "neutral",
  loading,
  trend,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent?: "neutral" | "income" | "expense" | "brand";
  loading?: boolean;
  trend?: { value: string; positive?: boolean };
}) {
  const accentStyles: Record<
    string,
    { icon: string; ring: string; gradient: string; text: string; badge: string }
  > = {
    neutral: {
      icon: "bg-muted text-muted-foreground",
      ring: "ring-muted-foreground/10",
      gradient: "from-muted to-muted/40",
      text: "text-foreground",
      badge: "bg-muted text-muted-foreground",
    },
    income: {
      icon: "bg-gradient-to-br from-income/15 to-emerald-400/10 text-income ring-income/20",
      ring: "ring-income/20",
      gradient: "from-income/15 via-emerald-400/10 to-transparent",
      text: "text-income",
      badge: "bg-income/10 text-income border-income/20",
    },
    expense: {
      icon: "bg-gradient-to-br from-expense/15 to-rose-400/10 text-expense ring-expense/20",
      ring: "ring-expense/20",
      gradient: "from-expense/15 via-rose-400/10 to-transparent",
      text: "text-expense",
      badge: "bg-expense/10 text-expense border-expense/20",
    },
    brand: {
      icon: "bg-gradient-to-br from-primary/15 via-violet-500/10 to-brand/10 text-primary ring-primary/25",
      ring: "ring-primary/25",
      gradient: "from-primary/15 via-violet-500/10 to-transparent",
      text: "text-primary",
      badge: "bg-primary/10 text-primary border-primary/20",
    },
  }[accent];

  const displayValue = value && value.trim().length > 0 ? value : "₹0";

  return (
    <div className="card-surface group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${accentStyles.gradient} opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-90`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${accentStyles.icon} transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${accentStyles.ring}`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          </span>
        </div>

        {loading ? (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-9 w-[75%] rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ) : (
          <>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p
                className={`num overflow-hidden text-3xl font-bold leading-none tracking-tight ${accentStyles.text} sm:text-[34px]`}
              >
                <span>{displayValue}</span>
              </p>
              {trend && (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${accentStyles.badge}`}
                >
                  {trend.value}
                </span>
              )}
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}
