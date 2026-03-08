import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FloatingActionButton from '../components/FloatingActionButton';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseModal from '../components/ExpenseModal';
import StatCard from '../components/StatCard';
import { getExpenses, saveExpense, updateExpense, deleteExpense } from '../utils/storage';
import { Expense } from '../types';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

interface ExpensesScreenProps {
  navigation: any;
}

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [totalExpenses, setTotalExpenses] = useState(0);

  const loadExpenses = async () => {
    try {
      const loadedExpenses = await getExpenses();
      const sortedExpenses = loadedExpenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenses(sortedExpenses);

      // Calculate total
      const total = loadedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(
        (expense) =>
          expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExpenses(filtered);
    }
  }, [searchQuery, expenses]);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setModalVisible(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setModalVisible(true);
  };

  const handleSaveExpense = async (expense: Expense) => {
    try {
      if (editingExpense) {
        await updateExpense(expense.id, expense);
      } else {
        await saveExpense(expense);
      }
      await loadExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Expenses"
        subtitle={formatDateForDisplay()}
        count={expenses.length}
        showBack
        onBack={() => navigation.goBack()}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search expenses..."
      />
      <View style={styles.summaryContainer}>
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="wallet"
          color="#f97316"
          backgroundColor="#f9731620"
        />
      </View>
      {filteredExpenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No expenses found' : 'No expenses yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'Tap the + button to add your first expense'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard expense={item} onPress={() => handleEditExpense(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FloatingActionButton onPress={handleAddExpense} />
      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ExpensesScreen;
