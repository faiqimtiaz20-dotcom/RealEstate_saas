import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { useMockAppStore } from "@/stores/mockAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const bucketLabel = {
  income: "Income",
  expense: "Expense",
  asset: "Asset",
  liability: "Liability",
} as const;

const bucketOptions = ["income", "expense", "asset", "liability"] as const;

const schema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(2, "Name is required"),
  bucket: z.enum(bucketOptions),
});

type Form = z.infer<typeof schema>;

export function AccountsPage() {
  const { can } = useAuth();
  const accounts = useMockAppStore((s) => s.accounts);
  const addAccount = useMockAppStore((s) => s.addAccount);
  const [open, setOpen] = useState(false);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", name: "", bucket: "expense" },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chart of accounts</h1>
          <p className="text-sm text-muted">Simplified buckets — extra accounts live in the mock store.</p>
        </div>
        {can("finance.write") ? (
          <Button type="button" onClick={() => setOpen(true)}>
            New account
          </Button>
        ) : null}
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Name</Th>
            <Th>Bucket</Th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <Td className="font-mono text-sm">{a.code}</Td>
              <Td className="font-medium">{a.name}</Td>
              <Td>
                <Badge tone="muted">{bucketLabel[a.bucket]}</Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Card className="p-4 text-sm text-muted">
        Balance sheet and P&L accounts — align with your accountant for local tax obligations.
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New account"
        description="Future transactions can use this category."
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="acc-new-form">
              Save
            </Button>
          </>
        }
      >
        <form
          id="acc-new-form"
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => {
            addAccount(values);
            toast.success("Account created (mock store)");
            form.reset({ code: "", name: "", bucket: "expense" });
            setOpen(false);
          })}
        >
          <div>
            <Label htmlFor="code">Code</Label>
            <Input id="code" className="mt-1" {...form.register("code")} />
            {form.formState.errors.code ? (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.code.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="mt-1" {...form.register("name")} />
          </div>
          <div>
            <Label htmlFor="bucket">Bucket</Label>
            <Select id="bucket" className="mt-1" {...form.register("bucket")}>
              {bucketOptions.map((b) => (
                <option key={b} value={b}>
                  {bucketLabel[b]}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
