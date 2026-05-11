import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function FinanceReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financial reports</h1>
        <p className="text-sm text-muted">Summary P&L, commission vs received, CSV/PDF export.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Income (month)</CardTitle>
            <CardDescription>Mock</CardDescription>
          </CardHeader>
          <p className="text-3xl font-bold">R$ 182.400</p>
        </Card>
        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Mock</CardDescription>
          </CardHeader>
          <p className="text-3xl font-bold">R$ 54.000</p>
        </Card>
        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Commission vs received</CardTitle>
            <CardDescription>Mock</CardDescription>
          </CardHeader>
          <p className="text-sm text-muted">Open: R$ 12.300</p>
          <p className="text-sm text-muted">Received: R$ 55.250</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => toast.success("CSV exported (mock)")}>
          Export CSV
        </Button>
        <Button type="button" variant="secondary" onClick={() => toast.success("PDF generated (mock)")}>
          Export PDF
        </Button>
      </div>
    </div>
  );
}
