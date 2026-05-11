import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { mockRentalDeals } from "@/mocks/commercial";

const stageLabel = {
  listing: "Listing",
  visit: "Showing",
  application: "Rental application",
  lease: "Lease",
  move_in: "Move-in",
  renewal: "Renewal",
} as const;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export function RentalsPipelinePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Rentals</h1>
        <p className="text-sm text-muted">Flow: listing → showing → lease → move-in / renewal.</p>
      </div>

      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(stageLabel) as (keyof typeof stageLabel)[]).map((s) => (
          <Card key={s} className="p-3">
            <p className="text-xs font-semibold">{stageLabel[s]}</p>
            <p className="mt-1 text-xl font-bold">{mockRentalDeals.filter((d) => d.stage === s).length}</p>
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
            <Th>Rent</Th>
          </tr>
        </thead>
        <tbody>
          {mockRentalDeals.map((d) => (
            <tr key={d.id}>
              <Td className="font-medium">{d.title}</Td>
              <Td>{d.client}</Td>
              <Td className="text-muted">{d.property}</Td>
              <Td>
                <Badge tone="primary">{stageLabel[d.stage]}</Badge>
              </Td>
              <Td>{money(d.monthly)}/mo</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
