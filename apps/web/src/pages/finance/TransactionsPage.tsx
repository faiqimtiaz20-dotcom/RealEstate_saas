import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination, slicePage } from "@/components/ui/Pagination";
import { Table, Td, Th } from "@/components/ui/Table";
import { useMockAppStore } from "@/stores/mockAppStore";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(n);

export function TransactionsPage() {
  const { can } = useAuth();
  const transactions = useMockAppStore((s) => s.transactions);
  const accounts = useMockAppStore((s) => s.accounts);
  const setTransactionReconciled = useMockAppStore((s) => s.setTransactionReconciled);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rows = useMemo(() => slicePage(transactions, page, pageSize), [transactions, page, pageSize]);

  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted">In-browser mock store (no API).</p>
        </div>
        {can("finance.write") ? (
          <Link to="/finance/transactions/new">
            <Button type="button">New transaction</Button>
          </Link>
        ) : null}
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Amount</Th>
            <Th>Deal</Th>
            <Th>Reconciled</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <Td className="text-muted">{new Date(t.date).toLocaleDateString("en-US")}</Td>
              <Td className="font-medium">{t.description}</Td>
              <Td>
                <Badge tone={t.type === "income" ? "success" : "warning"}>
                  {t.type === "income" ? "Income" : "Expense"}
                </Badge>
              </Td>
              <Td className="text-muted">{accountName(t.categoryId)}</Td>
              <Td>{money(t.amount)}</Td>
              <Td className="text-muted">{t.linkedDealId ?? "—"}</Td>
              <Td>
                <label className={`flex items-center gap-2 text-sm ${can("finance.write") ? "" : "opacity-60"}`}>
                  <input
                    type="checkbox"
                    disabled={!can("finance.write")}
                    checked={t.reconciled}
                    onChange={() => {
                      setTransactionReconciled(t.id, !t.reconciled);
                      toast.success("Status updated (mock store)");
                    }}
                  />
                  {t.reconciled ? "yes" : "no"}
                </label>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination page={page} pageSize={pageSize} total={transactions.length} onPageChange={setPage} onPageSizeChange={setPageSize} />

      {can("finance.write") ? (
        <Button type="button" variant="secondary" onClick={() => toast.message("PDF attachment (mock)")}>
          Attach receipt
        </Button>
      ) : null}
    </div>
  );
}
