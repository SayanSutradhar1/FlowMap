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
import { useRecoverCashMutation } from "@/services/cash.service";
import { memo, useState } from "react";
import { toast } from "sonner";

interface CashRecoveryModalProps {
    id: string;
    expenseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loading?: boolean;
}

const CashRecoveryModal = ({
    id,
    expenseId,
    open,
    onOpenChange,
    loading = false,
}: CashRecoveryModalProps) => {
    const [description, setDescription] = useState("");

    const [recoverCash] = useRecoverCashMutation({
        fixedCacheKey : "Expense"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const toastId = toast.loading("Recovering cash...")

        try {
            const response = await recoverCash({
                id,
                expenseId,
                description,
            }).unwrap()

            if (response.success) {
                toast.success(response.message || "Cash recovered successfully")
            } else {
                toast.error(response.message || "Something went wrong")
            }
        } catch (error) {
            toast.error((error as Error).message || "Something went wrong")
        } finally {
            onOpenChange(false)
            setDescription("")
            toast.dismiss(toastId)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recover Cash</DialogTitle>
                    <DialogDescription>
                        Confirm cash recovery for this expense. This action will add the
                        amount back to your available cash.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Reason for recovery (optional)"
                            className="col-span-3"
                            disabled={loading}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Recovering..." : "Recover"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(CashRecoveryModal);