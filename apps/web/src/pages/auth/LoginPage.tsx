import { defaultMockUser, useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useI18n } from "@/i18n/I18nProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type Form = z.infer<typeof schema>;

export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ana@propertydesk.demo", password: "demo123" },
  });

  const onSubmit = form.handleSubmit((values) => {
    login({
      ...defaultMockUser,
      email: values.email,
      name: values.email.split("@")[0] ?? defaultMockUser.name,
    });
    toast.success("Signed in (mock)");
    navigate(from, { replace: true });
  });

  const quickDemo = () => {
    login(defaultMockUser);
    toast.success("Demo: Ana Sales");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div>
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
          {t("auth.login.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("auth.login.subtitle")}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            {t("auth.login.email_label")}
          </Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("auth.login.email_placeholder")}
              className="h-11 pl-10"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email ? (
            <p className="mt-1.5 text-xs text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            {t("auth.login.password_label")}
          </Label>
          <div className="relative mt-1.5">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11 pl-10"
              {...form.register("password")}
            />
          </div>
          {form.formState.errors.password ? (
            <p className="mt-1.5 text-xs text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="h-11 w-full text-sm font-semibold shadow-sm">
          {t("auth.login.submit")}
        </Button>
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 font-medium text-muted">{t("auth.login.or")}</span>
          </div>
        </div>
        <Button type="button" variant="secondary" className="h-11 w-full text-sm font-medium" onClick={quickDemo}>
          {t("auth.login.demo_cta")}
        </Button>
      </form>

      <p className="mt-4 rounded-lg bg-accent/60 px-3 py-2 text-center text-[11px] leading-relaxed text-muted md:text-left">
        {t("auth.login.demo_hint")}
      </p>

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link className="font-medium text-primary hover:underline" to="/forgot-password">
          {t("auth.login.forgot")}
        </Link>
        <p className="text-muted">
          {t("auth.login.no_account")}{" "}
          <Link className="font-medium text-primary hover:underline" to="/register">
            {t("auth.register.title")}
          </Link>
        </p>
      </div>
    </div>
  );
}
