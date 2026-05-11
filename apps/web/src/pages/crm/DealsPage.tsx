import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Table, Td, Th } from "@/components/ui/Table";
import { DEAL_STAGE_LABELS } from "@/types/deal";
import { mockDeals } from "@/mocks/deals";
import type { Deal } from "@/types/crm";
import { useState } from "react";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(n);

export function DealsPage() {
  const [open, setOpen] = useState(false);
  const [deal, setDeal] = useState<Deal | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
        <p className="text-sm text-muted">Opportunities with value, expected close, and stage history.</p>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Stage</Th>
            <Th>Value</Th>
            <Th>Expected close</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {mockDeals.map((d) => (
            <tr key={d.id}>
              <Td className="font-medium">{d.title}</Td>
              <Td>
                <Badge tone="primary">{DEAL_STAGE_LABELS[d.stage]}</Badge>
              </Td>
              <Td>{money(d.value)}</Td>
              <Td className="text-muted">{new Date(d.expectedClose).toLocaleDateString("en-US")}</Td>
              <Td className="text-right">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setDeal(d);
                    setOpen(true);
                  }}
                >
                  Details
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={deal?.title ?? "Deal"}
        description="Stage history (mock)"
        size="lg"
        footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        {deal ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-3">
              <p className="text-sm font-medium">Summary</p>
              <p className="mt-2 text-sm text-muted">Lead: {deal.leadId}</p>
              <p className="text-sm text-muted">Property: {deal.propertyId ?? "—"}</p>
              <p className="mt-2 text-sm">
                Value: <span className="font-semibold">{money(deal.value)}</span>
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-sm font-medium">Stage history</p>
              <ol className="mt-2 space-y-2 text-sm">
                {deal.stageHistory.map((h, idx) => (
                  <li key={idx} className="flex justify-between gap-2 border-b border-border py-1">
                    <span>{DEAL_STAGE_LABELS[h.stage]}</span>
                    <span className="text-muted">{new Date(h.at).toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
