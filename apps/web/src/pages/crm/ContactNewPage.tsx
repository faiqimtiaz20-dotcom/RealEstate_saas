import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useMockAppStore } from "@/stores/mockAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter a name"),
  phone: z.string().min(8, "Invalid phone"),
  email: z.string().email().optional().or(z.literal("")),
  tags: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function ContactNewPage() {
  const navigate = useNavigate();
  const addContact = useMockAppStore((s) => s.addContact);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", tags: "lead" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New contact</h1>
          <p className="text-sm text-muted">Comma-separated tags (mock store).</p>
        </div>
        <Link className="text-sm text-primary hover:underline" to="/crm/contacts">
          Back
        </Link>
      </div>

      <Card className="p-4">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            const id = addContact({
              name: values.name,
              phone: values.phone,
              email: values.email || undefined,
              tags: values.tags ?? "",
            });
            toast.success("Contact created (mock store)");
            navigate(`/crm/contacts/${id}`);
          })}
          noValidate
        >
          <div>
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
            <Label htmlFor="tags">Tags (e.g. lead, south zone)</Label>
            <Textarea id="tags" className="mt-1" rows={2} {...form.register("tags")} />
          </div>
          <div className="flex justify-end gap-2">
            <Link to="/crm/contacts">
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
