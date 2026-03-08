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
import { Customer } from '../types';
import { generateId } from '../utils/helpers';

interface CustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customer?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  visible,
  onClose,
  onSave,
  customer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [balance, setBalance] = useState('');
  const [balanceType, setBalanceType] = useState<'receive' | 'pay'>('receive');
  const [errors, setErrors] = useState({ name: '', phone: '', balance: '' });

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setBalance(Math.abs(customer.balance).toString());
      setBalanceType(customer.balanceType);
    } else {
      setName('');
      setPhone('');
      setBalance('');
      setBalanceType('receive');
    }
    setErrors({ name: '', phone: '', balance: '' });
  }, [customer, visible]);

  const handleSave = () => {
    const newErrors = { name: '', phone: '', balance: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (phone.length < 10 || !/^\d+$/.test(phone)) {
      newErrors.phone = 'Phone number must be at least 10 digits';
      isValid = false;
    }
    if (balance && isNaN(parseFloat(balance))) {
      newErrors.balance = 'Invalid balance amount';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const balanceAmount = balance ? parseFloat(balance) : 0;
    const finalBalance = balanceType === 'receive' ? balanceAmount : -balanceAmount;

    const customerData: Customer = customer
      ? {
          ...customer,
          name: name.trim(),
          phone: phone.trim(),
          balance: finalBalance,
          balanceType,
        }
      : {
          id: generateId(),
          name: name.trim(),
          phone: phone.trim(),
          balance: finalBalance,
          balanceType,
          createdAt: new Date().toISOString(),
        };

    onSave(customerData);
    setName('');
    setPhone('');
    setBalance('');
    setBalanceType('receive');
    setErrors({ name: '', phone: '', balance: '' });
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
              {customer ? 'Edit Customer' : 'New Customer'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter customer name"
                placeholderTextColor="#6b7280"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/[^0-9]/g, ''));
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="Enter phone number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                maxLength={15}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Opening Balance (Optional)</Text>
              <View style={styles.balanceTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.balanceTypeButton,
                    balanceType === 'receive' && styles.balanceTypeButtonActive,
                  ]}
                  onPress={() => setBalanceType('receive')}
                >
                  <Text
                    style={[
                      styles.balanceTypeText,
                      balanceType === 'receive' && styles.balanceTypeTextActive,
                    ]}
                  >
                    To Receive
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.balanceTypeButton,
                    balanceType === 'pay' && styles.balanceTypeButtonActive,
                  ]}
                  onPress={() => setBalanceType('pay')}
                >
                  <Text
                    style={[
                      styles.balanceTypeText,
                      balanceType === 'pay' && styles.balanceTypeTextActive,
                    ]}
                  >
                    To Pay
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, errors.balance && styles.inputError]}
                value={balance}
                onChangeText={(text) => {
                  setBalance(text.replace(/[^0-9.]/g, ''));
                  if (errors.balance) setErrors({ ...errors, balance: '' });
                }}
                placeholder="Enter opening balance"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
              />
              {errors.balance ? (
                <Text style={styles.errorText}>{errors.balance}</Text>
              ) : null}
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
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  balanceTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  balanceTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  balanceTypeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  balanceTypeText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceTypeTextActive: {
    color: '#3b82f6',
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

export default CustomerModal;
