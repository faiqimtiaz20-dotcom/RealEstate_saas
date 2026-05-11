import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useI18n } from "@/i18n/I18nProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirm: z.string().min(6, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type Form = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useI18n();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">{t("auth.register.title")}</h1>
      <p className="mt-1 text-sm text-muted">Mock: no persistence — form validation only.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(() => {
          toast.success("Account created (mock). Check your email.");
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="mt-1 text-xs text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="mt-1 text-xs text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" className="mt-1" {...form.register("confirm")} />
          {form.formState.errors.confirm ? (
            <p className="mt-1 text-xs text-danger">{form.formState.errors.confirm.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          {t("auth.register.title")}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="text-primary hover:underline" to="/login">
          {t("nav.auth_login")}
        </Link>
      </p>
    </div>
  );
}
