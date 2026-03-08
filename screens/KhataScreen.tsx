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
import CustomerCard from '../components/CustomerCard';
import CustomerModal from '../components/CustomerModal';
import StatCard from '../components/StatCard';
import { getCustomers, saveCustomer, updateCustomer, deleteCustomer } from '../utils/storage';
import { Customer } from '../types';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

interface KhataScreenProps {
  navigation: any;
}

const KhataScreen: React.FC<KhataScreenProps> = ({ navigation }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [toReceive, setToReceive] = useState(0);
  const [toPay, setToPay] = useState(0);

  const loadCustomers = async () => {
    try {
      const loadedCustomers = await getCustomers();
      const sortedCustomers = loadedCustomers.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCustomers(sortedCustomers);

      // Calculate totals
      let receiveTotal = 0;
      let payTotal = 0;
      loadedCustomers.forEach((customer) => {
        if (customer.balanceType === 'receive') {
          receiveTotal += customer.balance;
        } else {
          payTotal += Math.abs(customer.balance);
        }
      });
      setToReceive(receiveTotal);
      setToPay(payTotal);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalVisible(true);
  };

  const handleSaveCustomer = async (customer: Customer) => {
    try {
      if (editingCustomer) {
        await updateCustomer(customer.id, customer);
      } else {
        await saveCustomer(customer);
      }
      await loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Ledger"
        subtitle={formatDateForDisplay()}
        count={customers.length}
        showBack
        onBack={() => navigation.goBack()}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search customers..."
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>To Receive</Text>
          <Text style={[styles.summaryAmount, { color: '#10b981' }]}>
            {formatCurrency(toReceive)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>To Pay</Text>
          <Text style={[styles.summaryAmount, { color: '#ef4444' }]}>
            {formatCurrency(toPay)}
          </Text>
        </View>
      </View>
      {filteredCustomers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No customers found' : 'No customers yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'Tap the + button to add your first customer'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard customer={item} onPress={() => handleEditCustomer(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FloatingActionButton onPress={handleAddCustomer} />
      <CustomerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default KhataScreen;
