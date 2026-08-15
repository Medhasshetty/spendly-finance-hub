import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Receipt, Search, SearchX, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/spendly/AppShell";
import { EmptyState } from "@/components/spendly/EmptyState";
import { TransactionDialog } from "@/components/spendly/TransactionDialog";
import { DeleteTransactionDialog } from "@/components/spendly/DeleteTransactionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/use-spendly";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  formatDate,
  formatINR,
  type Transaction,
} from "@/lib/spendly-core";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Spendly" },
      { name: "description", content: "Search, filter, edit and delete every income and expense entry." },
      { property: "og:title", content: "Transactions — Spendly" },
      { property: "og:description", content: "Manage and review your financial activity." },
    ],
  }),
  component: TransactionsPage,
});

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];
const PAGE_SIZE = 8;

type SortKey = "newest" | "oldest" | "amount-high" | "amount-low";

function TransactionsPage() {
  const { data, isLoading } = useTransactions();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = (data ?? []).filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (category !== "all" && tx.category !== category) return false;
      if (from && tx.date < from) return false;
      if (to && tx.date > to) return false;
      if (term) {
        const haystack = `${tx.description ?? ""} ${tx.category} ${tx.amount}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === "amount-high") return b.amount - a.amount;
      if (sort === "amount-low") return a.amount - b.amount;
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [data, search, type, category, from, to, sort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = Boolean(search || from || to) || type !== "all" || category !== "all";

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setDialogOpen(true);
  };

  return (
    <AppShell>
      <PageHeader
        title="Transactions"
        subtitle="Manage and review your financial activity."
        action={
          <Button onClick={openAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        }
      />

      <section className="card-surface mb-4 p-4">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label htmlFor="tx-search" className="sr-only">
              Search transactions
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tx-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search description, category or amount"
                className="pl-9"
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
              <SelectTrigger aria-label="Filter by type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {ALL_CATEGORIES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:col-span-2">
            <Input type="date" aria-label="From date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" aria-label="To date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="lg:col-span-2">
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="amount-high">Amount: high to low</SelectItem>
                <SelectItem value="amount-low">Amount: low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="card-surface overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No matching transactions"
              description="Try a different search term, category or date range."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setType("all");
                    setCategory("all");
                    setFrom("");
                    setTo("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Start tracking your finances by adding your first transaction."
              action={
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4" /> Add Transaction
                </Button>
              }
            />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <caption className="sr-only">Your transactions</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-medium">Date</th>
                    <th scope="col" className="px-5 py-3 font-medium">Description</th>
                    <th scope="col" className="px-5 py-3 font-medium">Category</th>
                    <th scope="col" className="px-5 py-3 font-medium">Type</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((tx) => (
                    <tr key={tx.id} className="transition-colors hover:bg-muted/40">
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDate(tx.date)}</td>
                      <td className="max-w-[280px] px-5 py-3.5 font-medium text-foreground">
                        <span className="block truncate">{tx.description || tx.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{tx.category}</td>
                      <td className="px-5 py-3.5">
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
                      </td>
                      <td
                        className={`num whitespace-nowrap px-5 py-3.5 text-right font-semibold ${
                          tx.type === "income" ? "text-income" : "text-expense"
                        }`}
                      >
                        {formatINR(tx.type === "income" ? tx.amount : -tx.amount, { signed: true })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${tx.description || tx.category}`}
                            onClick={() => openEdit(tx)}
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${tx.description || tx.category}`}
                            className="text-expense hover:bg-expense/10 hover:text-expense"
                            onClick={() => setDeleting(tx)}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-5 py-3">
              <p className="min-w-0 text-xs text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, rows.length)} of{" "}
                {rows.length}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editing} />
      <DeleteTransactionDialog transaction={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </AppShell>
  );
}
