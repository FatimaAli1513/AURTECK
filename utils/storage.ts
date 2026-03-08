import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Customer, Expense } from '../types';

const NOTES_KEY = '@aurteck_notes';
const CUSTOMERS_KEY = '@aurteck_customers';
const EXPENSES_KEY = '@aurteck_expenses';

async function getStoredJson<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function setStoredJson(key: string, data: unknown[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

// Notes
export async function getNotes(): Promise<Note[]> {
  return getStoredJson<Note>(NOTES_KEY);
}

export async function saveNote(note: Note): Promise<void> {
  const notes = await getNotes();
  notes.unshift(note);
  await setStoredJson(NOTES_KEY, notes);
}

export async function updateNote(id: string, note: Note): Promise<void> {
  const notes = await getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx !== -1) notes[idx] = note;
  await setStoredJson(NOTES_KEY, notes);
}

export async function deleteNote(id: string): Promise<void> {
  const notes = (await getNotes()).filter((n) => n.id !== id);
  await setStoredJson(NOTES_KEY, notes);
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
  return getStoredJson<Customer>(CUSTOMERS_KEY);
}

export async function saveCustomer(customer: Customer): Promise<void> {
  const customers = await getCustomers();
  customers.unshift(customer);
  await setStoredJson(CUSTOMERS_KEY, customers);
}

export async function updateCustomer(id: string, customer: Customer): Promise<void> {
  const customers = await getCustomers();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx !== -1) customers[idx] = customer;
  await setStoredJson(CUSTOMERS_KEY, customers);
}

export async function deleteCustomer(id: string): Promise<void> {
  const customers = (await getCustomers()).filter((c) => c.id !== id);
  await setStoredJson(CUSTOMERS_KEY, customers);
}

// Expenses
export async function getExpenses(): Promise<Expense[]> {
  return getStoredJson<Expense>(EXPENSES_KEY);
}

export async function saveExpense(expense: Expense): Promise<void> {
  const expenses = await getExpenses();
  expenses.unshift(expense);
  await setStoredJson(EXPENSES_KEY, expenses);
}

export async function updateExpense(id: string, expense: Expense): Promise<void> {
  const expenses = await getExpenses();
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx !== -1) expenses[idx] = expense;
  await setStoredJson(EXPENSES_KEY, expenses);
}

export async function deleteExpense(id: string): Promise<void> {
  const expenses = (await getExpenses()).filter((e) => e.id !== id);
  await setStoredJson(EXPENSES_KEY, expenses);
}

// Clear all
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([NOTES_KEY, CUSTOMERS_KEY, EXPENSES_KEY]);
}
