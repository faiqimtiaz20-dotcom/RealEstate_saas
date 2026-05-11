import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import { toast } from "sonner";

const starter = `{
  "type": "object",
  "properties": {
    "preferred_region": { "type": "string" },
    "budget_range": { "type": "number" }
  }
}`;

export function CustomFieldsPage() {
  const [schema, setSchema] = useState(starter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Custom fields</h1>
        <p className="text-sm text-muted">JSON Schema per entity (Lead, Property) — validation in the API.</p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label htmlFor="entity">Entity</Label>
            <Input id="entity" className="mt-1" defaultValue="Lead" />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input id="version" className="mt-1" defaultValue="v1" />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="schema">JSON Schema</Label>
          <Textarea id="schema" className="mt-1 font-mono text-xs" rows={14} value={schema} onChange={(e) => setSchema(e.target.value)} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => toast.message("Validate JSON (mock)")}>
            Validate
          </Button>
          <Button type="button" onClick={() => toast.success("Draft saved (mock)")}>
            Save draft
          </Button>
        </div>
      </Card>
    </div>
  );
}
