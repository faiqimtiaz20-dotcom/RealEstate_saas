export type Branch = { id: string; name: string; city: string };
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "broker" | "finance" | "read_only";
  branchId: string | null;
};

export const mockBranches: Branch[] = [
  { id: "brc_centro", name: "HQ — Downtown", city: "São Paulo" },
  { id: "brc_zsul", name: "Branch — South Zone", city: "São Paulo" },
];

export const mockTeam: TeamMember[] = [
  {
    id: "usr_1",
    name: "Ana Sales",
    email: "ana@propertydesk.demo",
    role: "broker",
    branchId: "brc_centro",
  },
  {
    id: "usr_2",
    name: "Bruno Finance",
    email: "bruno@propertydesk.demo",
    role: "finance",
    branchId: "brc_centro",
  },
];
