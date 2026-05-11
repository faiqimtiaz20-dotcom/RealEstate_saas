import type { Permission } from "@/auth/roles";
import {
  Building2,
  CalendarDays,
  CreditCard,
  GitBranch,
  Home,
  Inbox,
  LayoutDashboard,
  Link2,
  ListTree,
  Plug,
  Settings,
  Shield,
  UserCircle2,
  Users,
  Wallet,
  Webhook,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  permission?: Permission;
};

export type NavGroup = {
  labelKey: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    labelKey: "nav.main",
    items: [
      {
        to: "/dashboard",
        labelKey: "nav.dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    labelKey: "nav.crm",
    items: [
      { to: "/crm/leads", labelKey: "nav.crm_leads", icon: Users, permission: "crm.read" },
      { to: "/crm/contacts", labelKey: "nav.crm_contacts", icon: UserCircle2, permission: "crm.read" },
      { to: "/crm/pipeline", labelKey: "nav.crm_pipeline", icon: GitBranch, permission: "crm.read" },
      { to: "/crm/deals", labelKey: "nav.crm_deals", icon: ListTree, permission: "crm.read" },
      { to: "/crm/reports", labelKey: "nav.crm_reports", icon: LayoutDashboard, permission: "crm.read" },
    ],
  },
  {
    labelKey: "nav.properties",
    items: [
      {
        to: "/properties",
        labelKey: "nav.properties",
        icon: Home,
        permission: "properties.read",
      },
    ],
  },
  {
    labelKey: "nav.commercial",
    items: [
      {
        to: "/commercial/sales",
        labelKey: "nav.commercial_sales",
        icon: Building2,
        permission: "commercial.read",
      },
      {
        to: "/commercial/rentals",
        labelKey: "nav.commercial_rentals",
        icon: Home,
        permission: "commercial.read",
      },
      {
        to: "/commercial/calendar",
        labelKey: "nav.commercial_calendar",
        icon: CalendarDays,
        permission: "commercial.read",
      },
    ],
  },
  {
    labelKey: "nav.finance",
    items: [
      {
        to: "/finance/accounts",
        labelKey: "nav.finance_accounts",
        icon: Wallet,
        permission: "finance.read",
      },
      {
        to: "/finance/transactions",
        labelKey: "nav.finance_transactions",
        icon: CreditCard,
        permission: "finance.read",
      },
      {
        to: "/finance/cashflow",
        labelKey: "nav.finance_cashflow",
        icon: LayoutDashboard,
        permission: "finance.read",
      },
      {
        to: "/finance/reports",
        labelKey: "nav.finance_reports",
        icon: ListTree,
        permission: "finance.read",
      },
      {
        to: "/finance/reconciliation",
        labelKey: "nav.finance_reconciliation",
        icon: Shield,
        permission: "finance.read",
      },
    ],
  },
  {
    labelKey: "nav.integrations",
    items: [
      {
        to: "/integrations",
        labelKey: "nav.integrations",
        icon: Plug,
        permission: "integrations.read",
      },
      {
        to: "/integrations/mapping",
        labelKey: "nav.integrations_mapping",
        icon: Link2,
        permission: "integrations.read",
      },
      {
        to: "/integrations/queue",
        labelKey: "nav.integrations_queue",
        icon: GitBranch,
        permission: "integrations.read",
      },
    ],
  },
  {
    labelKey: "nav.whatsapp",
    items: [
      {
        to: "/whatsapp",
        labelKey: "nav.whatsapp",
        icon: Inbox,
        permission: "whatsapp.read",
      },
    ],
  },
  {
    labelKey: "nav.settings",
    items: [
      { to: "/settings", labelKey: "nav.settings", icon: Settings, permission: "settings.read" },
      { to: "/settings/org", labelKey: "nav.settings_org", icon: Building2, permission: "settings.read" },
      { to: "/settings/audit", labelKey: "nav.settings_audit", icon: Shield, permission: "audit.read" },
      {
        to: "/settings/webhooks",
        labelKey: "nav.crm_webhooks",
        icon: Webhook,
        permission: "settings.read",
      },
      {
        to: "/settings/custom-fields",
        labelKey: "nav.settings_fields",
        icon: ListTree,
        permission: "settings.read",
      },
    ],
  },
];
