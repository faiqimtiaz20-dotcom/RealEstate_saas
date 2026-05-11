import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { mockBranches, mockTeam } from "@/mocks/org";

const roleLabel = {
  admin: "Admin",
  broker: "Broker",
  finance: "Finance",
  read_only: "Read-only",
} as const;

export function OrgPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organization</h1>
        <p className="text-sm text-muted">Agency, branches, and members — RBAC enforced in the API (M2).</p>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Branches</CardTitle>
          <CardDescription>Offices and business units.</CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>City</Th>
            </tr>
          </thead>
          <tbody>
            {mockBranches.map((b) => (
              <tr key={b.id}>
                <Td className="font-medium">{b.name}</Td>
                <Td className="text-muted">{b.city}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Team</CardTitle>
          <CardDescription>Roles and default branch.</CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Branch</Th>
            </tr>
          </thead>
          <tbody>
            {mockTeam.map((m) => (
              <tr key={m.id}>
                <Td className="font-medium">{m.name}</Td>
                <Td className="text-muted">{m.email}</Td>
                <Td>
                  <Badge tone="primary">{roleLabel[m.role]}</Badge>
                </Td>
                <Td className="text-muted">{m.branchId ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
