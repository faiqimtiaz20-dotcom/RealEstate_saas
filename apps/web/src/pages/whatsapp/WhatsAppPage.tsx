import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { mockWaThreads } from "@/mocks/whatsapp";
import { useState } from "react";
import { toast } from "sonner";

export function WhatsAppPage() {
  const [selected, setSelected] = useState(mockWaThreads[0]);
  const [autoReply, setAutoReply] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">WhatsApp</h1>
          <p className="text-sm text-muted">Inbox + AI suggestions + templates (Cloud API / BSP in the API).</p>
        </div>

        <label className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
          <span>Auto-reply (outside business hours)</span>
          <input type="checkbox" checked={autoReply} onChange={(e) => setAutoReply(e.target.checked)} />
        </label>

        <div className="space-y-2">
          {mockWaThreads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                selected.id === t.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{t.leadName}</span>
                {t.unread ? <Badge tone="danger">{t.unread}</Badge> : null}
              </div>
              <p className="truncate text-xs text-muted">{t.lastMessage}</p>
            </button>
          ))}
        </div>

        <Card className="p-3">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base">Templates</CardTitle>
            <CardDescription>Meta approval / opt-in policies.</CardDescription>
          </CardHeader>
          <ul className="list-inside list-disc space-y-1 text-xs text-muted">
            <li>first_contact_greeting</li>
            <li>showing_confirmation</li>
            <li>send_material</li>
          </ul>
          <Button className="mt-3 w-full" variant="secondary" type="button" onClick={() => toast.message("Send template (mock)")}>
            Send template
          </Button>
        </Card>
      </div>

      <Card className="p-4 lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{selected.leadName}</h2>
            <p className="text-sm text-muted">{selected.phone}</p>
          </div>
          <Badge tone="muted">Human in the loop</Badge>
        </div>

        <div className="mt-4 rounded-md border border-border bg-accent/30 p-3 text-sm">
          <p className="text-muted">Last message</p>
          <p className="mt-1 font-medium">{selected.lastMessage}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold">AI suggestion (phase A)</p>
          <Textarea readOnly value={selected.aiSuggested ?? ""} rows={4} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => toast.success("Suggestion inserted in composer (mock)")}>
              Use suggestion
            </Button>
            <Button type="button" variant="secondary" onClick={() => toast.message("Thread summary (mock)")}>
              Summarize thread
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-sm font-semibold">Guardrails</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            <li>Do not log client-side tokens or sensitive PII.</li>
            <li>Mitigate prompt injection on inbound messages.</li>
            <li>Phase B: auto-reply only in a configurable window with escalation.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
