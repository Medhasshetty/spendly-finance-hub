import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useDeleteTransaction } from "@/hooks/use-spendly";
import type { Transaction } from "@/lib/spendly-core";

export function DeleteTransactionDialog({
  transaction,
  onOpenChange,
}: {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}) {
  const remove = useDeleteTransaction();

  return (
    <AlertDialog open={Boolean(transaction)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. {transaction?.description || transaction?.category} will be
            permanently removed and your balance recalculated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={remove.isPending}
            onClick={async (event) => {
              event.preventDefault();
              if (!transaction) return;
              try {
                await remove.mutateAsync(transaction.id);
                toast.success("Transaction deleted successfully.");
                onOpenChange(false);
              } catch {
                toast.error("Could not delete the transaction.");
              }
            }}
          >
            {remove.isPending ? "Deleting…" : "Delete Transaction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
