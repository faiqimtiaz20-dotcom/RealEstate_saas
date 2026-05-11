import { mockTeam } from "@/mocks/org";

export function memberName(id: string): string {
  return mockTeam.find((m) => m.id === id)?.name ?? id;
}
