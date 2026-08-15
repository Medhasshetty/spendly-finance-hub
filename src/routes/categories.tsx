import { createFileRoute } from "@tanstack/react-router";
import {
  Utensils,
  Plane,
  ShoppingBag,
  ReceiptText,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  CircleDashed,
  Briefcase,
  Laptop,
  Building2,
  LineChart,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/spendly/AppShell";
import { EmptyState } from "@/components/spendly/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/use-spendly";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  formatINR,
  type TxType,
} from "@/lib/spendly-core";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Spendly" },
      { name: "description", content: "See how each income and expense category adds up." },
      { property: "og:title", content: "Categories — Spendly" },
      { property: "og:description", content: "How each category adds up across your activity." },
    ],
  }),
  component: CategoriesPage,
});

const ICONS: Record<string, LucideIcon> = {
  Food: Utensils,
  Travel: Plane,
  Shopping: ShoppingBag,
  Bills: ReceiptText,
  Entertainment: Clapperboard,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Other: CircleDashed,
  Salary: Briefcase,
  Freelance: Laptop,
  Business: Building2,
  Investment: LineChart,
};

function CategoryGrid({
  names,
  type,
  stats,
}: {
  names: readonly string[];
  type: TxType;
  stats: Map<string, { total: number; count: number }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {names.map((name) => {
        const Icon = ICONS[name] ?? CircleDashed;
        const stat = stats.get(`${type}:${name}`) ?? { total: 0, count: 0 };
        return (
          <div key={name} className="card-surface p-5 transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                  type === "income" ? "bg-income/10 text-income" : "bg-accent text-accent-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.count} {stat.count === 1 ? "transaction" : "transactions"}
                </p>
              </div>
            </div>
            <p
              className={`num mt-4 text-2xl font-semibold ${
                type === "income" ? "text-income" : "text-navy"
              }`}
            >
              {formatINR(stat.total)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function CategoriesPage() {
  const { data, isLoading } = useTransactions();

  const stats = new Map<string, { total: number; count: number }>();
  for (const tx of data ?? []) {
    const key = `${tx.type}:${tx.category}`;
    const cur = stats.get(key) ?? { total: 0, count: 0 };
    cur.total += Number(tx.amount);
    cur.count += 1;
    stats.set(key, cur);
  }

  return (
    <AppShell>
      <PageHeader title="Categories" subtitle="How each category adds up across your activity." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="card-surface">
          <EmptyState
            icon={Tags}
            title="No category activity yet"
            description="Once you add transactions, each category will show its totals here."
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Expense categories
            </h2>
            <CategoryGrid names={EXPENSE_CATEGORIES} type="expense" stats={stats} />
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Income categories
            </h2>
            <CategoryGrid names={INCOME_CATEGORIES} type="income" stats={stats} />
          </div>
          <p className="text-xs text-muted-foreground">
            Custom categories are coming soon — the data model already supports them.
          </p>
        </div>
      )}
    </AppShell>
  );
}
