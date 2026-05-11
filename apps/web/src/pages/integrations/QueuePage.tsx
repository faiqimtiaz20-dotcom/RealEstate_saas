import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { mockQueueJobs } from "@/mocks/integrations";
import { toast } from "sonner";

export function QueuePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Job queue</h1>
        <p className="text-sm text-muted">Retries, rate limits, idempotency — BullMQ/Sidekiq in the API.</p>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Job</Th>
            <Th>Channel</Th>
            <Th>Property</Th>
            <Th>Attempts</Th>
            <Th>Status</Th>
            <Th>Next run</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {mockQueueJobs.map((j) => (
            <tr key={j.id}>
              <Td className="font-mono text-xs">{j.id}</Td>
              <Td>{j.channel}</Td>
              <Td className="max-w-xs truncate">{j.propertyTitle}</Td>
              <Td>{j.attempts}</Td>
              <Td>
                <Badge
                  tone={
                    j.status === "done"
                      ? "success"
                      : j.status === "failed"
                        ? "danger"
                        : j.status === "running"
                          ? "primary"
                          : "muted"
                  }
                >
                  {j.status}
                </Badge>
              </Td>
              <Td className="text-muted">
                {j.nextRunAt ? new Date(j.nextRunAt).toLocaleString("en-US") : "—"}
              </Td>
              <Td className="text-right">
                <Button type="button" variant="secondary" onClick={() => toast.success("Retry queued (mock)")}>
                  Retry
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="p-4 text-sm text-muted">
        Policy: exponential backoff, DLQ for persistent failures, metrics in M10 (monitoring).
      </Card>
    </div>
  );
}
