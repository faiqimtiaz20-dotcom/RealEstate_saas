import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { mockMappingRows } from "@/mocks/integrations";
import { toast } from "sonner";

export function MappingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portal ↔ property mapping</h1>
        <p className="text-sm text-muted">Validate before publish; required fields highlighted.</p>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Portal field</Th>
            <Th>Internal field</Th>
            <Th>Required</Th>
            <Th>Validation</Th>
          </tr>
        </thead>
        <tbody>
          {mockMappingRows.map((r) => (
            <tr key={r.portalField}>
              <Td className="font-mono text-xs">{r.portalField}</Td>
              <Td className="font-mono text-xs">{r.internalField}</Td>
              <Td>{r.required ? "yes" : "no"}</Td>
              <Td>
                <Badge tone={r.valid ? "success" : "danger"}>{r.valid ? "OK" : "Fix"}</Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="flex flex-wrap justify-end gap-2 p-4">
        <Button type="button" variant="secondary" onClick={() => toast.message("Validate (mock)")}>
          Validate mapping
        </Button>
        <Button type="button" onClick={() => toast.success("Mapping saved (mock)")}>
          Save
        </Button>
      </Card>
    </div>
  );
}
