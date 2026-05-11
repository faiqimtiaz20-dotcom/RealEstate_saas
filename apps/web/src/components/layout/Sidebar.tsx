import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { navGroups } from "@/navigation/navConfig";
import { useAuth } from "@/auth/AuthContext";
import { useI18n } from "@/i18n/I18nProvider";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const COLLAPSE_KEY = "re_sidebar_collapsed";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({ collapsed, onToggleCollapse, onNavigate, className }: SidebarProps) {
  const { t } = useI18n();
  const { user, can } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{t("app.name")}</p>
            <p className="truncate text-xs text-sidebar-muted">Real Estate SaaS</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) =>
            item.permission ? can(item.permission) : true,
          );
          if (!visible.length) return null;
          return (
            <div key={group.labelKey}>
              {!collapsed ? (
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-sidebar-muted">
                  {t(group.labelKey)}
                </p>
              ) : (
                <div className="mx-auto mb-2 h-px w-8 bg-white/10" />
              )}
              <div className="space-y-0.5">
                {visible.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? t(item.labelKey) : undefined}
                    onClick={() => onNavigate?.()}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition hover:bg-white/10",
                        isActive ? "bg-white/15 text-white" : "text-sidebar-foreground/90",
                        collapsed && "justify-center",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                    {!collapsed ? <span className="truncate">{t(item.labelKey)}</span> : null}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center text-sidebar-foreground hover:bg-white/10"
          onClick={() => {
            const next = !collapsed;
            onToggleCollapse();
            localStorage.setItem(COLLAPSE_KEY, String(next));
          }}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed ? <span className="ml-2">Collapse</span> : null}
        </Button>
        {user && !collapsed ? (
          <p className="mt-2 truncate px-2 text-xs text-sidebar-muted">{user.email}</p>
        ) : null}
      </div>
    </aside>
  );
}

export function readInitialSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "true";
  } catch {
    return false;
  }
}
