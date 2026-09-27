export type Category = string;
export type Priority = "High" | "Medium" | "Low";
export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: Category;
  paymentMethod?: string;
  notes?: string;
}
export interface PlannedExpense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  priority: Priority;
  dueDate?: string;
}
export interface Income {
  id: string;
  name: string;
  amount: number;
  date: string;
  source: string;
}
export interface Budget {
  category: string;
  limit: number;
}
export const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Savings",
  "Other",
];
export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
export const PRIORITY_ORDER: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};
