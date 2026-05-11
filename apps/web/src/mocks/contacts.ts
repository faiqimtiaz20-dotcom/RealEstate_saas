export type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  tags: string[];
};

export const mockContacts: Contact[] = [
  {
    id: "con_1",
    name: "Mariana Costa",
    email: "mariana@email.com",
    phone: "+55 11 99999-1001",
    tags: ["lead", "buyer"],
  },
  {
    id: "con_2",
    name: "Pedro Souza",
    email: "pedro@empresa.com",
    phone: "+55 11 97777-3300",
    tags: ["client", "tenant"],
  },
];
