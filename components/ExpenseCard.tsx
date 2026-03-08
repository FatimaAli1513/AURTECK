import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Expense, ExpenseCategory } from '../types';

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
}

const getCategoryIcon = (category: ExpenseCategory): keyof typeof Ionicons.glyphMap => {
  const icons: Record<ExpenseCategory, keyof typeof Ionicons.glyphMap> = {
    Food: 'restaurant',
    Transport: 'car',
    Shopping: 'bag',
    Bills: 'receipt',
    Entertainment: 'film',
    Health: 'medical',
    Education: 'school',
    Other: 'ellipse',
  };
  return icons[category];
};

const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    Food: '#f59e0b',
    Transport: '#3b82f6',
    Shopping: '#8b5cf6',
    Bills: '#ef4444',
    Entertainment: '#ec4899',
    Health: '#10b981',
    Education: '#06b6d4',
    Other: '#6b7280',
  };
  return colors[category];
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const categoryColor = getCategoryColor(expense.category);
  const categoryIcon = getCategoryIcon(expense.category);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Expense: ${expense.title}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
          <Ionicons name={categoryIcon} size={24} color={categoryColor} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.category}>{expense.category}</Text>
          {expense.description && (
            <Text style={styles.description} numberOfLines={1}>
              {expense.description}
            </Text>
          )}
        </View>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      </View>
      <Text style={styles.date}>{formatDate(expense.date)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ExpenseCard;
