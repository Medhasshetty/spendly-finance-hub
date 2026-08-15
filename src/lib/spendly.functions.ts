import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  fetchTransactions,
  insertTransaction,
  modifyTransaction,
  removeTransaction,
  fetchCategories,
  summaryFor,
  analyticsFor,
  transactionInput,
  rangeInput,
} from "./spendly.server";

export const listTransactions = createServerFn({ method: "GET" }).handler(async () => fetchTransactions());

export const getCategories = createServerFn({ method: "GET" }).handler(async () => fetchCategories());

export const getDashboardSummary = createServerFn({ method: "GET" }).handler(async () => summaryFor());

export const getAnalytics = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => rangeInput.parse(data))
  .handler(async ({ data }) => analyticsFor(data.range));

export const createTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => transactionInput.parse(data))
  .handler(async ({ data }) => insertTransaction(data));

export const updateTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => transactionInput.extend({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => modifyTransaction(data.id, data));

export const deleteTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => removeTransaction(data.id));
