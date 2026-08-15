import { z } from "zod";
import { getServerSupabase } from "./spendly-client";
import {
  computeAnalytics,
  computeSummary,
  rangeBounds,
  type Analytics,
  type Category,
  type RangeKey,
  type Summary,
  type Transaction,
} from "./spendly-core";

export const transactionInput = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(1).max(60),
  amount: z.number().positive().max(100000000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().trim().max(200).optional().nullable(),
});

export const rangeInput = z.object({
  range: z.enum(["this-month", "last-month", "3m", "6m", "year", "all"]).default("6m"),
});

type TransactionInput = z.infer<typeof transactionInput>;

function fail(message: string): never {
  // Never surface driver internals to the client.
  throw new Error(message);
}

export async function fetchTransactions(range: RangeKey = "all"): Promise<Transaction[]> {
  const supabase = getServerSupabase();
  const { from, to } = rangeBounds(range);
  let query = supabase
    .from("transactions")
    .select("id, type, category, amount, date, description")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  const { data, error } = await query;
  if (error) fail("Could not load transactions.");
  return (data ?? []).map((row) => ({ ...row, amount: Number(row.amount) })) as Transaction[];
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from("categories").select("id, name, type").order("name");
  if (error) fail("Could not load categories.");
  return (data ?? []) as Category[];
}

export async function summaryFor(): Promise<{ summary: Summary; recent: Transaction[] }> {
  const rows = await fetchTransactions("all");
  return { summary: computeSummary(rows), recent: rows.slice(0, 5) };
}

export async function analyticsFor(range: RangeKey): Promise<Analytics> {
  return computeAnalytics(await fetchTransactions(range));
}

export async function insertTransaction(input: TransactionInput) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("transactions").insert({
    type: input.type,
    category: input.category,
    amount: input.amount,
    date: input.date,
    description: input.description?.length ? input.description : null,
  });
  if (error) fail("Could not save the transaction.");
  return { ok: true };
}

export async function modifyTransaction(id: string, input: TransactionInput) {
  const supabase = getServerSupabase();
  const { error } = await supabase
    .from("transactions")
    .update({
      type: input.type,
      category: input.category,
      amount: input.amount,
      date: input.date,
      description: input.description?.length ? input.description : null,
    })
    .eq("id", id);
  if (error) fail("Could not update the transaction.");
  return { ok: true };
}

export async function removeTransaction(id: string) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) fail("Could not delete the transaction.");
  return { ok: true };
}
