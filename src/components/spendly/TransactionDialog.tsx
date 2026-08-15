import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Transaction,
  type TxType,
} from "@/lib/spendly-core";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-spendly";
import { ApiError } from "@/lib/api";

type Errors = Partial<Record<"type" | "category" | "amount" | "date", string>>;

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}) {
  const isEdit = Boolean(transaction);
  const [type, setType] = useState<TxType>("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const pending = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setType(transaction?.type ?? "expense");
    setCategory(transaction?.category ?? "");
    setAmount(transaction ? String(transaction.amount) : "");
    setDate(transaction?.date ?? today());
    setDescription(transaction?.description ?? "");
  }, [open, transaction]);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function validate(): Errors {
    const next: Errors = {};
    if (!type || (type !== "income" && type !== "expense")) {
      next.type = "Transaction type is required.";
    }
    if (!category || !category.trim()) {
      next.category = "Category is required.";
    }
    const parsed = Number(amount);
    if (!amount.trim()) {
      next.amount = "Amount is required.";
    } else if (!Number.isFinite(parsed) || parsed <= 0) {
      next.amount = "Amount must be greater than 0.";
    }
    if (!date || !date.trim()) {
      next.date = "Date is required.";
    }
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      type,
      category: category.trim(),
      amount: Math.round(Number(amount) * 100) / 100,
      date: date.trim(),
      description: description.trim() || null,
    };

    try {
      if (isEdit && transaction) {
        await update.mutateAsync({ ...payload, id: transaction.id });
        toast.success("Transaction updated successfully!");
      } else {
        await create.mutateAsync(payload);
        toast.success(
          `${type === "income" ? "Income" : "Expense"} transaction added successfully!`
        );
      }
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.fields) {
          setErrors(err.fields as Errors);
        }
        toast.error(err.message || "Failed to save transaction.");
      } else if (err instanceof Error) {
        toast.error(err.message || "Something went wrong. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this entry in your financial tracker."
              : "Record a new income or expense in your financial tracker."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="tx-type" className="font-semibold">
              Transaction type <span className="text-destructive">*</span>
            </Label>
            <div
              className="grid grid-cols-2 gap-2"
              id="tx-type"
              role="group"
              aria-label="Transaction type"
            >
              {(["expense", "income"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={type === option}
                  onClick={() => {
                    setType(option);
                    setCategory("");
                    if (errors.type) {
                      setErrors((prev) => ({ ...prev, type: undefined }));
                    }
                  }}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-all ${
                    type === option
                      ? option === "income"
                        ? "border-income bg-income/10 text-income font-semibold shadow-sm"
                        : "border-expense bg-expense/10 text-expense font-semibold shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {option === "income" ? "+ Income" : "− Expense"}
                </button>
              ))}
            </div>
            {errors.type ? <p className="text-xs font-medium text-destructive">{errors.type}</p> : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tx-category" className="font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={(val) => {
                  setCategory(val);
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }
                }}
              >
                <SelectTrigger id="tx-category" aria-invalid={Boolean(errors.category)}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category ? (
                <p className="text-xs font-medium text-destructive">{errors.category}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tx-amount" className="font-semibold">
                Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tx-amount"
                inputMode="decimal"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.amount)}
              />
              {errors.amount ? (
                <p className="text-xs font-medium text-destructive">{errors.amount}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-date" className="font-semibold">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) {
                  setErrors((prev) => ({ ...prev, date: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date ? (
              <p className="text-xs font-medium text-destructive">{errors.date}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-description" className="font-semibold">
              Description (optional)
            </Label>
            <Textarea
              id="tx-description"
              rows={2}
              maxLength={200}
              placeholder="e.g. Monthly salary, Grocery shopping, Coffee with friends"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save Changes" : "Save Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
