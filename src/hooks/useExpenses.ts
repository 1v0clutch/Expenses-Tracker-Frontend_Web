import { useEffect, useState } from 'react';
import type { Budget, Expense, Income, PlannedExpense, Priority } from '../types/expense';

const KEYS = { expenses: 'spendly.expenses', planned: 'spendly.planned', income: 'spendly.income', budgets: 'spendly.budgets', categories: 'spendly.categories', settings: 'spendly.settings' };
export interface AppSettings { currency: string; darkMode: boolean; name: string; email: string; weeklyAlert: boolean; extraMoney?: number }
function read<T>(key: string, fallback: T): T { try { const legacyKey = key === KEYS.expenses ? 'expenses' : key === KEYS.planned ? 'planned_expenses' : ''; const value = localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function useStored<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => read(key, initial));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}
export function useExpenses() {
  const [expenses, setExpenses] = useStored<Expense[]>(KEYS.expenses, []);
  const [planned, setPlanned] = useStored<PlannedExpense[]>(KEYS.planned, []);
  const [income, setIncome] = useStored<Income[]>(KEYS.income, []);
  const [budgets, setBudgets] = useStored<Budget[]>(KEYS.budgets, []);
  const [categories, setCategories] = useStored<string[]>(KEYS.categories, ['Food', 'Transport', 'Housing', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Education', 'Savings', 'Other']);
  const [settings, setSettings] = useStored<AppSettings>(KEYS.settings, { currency: 'PHP', darkMode: false, name: 'Guest', email: '', weeklyAlert: true });
  const id = () => crypto.randomUUID();
  const addExpense = (item: Omit<Expense, 'id'>) => setExpenses(prev => [{ ...item, id: id() }, ...prev]);
  const updateExpense = (id: string, item: Omit<Expense, 'id'>) => setExpenses(prev => prev.map(e => e.id === id ? { ...item, id } : e));
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const addPlannedExpense = (item: Omit<PlannedExpense, 'id'>) => setPlanned(prev => [...prev, { ...item, id: id() }]);
  const deletePlannedExpense = (id: string) => setPlanned(prev => prev.filter(e => e.id !== id));
  const updatePlannedPriority = (id: string, priority: Priority) => setPlanned(prev => prev.map(e => e.id === id ? { ...e, priority } : e));
  const addIncome = (item: Omit<Income, 'id'>) => setIncome(prev => [{ ...item, id: id() }, ...prev]);
  const deleteIncome = (id: string) => setIncome(prev => prev.filter(i => i.id !== id));
  const saveBudget = (category: string, limit: number) => setBudgets(prev => [...prev.filter(b => b.category !== category), { category, limit }]);
  return { expenses, planned, income, budgets, categories, settings, setSettings, setCategories, addExpense, updateExpense, deleteExpense, addPlannedExpense, deletePlannedExpense, updatePlannedPriority, addIncome, deleteIncome, saveBudget };
}
