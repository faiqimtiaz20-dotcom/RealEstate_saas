import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { mockSaleDeals } from "@/mocks/commercial";

const stageLabel = {
  proposal: "Proposal",
  negotiation: "Negotiation",
  contract: "Contract",
  closing: "Closing",
} as const;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export function SalesPipelinePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
        <p className="text-sm text-muted">Proposal → negotiation → contract → closing, tied to client and property.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {(Object.keys(stageLabel) as (keyof typeof stageLabel)[]).map((s) => (
          <Card key={s} className="p-3">
            <p className="text-sm font-semibold">{stageLabel[s]}</p>
            <p className="mt-1 text-2xl font-bold">{mockSaleDeals.filter((d) => d.stage === s).length}</p>
          </Card>
        ))}
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Deal</Th>
            <Th>Client</Th>
            <Th>Property</Th>
            <Th>Stage</Th>
            <Th>Value</Th>
          </tr>
        </thead>
        <tbody>
          {mockSaleDeals.map((d) => (
            <tr key={d.id}>
              <Td className="font-medium">{d.title}</Td>
              <Td>{d.client}</Td>
              <Td className="text-muted">{d.property}</Td>
              <Td>
                <Badge tone="primary">{stageLabel[d.stage]}</Badge>
              </Td>
              <Td>{money(d.value)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="p-4">
        <p className="text-sm font-semibold">Commissions (mock)</p>
        <p className="mt-1 text-sm text-muted">
          Per-deal rules: percentage and split between brokers — monthly statement in the API.
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Deal</Th>
              <Th>%</Th>
              <Th>Broker A</Th>
              <Th>Broker B</Th>
              <Th>Commission</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Sale — Paulista</Td>
              <Td>5%</Td>
              <Td>60%</Td>
              <Td>40%</Td>
              <Td>R$ 92.500,00</Td>
            </tr>
          </tbody>
        </Table>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold">Document checklist</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          <li>Signed proposal</li>
          <li>Contract draft</li>
          <li>Transfer tax / registration</li>
        </ul>
      </Card>
    </div>
  );
}
