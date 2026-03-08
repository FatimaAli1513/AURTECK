import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense, ExpenseCategory } from '../types';
import { generateId } from '../utils/helpers';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  expense?: Expense;
}

const categories: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

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

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  onSave,
  expense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', amount: '' });

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Other');
      setDescription('');
    }
    setErrors({ title: '', amount: '' });
  }, [expense, visible]);

  const handleSave = () => {
    const newErrors = { title: '', amount: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const expenseData: Expense = expense
      ? {
          ...expense,
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          description: description.trim() || undefined,
        }
      : {
          id: generateId(),
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          description: description.trim() || undefined,
          date: new Date().toISOString(),
        };

    onSave(expenseData);
    setTitle('');
    setAmount('');
    setCategory('Other');
    setDescription('');
    setErrors({ title: '', amount: '' });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {expense ? 'Edit Expense' : 'New Expense'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Enter expense title"
                placeholderTextColor="#6b7280"
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text.replace(/[^0-9.]/g, ''));
                  if (errors.amount) setErrors({ ...errors, amount: '' });
                }}
                placeholder="Enter amount"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
              />
              {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => {
                  const isSelected = category === cat;
                  const color = getCategoryColor(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        isSelected && { backgroundColor: `${color}20`, borderColor: color },
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Ionicons
                        name={getCategoryIcon(cat)}
                        size={24}
                        color={isSelected ? color : '#6b7280'}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && { color },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a1929',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  textArea: {
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExpenseModal;
