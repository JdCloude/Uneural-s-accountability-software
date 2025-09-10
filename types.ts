export enum Role {
  Admin = 'admin',
  Accountant = 'accountant',
  Lead = 'lead',
  Member = 'member',
  Viewer = 'viewer',
}

export enum TransactionType {
  Expense = 'expense',
  Income = 'income',
  Transfer = 'transfer',
}

export enum TransactionStatus {
  Pending = 'pending',
  Posted = 'posted',
  Rejected = 'rejected',
}

export enum Currency {
  COP = 'COP',
  USD = 'USD',
  EUR = 'EUR',
}

export enum PaymentMethod {
  Cash = 'efectivo',
  Transfer = 'transferencia',
  CreditCard = 'tarjeta_credito',
  DebitCard = 'tarjeta_debito',
  Other = 'otro',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Approval {
  by: string; // userId
  at: string; // ISO 8601 timestamp
}

export interface Transaction {
  id: string;
  orgId: string;
  groupId: string;
  projectId?: string;
  type: TransactionType;
  category: string;
  vendor: string;
  date: string; // YYYY-MM-DD
  amount: number;
  currency: Currency;
  tax: number;
  method: PaymentMethod;
  description: string;
  createdBy: string; // userId
  source: string; // e.g., 'ocr+audio'
  confidence: number;
  attachments: string[]; // file_ids
  status: TransactionStatus;
  approvals: Approval[];
  // 10 new fields based on Notion context
  invoiceNumber?: string;
  ieeeChapter?: string;
  eventType?: 'workshop' | 'meetup' | 'talk' | 'conference';
  paymentDueDate?: string; // YYYY-MM-DD
  reimbursementTo?: string; // userId
  fundingSource?: string; // e.g., 'IEEE_SAC', 'Faculty_Sponsorship'
  attendeeCount?: number;
  relatedTaskIds?: string[];
  recurring?: boolean;
  department?: 'Ops' | 'Comms' | 'Programs' | 'Partnerships';
  policyViolations?: string[];
}

export interface Project {
  id: string;
  name: string;
  lead: string; // userId
}

export interface Budget {
  id: string;
  orgId: string;
  projectId?: string;
  groupId?: string;
  period: string; // YYYY-MM
  cap_amount: number;
  spent_amount: number;
}

export type NavItemKey = 'dashboard' | 'transactions' | 'projects' | 'budgets' | 'reports' | 'users' | 'approvals';