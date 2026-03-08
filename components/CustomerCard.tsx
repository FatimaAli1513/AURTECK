import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/helpers';
import { Customer } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onPress }) => {
  const isReceive = customer.balanceType === 'receive';
  const balanceColor = isReceive ? '#10b981' : '#ef4444';
  const balanceLabel = isReceive ? 'To Receive' : 'To Pay';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Customer: ${customer.name}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={24} color="#ec4899" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{customer.name}</Text>
          <View style={styles.phoneContainer}>
            <Ionicons name="call" size={14} color="#9ca3af" />
            <Text style={styles.phone}>{customer.phone}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.balanceContainer, { backgroundColor: `${balanceColor}20` }]}>
        <Text style={styles.balanceLabel}>{balanceLabel}</Text>
        <Text style={[styles.balanceAmount, { color: balanceColor }]}>
          {formatCurrency(Math.abs(customer.balance))}
        </Text>
      </View>
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
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ec489920',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#d1d5db',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomerCard;
