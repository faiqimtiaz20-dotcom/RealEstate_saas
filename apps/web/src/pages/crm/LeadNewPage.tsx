import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useMockAppStore } from "@/stores/mockAppStore";
import { LEAD_SOURCE_LABELS, LEAD_SOURCES, type LeadSource } from "@/types/crm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "Enter a name"),
    phone: z.string().min(8, "Invalid phone"),
    email: z.string().email().optional().or(z.literal("")),
    source: z.string(),
    sourceNote: z.string().optional(),
    consentMarketing: z.boolean(),
    consentWhatsApp: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (!(LEAD_SOURCES as readonly string[]).includes(val.source)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid source", path: ["source"] });
    }
    if ((val.source === "partner" || val.source === "other_portal") && !val.sourceNote?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a note (e.g. partner or portal).",
        path: ["sourceNote"],
      });
    }
  });

type Form = z.infer<typeof schema>;

export function LeadNewPage() {
  const navigate = useNavigate();
  const addLead = useMockAppStore((s) => s.addLead);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "manual",
      sourceNote: "",
      consentMarketing: false,
      consentWhatsApp: true,
    },
  });

  const source = form.watch("source");
  const showNote = source === "partner" || source === "other_portal";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New lead</h1>
          <p className="text-sm text-muted">Validation with React Hook Form + Zod.</p>
        </div>
        <Link className="text-sm text-primary hover:underline" to="/crm/leads">
          Back
        </Link>
      </div>

      <Card className="p-4">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            const id = addLead({
              name: values.name,
              phone: values.phone,
              email: values.email || undefined,
              source: values.source as LeadSource,
              sourceNote: values.sourceNote,
              consentMarketing: values.consentMarketing,
              consentWhatsApp: values.consentWhatsApp,
            });
            toast.success("Lead created (mock store)");
            navigate(`/crm/leads/${id}`);
          })}
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" className="mt-1" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="mt-1 text-xs text-danger">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" className="mt-1" {...form.register("phone")} />
              {form.formState.errors.phone ? (
                <p className="mt-1 text-xs text-danger">{form.formState.errors.phone.message}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" className="mt-1" {...form.register("email")} />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Select id="source" className="mt-1" {...form.register("source")}>
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_SOURCE_LABELS[s as LeadSource]}
                  </option>
                ))}
              </Select>
            </div>
            {showNote ? (
              <div className="md:col-span-2">
                <Label htmlFor="sourceNote">Source note</Label>
                <Textarea id="sourceNote" className="mt-1" rows={3} {...form.register("sourceNote")} />
                {form.formState.errors.sourceNote ? (
                  <p className="mt-1 text-xs text-danger">{form.formState.errors.sourceNote.message}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("consentMarketing")} />
              Marketing consent (privacy / LGPD)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("consentWhatsApp")} />
              WhatsApp consent (privacy / LGPD)
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Link to="/crm/leads">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
