import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createTransaction,
  deleteTransaction,
  getAnalytics,
  getCategories,
  getDashboardSummary,
  listTransactions,
  updateTransaction,
} from "@/lib/spendly.functions";
import type { RangeKey } from "@/lib/spendly-core";

export function useTransactions() {
  const fn = useServerFn(listTransactions);
  return useQuery({ queryKey: ["spendly", "transactions"], queryFn: () => fn({}) });
}

export function useSummary() {
  const fn = useServerFn(getDashboardSummary);
  return useQuery({ queryKey: ["spendly", "summary"], queryFn: () => fn({}) });
}

export function useAnalytics(range: RangeKey) {
  const fn = useServerFn(getAnalytics);
  return useQuery({
    queryKey: ["spendly", "analytics", range],
    queryFn: () => fn({ data: { range } }),
  });
}

export function useCategories() {
  const fn = useServerFn(getCategories);
  return useQuery({ queryKey: ["spendly", "categories"], queryFn: () => fn({}) });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["spendly"] });
}

export function useCreateTransaction() {
  const fn = useServerFn(createTransaction);
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (data: Parameters<typeof createTransaction>[0]["data"]) => fn({ data }),
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction() {
  const fn = useServerFn(updateTransaction);
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateTransaction>[0]["data"]) => fn({ data }),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const fn = useServerFn(deleteTransaction);
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: invalidate,
  });
}
