import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
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
import { BarChart3, PiggyBank, TrendingDown, Wallet } from "lucide-react";
import { AppShell, PageHeader } from "@/components/spendly/AppShell";
import { StatCard } from "@/components/spendly/StatCard";
import { EmptyState } from "@/components/spendly/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalytics } from "@/hooks/use-spendly";
import { CATEGORY_COLORS, RANGE_LABELS, formatINR, type RangeKey } from "@/lib/spendly-core";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Spendly" },
      { name: "description", content: "Spending trends, category breakdowns and savings insights." },
      { property: "og:title", content: "Analytics — Spendly" },
      { property: "og:description", content: "Understand where your money goes." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E2E8F0",
  boxShadow: "0 8px 24px -12px rgba(15,23,42,0.2)",
  fontSize: 12,
};

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="card-surface p-5">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-5 h-[280px] w-full">{children}</div>
    </section>
  );
}

function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("6m");
  const { data, isLoading } = useAnalytics(range);
  const hasData = Boolean(data && data.summary.transactionCount > 0);

  return (
    <AppShell>
      <PageHeader
        title="Analytics"
        subtitle="Understand where your money goes."
        action={
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {RANGE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {!isLoading && !hasData ? (
        <div className="card-surface">
          <EmptyState
            icon={BarChart3}
            title="No analytics for this period"
            description="Pick a different date range or add transactions to see your insights."
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Highest Spending Category"
              value={data?.topCategory?.category ?? "—"}
              hint={data?.topCategory ? `${formatINR(data.topCategory.total)} across ${data.topCategory.count} entries` : "No expenses in range"}
              icon={TrendingDown}
              accent="expense"
              loading={isLoading}
            />
            <StatCard
              label="Average Monthly Expense"
              value={formatINR(data?.averageMonthlyExpense ?? 0)}
              hint="Across months with activity"
              icon={Wallet}
              accent="neutral"
              loading={isLoading}
            />
            <StatCard
              label="Savings Rate"
              value={`${data?.summary.savingsRate ?? 0}%`}
              hint="Kept out of income earned"
              icon={PiggyBank}
              accent="brand"
              loading={isLoading}
            />
            <StatCard
              label="Net Position"
              value={formatINR(data?.summary.balance ?? 0)}
              hint={`${data?.summary.transactionCount ?? 0} transactions in range`}
              icon={BarChart3}
              accent="income"
              loading={isLoading}
            />
          </div>

          <div className="mt-6 grid gap-4">
            <Panel title="Monthly Spending Trend" subtitle={RANGE_LABELS[range]}>
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.monthly ?? []}>
                    <defs>
                      <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="#64748B"
                      width={56}
                      tickFormatter={(v: number) => formatINR(v, { compact: true })}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatINR(value), "Expenses"]} />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      fill="url(#spendFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Income vs Expenses" subtitle="Monthly comparison">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.monthly ?? []} barGap={6}>
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
                      <Bar dataKey="income" name="Income" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={22} />
                      <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Panel>

              <Panel title="Expense Category Breakdown" subtitle="Share of total spending">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.expenseBreakdown ?? []}
                        dataKey="total"
                        nameKey="category"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {(data?.expenseBreakdown ?? []).map((slice) => (
                          <Cell key={slice.category} fill={CATEGORY_COLORS[slice.category] ?? "#94A3B8"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatINR(value)} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Panel>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
