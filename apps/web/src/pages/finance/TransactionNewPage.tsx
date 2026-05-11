import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { useMockAppStore } from "@/stores/mockAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  date: z.string().min(1, "Enter a date"),
  description: z.string().min(2, "Enter a description"),
  amount: z.coerce.number().positive("Invalid amount"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().min(1, "Select a category"),
  linkedDealId: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function TransactionNewPage() {
  const navigate = useNavigate();
  const accounts = useMockAppStore((s) => s.accounts);
  const addTransaction = useMockAppStore((s) => s.addTransaction);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: 100,
      type: "income",
      categoryId: accounts[0]?.id ?? "",
      linkedDealId: "",
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New transaction</h1>
          <p className="text-sm text-muted">Income or expense linked to chart of accounts (mock store).</p>
        </div>
        <Link className="text-sm text-primary hover:underline" to="/finance/transactions">
          Back
        </Link>
      </div>

      <Card className="p-4">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            addTransaction({
              date: values.date,
              description: values.description,
              amount: values.amount,
              type: values.type,
              categoryId: values.categoryId,
              linkedDealId: values.linkedDealId,
            });
            toast.success("Transaction created (mock store)");
            navigate("/finance/transactions");
          })}
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" className="mt-1" {...form.register("date")} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select id="type" className="mt-1" {...form.register("type")}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" className="mt-1" {...form.register("description")} />
            </div>
            <div>
              <Label htmlFor="amount">Amount (BRL)</Label>
              <Input id="amount" type="number" step="0.01" className="mt-1" {...form.register("amount", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" className="mt-1" {...form.register("categoryId")}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="linkedDealId">Linked deal (optional)</Label>
              <Input id="linkedDealId" className="mt-1" placeholder="deal_1" {...form.register("linkedDealId")} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Link to="/finance/transactions">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
