import type { Credential } from "../types";

// Mock credential data (to be replaced with real data later)
export const mockCredentials: Credential[] = [
  {
    id: "1",
    title: "Main Gmail Account",
    username: "john.doe@gmail.com",
    password: "P@ssw0rd123!",
    website: "https://gmail.com",
    notes: "Main account for all my professional communications",
    lastUpdated: "2023-05-15",
  },
  {
    id: "2",
    title: "Online Banking Account",
    username: "johndoe2023",
    password: "BankSecure@2023",
    website: "https://mybank.com",
    notes:
      "Main banking account with access to savings and investments",
    lastUpdated: "2023-06-20",
  },
  {
    id: "3",
    title: "Netflix",
    username: "john.entertainment",
    password: "Netflix&Chill22",
    website: "https://netflix.com",
    lastUpdated: "2023-04-10",
  },
];
