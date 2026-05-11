import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/auth/AuthContext";
import type { Role } from "@/auth/roles";
import { useI18n, type Locale } from "@/i18n/I18nProvider";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TopBarProps = {
  onOpenMobileNav: () => void;
};

export function TopBar({ onOpenMobileNav }: TopBarProps) {
  const { user, logout, setRole } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const notifications = useMemo(
    () => [
      { id: "1", title: "Lead qualified", body: "John — WhatsApp", time: "12 min ago" },
      { id: "2", title: "OLX publish failed", body: "Downtown apartment", time: "1 h ago" },
      { id: "3", title: "Overdue task", body: "Scheduled showing", time: "yesterday" },
    ],
    [],
  );

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-3 md:px-4">
      <Button
        type="button"
        variant="ghost"
        className="md:hidden px-2"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          className="pl-9"
          placeholder={t("common.search")}
          aria-label={t("common.search")}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select
          aria-label="Language"
          className="hidden w-[110px] text-xs sm:block"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
        >
          <option value="en">English</option>
          <option value="pt-BR">Português (BR)</option>
        </Select>

        {import.meta.env.DEV && user ? (
          <Select
            aria-label="Role (dev)"
            className="hidden w-[130px] text-xs lg:block"
            value={user.role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="admin">admin</option>
            <option value="broker">broker</option>
            <option value="finance">finance</option>
            <option value="read_only">read_only</option>
          </Select>
        ) : null}

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="relative px-2"
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
          </Button>
          {notifOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-lg">
              <p className="px-2 pb-2 text-xs font-semibold text-muted">Notifications</p>
              <ul className="max-h-72 space-y-1 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-md px-2 py-2 text-sm hover:bg-accent"
                  >
                    <p className="font-medium">{n.title}</p>
                    <p className="text-xs text-muted">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 px-2"
            onClick={() => setUserOpen((v) => !v)}
          >
            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary sm:inline-flex">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium lg:inline">
              {user?.name ?? "—"}
            </span>
          </Button>
          {userOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-lg">
              <p className="truncate px-2 py-1 text-xs text-muted">{user?.email}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-1 w-full justify-start text-sm"
                onClick={() => {
                  setUserOpen(false);
                  navigate("/settings");
                }}
              >
                {t("nav.settings")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 w-full justify-start text-sm text-danger"
                onClick={() => {
                  setUserOpen(false);
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
