export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  isDefault: boolean;
}

export const PAYMENT_METHODS = [
  "cash",
  "card",
  "mobile_money",
  "bank_transfer",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: Pick<Category, "_id" | "name">;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface PaginatedExpenses {
  expenses: Expense[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type BudgetStatus = "within" | "approaching" | "over" | "no_budget";

export interface CategorySpending {
  categoryId: string;
  name: string;
  total: number;
  count: number;
}

export interface DashboardData {
  month: string;
  totalSpent: number;
  expenseCount: number;
  budget: number | null;
  remaining: number | null;
  status: BudgetStatus;
  highestExpense: Expense | null;
  spendingByCategory: CategorySpending[];
  recentExpenses: Expense[];
}

export interface AdminExpense extends Omit<Expense, "createdAt"> {
  createdAt: string;
  user: { _id: string; name: string; email: string };
}

export interface AdminUserSummary {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalExpenseValue: number;
  expensesThisMonth: number;
  spendingPerCategory: CategorySpending[];
  topCategories: CategorySpending[];
  bottomCategories: CategorySpending[];
  recentExpenses: AdminExpense[];
  recentUsers: AdminUserSummary[];
}
