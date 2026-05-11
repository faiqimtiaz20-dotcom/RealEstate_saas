import { Table, Td, Th } from "@/components/ui/Table";
import { mockAudit } from "@/mocks/audit";

export function AuditPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted">Sensitive actions: finance, listings, integration tokens.</p>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Action</Th>
            <Th>Entity</Th>
            <Th>ID</Th>
            <Th>Metadata</Th>
          </tr>
        </thead>
        <tbody>
          {mockAudit.map((a) => (
            <tr key={a.id}>
              <Td className="text-muted">{new Date(a.at).toLocaleString("en-US")}</Td>
              <Td className="font-mono text-xs">{a.action}</Td>
              <Td>{a.entity}</Td>
              <Td className="font-mono text-xs">{a.entityId}</Td>
              <Td className="text-muted">{a.metadata ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
