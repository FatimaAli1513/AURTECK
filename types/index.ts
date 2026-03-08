export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  balanceType: 'receive' | 'pay';
  createdAt: string;
}

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'customer' | 'expense';
  title: string;
  subtitle: string;
  date: string;
  amount?: number;
  balanceType?: 'receive' | 'pay';
}
