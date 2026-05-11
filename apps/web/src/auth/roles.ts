export type Role = "admin" | "broker" | "finance" | "read_only";

export type Permission =
  | "dashboard.view"
  | "crm.read"
  | "crm.write"
  | "properties.read"
  | "properties.write"
  | "commercial.read"
  | "commercial.write"
  | "finance.read"
  | "finance.write"
  | "integrations.read"
  | "integrations.write"
  | "whatsapp.read"
  | "whatsapp.write"
  | "settings.read"
  | "settings.write"
  | "audit.read"
  | "org.write";

const ALL: Permission[] = [
  "dashboard.view",
  "crm.read",
  "crm.write",
  "properties.read",
  "properties.write",
  "commercial.read",
  "commercial.write",
  "finance.read",
  "finance.write",
  "integrations.read",
  "integrations.write",
  "whatsapp.read",
  "whatsapp.write",
  "settings.read",
  "settings.write",
  "audit.read",
  "org.write",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL,
  broker: [
    "dashboard.view",
    "crm.read",
    "crm.write",
    "properties.read",
    "properties.write",
    "commercial.read",
    "commercial.write",
    "integrations.read",
    "whatsapp.read",
    "whatsapp.write",
    "settings.read",
  ],
  finance: [
    "dashboard.view",
    "crm.read",
    "properties.read",
    "commercial.read",
    "finance.read",
    "finance.write",
    "settings.read",
    "audit.read",
  ],
  read_only: [
    "dashboard.view",
    "crm.read",
    "properties.read",
    "commercial.read",
    "finance.read",
    "integrations.read",
    "whatsapp.read",
    "settings.read",
    "audit.read",
  ],
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
