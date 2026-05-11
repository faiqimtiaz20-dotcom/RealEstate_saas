import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useI18n } from "@/i18n/I18nProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type Form = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">{t("auth.forgot.title")}</h1>
      <p className="mt-1 text-sm text-muted">We will email instructions (mock).</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(() => toast.success("If an account exists, we sent a link (mock)."))}
        noValidate
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="mt-1 text-xs text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        <Link className="text-primary hover:underline" to="/login">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
