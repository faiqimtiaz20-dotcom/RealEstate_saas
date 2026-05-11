import type { Permission } from "@/auth/roles";
import { useAuth } from "@/auth/AuthContext";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useI18n } from "@/i18n/I18nProvider";
import type { ReactNode } from "react";

export function PermissionGate({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can } = useAuth();
  const { t } = useI18n();

  if (!can(permission)) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{t("common.unauthorized")}</CardTitle>
          <CardDescription>{t("common.unauthorized_hint")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return children;
}
