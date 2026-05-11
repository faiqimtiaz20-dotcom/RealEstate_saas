import { useI18n } from "@/i18n/I18nProvider";
import { Building2, Check, Home, LayoutGrid, Users } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const gridPattern =
  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)";

/** Unsplash — modern high-rise façade; dark overlays keep copy readable. */
const AUTH_HERO_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80";

function RealEstateHeroBackdrop({ gridSize }: { gridSize: number }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AUTH_HERO_IMAGE})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/55" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/72 via-slate-900/82 to-slate-950/95"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `${gridPattern}`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"
        aria-hidden
      />
    </>
  );
}

export function AuthCardLayout() {
  const { t } = useI18n();

  const bullets = [
    { icon: Home, labelKey: "auth.hero.bullet1" as const },
    { icon: Users, labelKey: "auth.hero.bullet2" as const },
    { icon: LayoutGrid, labelKey: "auth.hero.bullet3" as const },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background md:flex-row">
      {/* Mobile hero */}
      <div className="relative overflow-hidden bg-slate-950 px-6 py-10 md:hidden">
        <RealEstateHeroBackdrop gridSize={28} />
        <div className="relative z-10 flex flex-col gap-4 text-white">
          <Link to="/login" className="flex w-fit items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Building2 className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg">{t("app.name")}</span>
          </Link>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight drop-shadow-sm">{t("auth.hero.headline")}</h2>
          <p className="max-w-md text-sm leading-relaxed text-slate-100/95 drop-shadow-sm">{t("auth.hero.subtitle")}</p>
        </div>
      </div>

      {/* Desktop left panel */}
      <aside className="relative hidden w-[44%] max-w-xl shrink-0 overflow-hidden bg-slate-950 lg:w-[46%] lg:max-w-none md:flex md:flex-col md:justify-between md:p-10 lg:p-14">
        <RealEstateHeroBackdrop gridSize={32} />

        <div className="relative z-10">
          <Link to="/login" className="flex items-center gap-3 font-semibold tracking-tight text-white drop-shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="text-lg">{t("app.name")}</span>
          </Link>
        </div>

        <div className="relative z-10 mt-12 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm lg:text-4xl lg:leading-tight">
            {t("auth.hero.headline")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-100/95 drop-shadow-sm">{t("auth.hero.subtitle")}</p>
          <ul className="mt-10 space-y-4">
            {bullets.map(({ icon: Icon, labelKey }) => (
              <li key={labelKey} className="flex items-start gap-3 text-sm text-slate-50/95 drop-shadow-sm">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="leading-snug">{t(labelKey)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-12 flex items-center gap-2 text-xs text-slate-300 drop-shadow-sm">
          <Check className="h-3.5 w-3.5 text-emerald-400/90" aria-hidden />
          <span>{t("auth.hero.trust")}</span>
        </div>
      </aside>

      {/* Form column */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-3 border-b border-border/80 px-4 py-3 md:border-0 md:px-8 md:pt-8">
          <Link to="/login" className="text-sm font-medium text-muted hover:text-foreground">
            {t("nav.auth_login")}
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent"
          >
            {t("auth.register.title")}
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-8 md:py-12">
          <div className="w-full max-w-[420px] rounded-2xl border border-border/90 bg-card p-8 shadow-lg shadow-foreground/5 ring-1 ring-foreground/[0.02] md:p-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
