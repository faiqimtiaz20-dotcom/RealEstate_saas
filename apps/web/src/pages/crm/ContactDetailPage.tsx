import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useMockAppStore } from "@/stores/mockAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter a name"),
  phone: z.string().min(8, "Invalid phone"),
  email: z.string().email().optional().or(z.literal("")),
  tags: z.string().min(1, "Enter at least one tag"),
});

type Form = z.infer<typeof schema>;

export function ContactDetailPage() {
  const { id } = useParams();
  const contacts = useMockAppStore((s) => s.contacts);
  const updateContact = useMockAppStore((s) => s.updateContact);
  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", tags: "" },
  });

  useEffect(() => {
    if (!contact) return;
    form.reset({
      name: contact.name,
      phone: contact.phone,
      email: contact.email ?? "",
      tags: contact.tags.join(", "),
    });
  }, [contact, form]);

  if (!contact) {
    return (
      <EmptyState
        title="Contact not found"
        action={
          <Link to="/crm/contacts">
            <Button type="button">Back</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{contact.name}</h1>
          <div className="mt-2 flex flex-wrap gap-1">
            {contact.tags.map((t) => (
              <Badge key={t} tone="primary">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <Link className="text-sm text-primary hover:underline" to="/crm/contacts">
          Back
        </Link>
      </div>

      <Card className="p-4">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            const tags = values.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            updateContact(contact.id, {
              name: values.name,
              phone: values.phone,
              email: values.email?.trim() ? values.email.trim() : null,
              tags,
            });
            toast.success("Contact updated (mock store)");
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
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1" {...form.register("email")} />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Textarea id="tags" className="mt-1" rows={2} {...form.register("tags")} />
            {form.formState.errors.tags ? (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.tags.message}</p>
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
