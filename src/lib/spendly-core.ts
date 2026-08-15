export type TxType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TxType;
  category: string;
  amount: number;
  date: string;
  description: string | null;
};

export type Category = { id: string; name: string; type: TxType };

export type RangeKey = "this-month" | "last-month" | "3m" | "6m" | "year" | "all";

export const RANGE_LABELS: Record<RangeKey, string> = {
  "this-month": "This Month",
  "last-month": "Last Month",
  "3m": "Last 3 Months",
  "6m": "Last 6 Months",
  year: "This Year",
  all: "All Time",
};

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Other",
] as const;

/** Chart palette: restrained brand + muted complements. */
export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10B981",
  Travel: "#0F172A",
  Shopping: "#F43F5E",
  Bills: "#059669",
  Entertainment: "#64748B",
  Healthcare: "#22C55E",
  Education: "#334155",
  Other: "#94A3B8",
  Salary: "#10B981",
  Freelance: "#059669",
  Business: "#0F172A",
  Investment: "#22C55E",
};

export type Summary = {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  transactionCount: number;
};

export type MonthlyPoint = { month: string; income: number; expenses: number };
export type CategorySlice = { category: string; total: number; count: number };

export type Analytics = {
  summary: Summary;
  monthly: MonthlyPoint[];
  expenseBreakdown: CategorySlice[];
  incomeBreakdown: CategorySlice[];
  topCategory: CategorySlice | null;
  averageMonthlyExpense: number;
};

/** Money is summed as integer paise to avoid float drift. */
export const toPaise = (rupees: number) => Math.round(rupees * 100);
export const toRupees = (paise: number) => paise / 100;

export function formatINR(value: number, opts: { signed?: boolean; compact?: boolean } = {}) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.compact ? 0 : 2,
    minimumFractionDigits: 0,
    notation: opts.compact ? "compact" : "standard",
  }).format(Math.abs(value));
  if (!opts.signed) return formatted;
  return `${value < 0 ? "−" : "+"}${formatted}`;
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function rangeBounds(range: RangeKey, today = new Date()): { from: string | null; to: string | null } {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const y = today.getFullYear();
  const m = today.getMonth();
  switch (range) {
    case "this-month":
      return { from: iso(new Date(y, m, 1)), to: iso(new Date(y, m + 1, 0)) };
    case "last-month":
      return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
    case "3m":
      return { from: iso(new Date(y, m - 2, 1)), to: iso(new Date(y, m + 1, 0)) };
    case "6m":
      return { from: iso(new Date(y, m - 5, 1)), to: iso(new Date(y, m + 1, 0)) };
    case "year":
      return { from: iso(new Date(y, 0, 1)), to: iso(new Date(y, 11, 31)) };
    default:
      return { from: null, to: null };
  }
}

export function computeSummary(rows: Transaction[]): Summary {
  let incomeP = 0;
  let expenseP = 0;
  for (const row of rows) {
    const paise = toPaise(Number(row.amount));
    if (row.type === "income") incomeP += paise;
    else expenseP += paise;
  }
  const balanceP = incomeP - expenseP;
  const savingsRate = incomeP > 0 ? Math.round((balanceP / incomeP) * 1000) / 10 : 0;
  return {
    income: toRupees(incomeP),
    expenses: toRupees(expenseP),
    balance: toRupees(balanceP),
    savingsRate,
    transactionCount: rows.length,
  };
}

export function computeAnalytics(rows: Transaction[]): Analytics {
  const summary = computeSummary(rows);

  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  for (const row of rows) {
    const key = row.date.slice(0, 7);
    const bucket = monthlyMap.get(key) ?? { income: 0, expenses: 0 };
    const paise = toPaise(Number(row.amount));
    if (row.type === "income") bucket.income += paise;
    else bucket.expenses += paise;
    monthlyMap.set(key, bucket);
  }
  const monthly: MonthlyPoint[] = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      month: new Date(`${key}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      income: toRupees(v.income),
      expenses: toRupees(v.expenses),
    }));

  const bucketBy = (type: TxType): CategorySlice[] => {
    const map = new Map<string, { total: number; count: number }>();
    for (const row of rows) {
      if (row.type !== type) continue;
      const cur = map.get(row.category) ?? { total: 0, count: 0 };
      cur.total += toPaise(Number(row.amount));
      cur.count += 1;
      map.set(row.category, cur);
    }
    return [...map.entries()]
      .map(([category, v]) => ({ category, total: toRupees(v.total), count: v.count }))
      .sort((a, b) => b.total - a.total);
  };

  const expenseBreakdown = bucketBy("expense");
  const monthsWithExpense = monthly.filter((m) => m.expenses > 0).length || 1;

  return {
    summary,
    monthly,
    expenseBreakdown,
    incomeBreakdown: bucketBy("income"),
    topCategory: expenseBreakdown[0] ?? null,
    averageMonthlyExpense: Math.round((summary.expenses / monthsWithExpense) * 100) / 100,
  };
}
