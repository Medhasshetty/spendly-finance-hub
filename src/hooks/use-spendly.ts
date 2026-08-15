import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { spendlyApi, type ApiTransactionPayload } from "@/lib/api";
import {
  computeAnalytics,
  computeSummary,
  type Analytics,
  type Category,
  type RangeKey,
  type Summary,
  type Transaction,
  type TxType,
} from "@/lib/spendly-core";

export type TransactionPayload = {
  type: TxType;
  category: string;
  amount: number;
  date: string;
  description: string | null;
};

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["spendly", "transactions"],
    queryFn: () => spendlyApi.getTransactions(),
  });
}

export function useSummary() {
  return useQuery<{ summary: Summary; recent: Transaction[] }>({
    queryKey: ["spendly", "summary"],
    queryFn: async () => {
      try {
        const [apiSummary, rows] = await Promise.all([
          spendlyApi.getSummary(),
          spendlyApi.getTransactions(),
        ]);

        const computed = computeSummary(rows);
        const income = Number(apiSummary.income ?? computed.income);
        const expenses = Number(apiSummary.expenses ?? computed.expenses);
        const balance = Number(apiSummary.balance ?? (income - expenses));
        const savingsRate =
          income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 1000) / 10) : 0;

        return {
          summary: {
            income,
            expenses,
            balance,
            savingsRate,
            transactionCount: rows.length,
          },
          recent: rows.slice(0, 5),
        };
      } catch (err) {
        console.error("Failed to load summary from Flask API:", err);
        // Fallback gracefully to default empty values rather than throwing undefined
        return {
          summary: {
            income: 0,
            expenses: 0,
            balance: 0,
            savingsRate: 0,
            transactionCount: 0,
          },
          recent: [],
        };
      }
    },
  });
}

export function useAnalytics(range: RangeKey = "6m") {
  return useQuery<Analytics>({
    queryKey: ["spendly", "analytics", range],
    queryFn: async () => {
      const rows = await spendlyApi.getTransactions();
      return computeAnalytics(rows);
    },
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["spendly", "categories"],
    queryFn: async () => {
      const rows = await spendlyApi.getTransactions();
      const catMap = new Map<string, Category>();
      for (const tx of rows) {
        const key = `${tx.type}:${tx.category}`;
        if (!catMap.has(key)) {
          catMap.set(key, { id: key, name: tx.category, type: tx.type });
        }
      }
      return Array.from(catMap.values());
    },
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["spendly"] });
}

export function useCreateTransaction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (data: ApiTransactionPayload) => spendlyApi.createTransaction(data),
    onSuccess: () => {
      invalidate();
    },
  });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (data: ApiTransactionPayload & { id: string }) =>
      spendlyApi.updateTransaction(data.id, data),
    onSuccess: () => {
      invalidate();
    },
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => spendlyApi.deleteTransaction(id),
    onSuccess: () => {
      invalidate();
    },
  });
}
