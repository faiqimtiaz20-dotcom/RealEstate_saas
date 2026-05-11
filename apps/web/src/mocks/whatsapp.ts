export type WaThread = {
  id: string;
  leadName: string;
  phone: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  aiSuggested?: string;
};

export const mockWaThreads: WaThread[] = [
  {
    id: "wa_1",
    leadName: "Mariana Costa",
    phone: "+55 11 99999-1001",
    lastMessage: "Is the showing still tomorrow at 3pm?",
    lastAt: "2026-05-10T13:40:00Z",
    unread: 1,
    aiSuggested:
      "Hi Mariana! Yes, it is confirmed for tomorrow at 3pm at the address I sent. Want me to share directions?",
  },
  {
    id: "wa_2",
    leadName: "Ricardo Almeida",
    phone: "+55 21 98888-2200",
    lastMessage: "Send balcony photos please",
    lastAt: "2026-05-09T20:10:00Z",
    unread: 0,
    aiSuggested: "Attached are photos of the balcony and the view.",
  },
];
