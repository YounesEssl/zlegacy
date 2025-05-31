import type { ElementType } from "react";

export interface WillSummary {
  id: string;
  title: string;
  status: "active" | "pending" | "archived" | "locked";
  beneficiaries: number;
  allocation: number;
  date: string;
  blockheight?: number;
}

export interface BeneficiarySummary {
  id: string;
  name: string;
  allocation: number;
  wills: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  details: string;
  date: string;
  icon: ElementType;
}
