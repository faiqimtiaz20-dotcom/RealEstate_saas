import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { useMockAppStore } from "@/stores/mockAppStore";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(n);

export function ReconciliationPage() {
  const { can } = useAuth();
  const transactions = useMockAppStore((s) => s.transactions);
  const setTransactionReconciled = useMockAppStore((s) => s.setTransactionReconciled);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const rows = useMemo(
    () => (onlyOpen ? transactions.filter((t) => !t.reconciled) : transactions),
    [onlyOpen, transactions],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reconciliation</h1>
          <p className="text-sm text-muted">Mark transactions as reconciled (mock store).</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          Open items only
        </label>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <Td className="text-muted">{new Date(t.date).toLocaleDateString("en-US")}</Td>
              <Td className="font-medium">{t.description}</Td>
              <Td>{money(t.amount)}</Td>
              <Td>
                <Badge tone={t.reconciled ? "success" : "warning"}>
                  {t.reconciled ? "Reconciled" : "Open"}
                </Badge>
              </Td>
              <Td className="text-right">
                {!t.reconciled && can("finance.write") ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setTransactionReconciled(t.id, true);
                      toast.success("Reconciled (mock store)");
                    }}
                  >
                    Mark OK
                  </Button>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="p-4 text-sm text-muted">
        Bank statement import (CSV/OFX) lives in the API with validation and deduplication.
      </Card>
    </div>
  );
}
