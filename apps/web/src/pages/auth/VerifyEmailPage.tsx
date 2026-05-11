import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useI18n } from "@/i18n/I18nProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter 6 digits"),
});

type Form = z.infer<typeof schema>;

export function VerifyEmailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">{t("auth.verify.title")}</h1>
      <p className="mt-1 text-sm text-muted">Enter the code sent to your email (mock).</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(() => {
          toast.success("Email verified (mock)");
          navigate("/login");
        })}
        noValidate
      >
        <div>
          <Label htmlFor="code">Code</Label>
          <Input id="code" inputMode="numeric" className="mt-1 tracking-widest" {...form.register("code")} />
          {form.formState.errors.code ? (
            <p className="mt-1 text-xs text-danger">{form.formState.errors.code.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Confirm
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
