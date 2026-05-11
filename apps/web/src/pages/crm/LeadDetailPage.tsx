import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { memberName } from "@/lib/team";
import { useMockAppStore } from "@/stores/mockAppStore";
import type { ActivityType, LeadStatus } from "@/types/crm";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/types/crm";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const activityLabel: Record<string, string> = {
  call: "Call",
  visit: "Visit",
  note: "Note",
  task: "Task",
  reminder: "Reminder",
};

export function LeadDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const leads = useMockAppStore((s) => s.leads);
  const updateLead = useMockAppStore((s) => s.updateLead);
  const addLeadActivity = useMockAppStore((s) => s.addLeadActivity);
  const lead = useMemo(() => leads.find((l) => l.id === id), [id, leads]);
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tab, setTab] = useState<"activities" | "email">("activities");
  const [actType, setActType] = useState<ActivityType>("note");
  const [actTitle, setActTitle] = useState("");
  const [actBody, setActBody] = useState("");

  useEffect(() => {
    setStatus(null);
  }, [id]);

  if (!lead) {
    return (
      <EmptyState
        title="Lead not found"
        description="Check the link or return to the list."
        action={
          <Link to="/crm/leads">
            <Button type="button">Back</Button>
          </Link>
        }
      />
    );
  }

  const pendingStatus = status ?? lead.status;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
            <Badge tone="primary">{LEAD_SOURCE_LABELS[lead.source]}</Badge>
            <Badge tone="muted">{LEAD_STATUS_LABELS[pendingStatus]}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {lead.phone} · {lead.email ?? "no email"}
          </p>
          {lead.sourceNote ? (
            <p className="mt-2 text-sm text-muted">
              <span className="font-medium text-foreground">Source note:</span> {lead.sourceNote}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/crm/leads">
            <Button type="button" variant="secondary">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "activities"} onClick={() => setTab("activities")}>
          Activities
        </TabButton>
        <TabButton active={tab === "email"} onClick={() => setTab("email")}>
          Email (placeholder)
        </TabButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          {tab === "activities" ? (
            <>
              <CardHeader className="px-0 pt-0">
                <CardTitle>Activities</CardTitle>
                <CardDescription>Timeline (mock)</CardDescription>
              </CardHeader>
              <ol className="relative ml-1 space-y-4 border-l border-border pl-4">
                {lead.activities.map((a) => (
                  <li key={a.id} className="ml-1">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="text-xs text-muted">
                      {new Date(a.at).toLocaleString("en-US")} · {activityLabel[a.type] ?? a.type} ·{" "}
                      {memberName(a.byUserId)}
                    </p>
                    <p className="font-medium">{a.title}</p>
                    {a.body ? <p className="text-sm text-muted">{a.body}</p> : null}
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-lg border border-border bg-accent/20 p-3">
                <p className="text-sm font-semibold">Log activity</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="atype">Type</Label>
                    <Select
                      id="atype"
                      className="mt-1"
                      value={actType}
                      onChange={(e) => setActType(e.target.value as ActivityType)}
                    >
                      {(Object.keys(activityLabel) as ActivityType[]).map((t) => (
                        <option key={t} value={t}>
                          {activityLabel[t]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="atitle">Title</Label>
                    <Input id="atitle" className="mt-1" value={actTitle} onChange={(e) => setActTitle(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="abody">Details (optional)</Label>
                    <Textarea id="abody" className="mt-1" rows={3} value={actBody} onChange={(e) => setActBody(e.target.value)} />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!actTitle.trim()) {
                        toast.error("Enter an activity title");
                        return;
                      }
                      addLeadActivity(lead.id, {
                        type: actType,
                        title: actTitle.trim(),
                        body: actBody.trim() || undefined,
                        byUserId: user?.id ?? "usr_1",
                      });
                      setActTitle("");
                      setActBody("");
                      toast.success("Activity added (mock store)");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <CardHeader className="px-0 pt-0">
                <CardTitle>Email</CardTitle>
                <CardDescription>Gmail / Microsoft Graph sync (M3 parity — API later).</CardDescription>
              </CardHeader>
              <p className="text-sm text-muted">
                Read-only threads linked to the contact would appear here. In UI-only mode, use WhatsApp to demo
                messaging.
              </p>
            </>
          )}
        </Card>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Pipeline & privacy</CardTitle>
            <CardDescription>Changes require confirmation (mock)</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <Label>Stage</Label>
              <Select
                className="mt-1"
                value={pendingStatus}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
              >
                {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {LEAD_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={pendingStatus === lead.status}
            >
              Apply change
            </Button>
            <div className="border-t border-border pt-3 text-sm">
              <p className="font-medium">Consents</p>
              <p className="mt-1 text-muted">Marketing: {lead.consentMarketing ? "yes" : "no"}</p>
              <p className="text-muted">WhatsApp: {lead.consentWhatsApp ? "yes" : "no"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Assignee</p>
              <p className="text-sm text-muted">{memberName(lead.assigneeId)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm stage change"
        description="This action will be audited when the API exists."
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!lead) return;
                updateLead(lead.id, { status: pendingStatus });
                setStatus(null);
                toast.success("Stage updated (mock store)");
                setConfirmOpen(false);
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Change from <strong>{LEAD_STATUS_LABELS[lead.status]}</strong> to{" "}
          <strong>{LEAD_STATUS_LABELS[pendingStatus]}</strong>?
        </p>
      </Modal>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
