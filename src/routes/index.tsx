import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Plus, TrendingDown, TrendingUp, Wallet, PiggyBank, Receipt, Target, Flame } from "lucide-react";
import { AppShell, PageHeader } from "@/components/spendly/AppShell";
import { StatCard } from "@/components/spendly/StatCard";
import { EmptyState } from "@/components/spendly/EmptyState";
import { TransactionDialog } from "@/components/spendly/TransactionDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAnalytics, useSummary } from "@/hooks/use-spendly";
import { CATEGORY_COLORS, formatDate, formatINR } from "@/lib/spendly-core";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Spendly" },
      {
        name: "description",
        content: "See your balance, income, expenses and savings rate at a glance in Spendly.",
      },
      { property: "og:title", content: "Dashboard — Spendly" },
      {
        property: "og:description",
        content: "See your balance, income, expenses and savings rate at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-5">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-5 h-[280px] w-full">{children}</div>
    </section>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E2E8F0",
  boxShadow: "0 8px 24px -12px rgba(15,23,42,0.2)",
  fontSize: 12,
};

function Dashboard() {
  const [open, setOpen] = useState(false);
  const summaryQuery = useSummary();
  const analyticsQuery = useAnalytics("6m");

  const summary = summaryQuery.data?.summary;
  const recent = summaryQuery.data?.recent ?? [];
  const analytics = analyticsQuery.data;
  const isEmpty = summaryQuery.isSuccess && summary?.transactionCount === 0;

  const savingsRate = summary?.savingsRate ?? 0;
  const savingsMood =
    savingsRate >= 40 ? { text: "Excellent!", emoji: "🚀", variant: "income" as const }
    : savingsRate >= 25 ? { text: "Great work!", emoji: "🌟", variant: "income" as const }
    : savingsRate >= 15 ? { text: "On track", emoji: "💪", variant: "brand" as const }
    : savingsRate > 0 ? { text: "Room to improve", emoji: "🎯", variant: "neutral" as const }
    : { text: "Spending more than you earn", emoji: "⚠️", variant: "expense" as const };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <PageHeader
        title="Spendly Dashboard"
        subtitle={`Track every rupee, grow every month · ${today}`}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge
              variant="outline"
              className={`gap-1.5 border-2 px-3 py-1.5 text-[11px] ${
                savingsMood.variant === "income"
                  ? "border-income/30 bg-income/10 text-income"
                  : savingsMood.variant === "brand"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : savingsMood.variant === "expense"
                  ? "border-expense/30 bg-expense/10 text-expense"
                  : "border-muted-foreground/20 bg-muted text-muted-foreground"
              }`}
            >
              {savingsMood.emoji} <span className="font-semibold">{savingsMood.text}</span>
            </Badge>
            <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          </div>
        }
      />

      {isEmpty ? (
        <div className="card-surface">
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Start tracking your finances by adding your first transaction."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Current Balance"
              value={formatINR(summary?.balance ?? 0)}
              hint="Income minus expenses, all time"
              icon={Wallet}
              accent="brand"
              loading={summaryQuery.isLoading}
            />
            <StatCard
              label="Total Income"
              value={formatINR(summary?.income ?? 0)}
              hint={`${summary?.transactionCount ?? 0} transactions recorded`}
              icon={TrendingUp}
              accent="income"
              loading={summaryQuery.isLoading}
            />
            <StatCard
              label="Total Expenses"
              value={formatINR(summary?.expenses ?? 0)}
              hint="Everything you've spent so far"
              icon={TrendingDown}
              accent="expense"
              loading={summaryQuery.isLoading}
            />
            <StatCard
              label="Savings Rate"
              value={`${summary?.savingsRate ?? 0}%`}
              hint="Share of income you kept"
              icon={PiggyBank}
              accent="neutral"
              loading={summaryQuery.isLoading}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ChartCard title="Income vs Expenses" subtitle="Last 6 months">
              {analyticsQuery.isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : analytics && analytics.monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthly} barGap={6}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="#64748B"
                      width={56}
                      tickFormatter={(v: number) => formatINR(v, { compact: true })}
                    />
                    <Tooltip
                      cursor={{ fill: "#F8FAFC" }}
                      contentStyle={tooltipStyle}
                      formatter={(value: number, name: string) => [formatINR(value), name]}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="expenses" name="Expenses" fill="#EC4899" radius={[8, 8, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={TrendingUp} title="No data yet" description="Add transactions to see monthly trends." />
              )}
            </ChartCard>

            <ChartCard title="Expense Breakdown" subtitle="Where your money went">
              {analyticsQuery.isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : analytics && analytics.expenseBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.expenseBreakdown}
                      dataKey="total"
                      nameKey="category"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {analytics.expenseBreakdown.map((slice) => (
                        <Cell key={slice.category} fill={CATEGORY_COLORS[slice.category] ?? "#94A3B8"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatINR(value)} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={Receipt} title="No expenses yet" description="Your category split appears here." />
              )}
            </ChartCard>
          </div>

          <section className="card-surface mt-6 overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="min-w-0 truncate text-base font-semibold text-navy">Recent Transactions</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Your latest financial activity</p>
              </div>
              <Link
                to="/transactions"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            {summaryQuery.isLoading ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((tx) => (
                  <li key={tx.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {tx.description || tx.category}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(tx.date)} · {tx.category}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          tx.type === "income"
                            ? "border-income/30 bg-income/10 text-income"
                            : "border-expense/30 bg-expense/10 text-expense"
                        }
                      >
                        {tx.type === "income" ? "Income" : "Expense"}
                      </Badge>
                      <span
                        className={`num text-sm font-semibold ${tx.type === "income" ? "text-income" : "text-expense"}`}
                      >
                        {formatINR(tx.type === "income" ? tx.amount : -tx.amount, { signed: true })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <TransactionDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
