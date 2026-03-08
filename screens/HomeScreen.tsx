import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import ActivityCard from '../components/ActivityCard';
import { getNotes, getCustomers, getExpenses, clearAllData } from '../utils/storage';
import { Note, Customer, Expense, Activity } from '../types';
import { formatDateForDisplay } from '../utils/helpers';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [notesCount, setNotesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [notes, customers, expenses] = await Promise.all([
        getNotes(),
        getCustomers(),
        getExpenses(),
      ]);

      setNotesCount(notes.length);
      setCustomersCount(customers.length);
      setExpensesCount(expenses.length);

      // Create activities from all data
      const activities: Activity[] = [
        ...notes.map((note) => ({
          id: note.id,
          type: 'note' as const,
          title: note.title,
          subtitle: note.description,
          date: note.updatedAt,
        })),
        ...customers.map((customer) => ({
          id: customer.id,
          type: 'customer' as const,
          title: customer.name,
          subtitle: customer.phone,
          date: customer.createdAt,
          amount: Math.abs(customer.balance),
          balanceType: customer.balanceType,
        })),
        ...expenses.map((expense) => ({
          id: expense.id,
          type: 'expense' as const,
          title: expense.title,
          subtitle: expense.category,
          date: expense.date,
          amount: expense.amount,
        })),
      ];

      // Sort by date (most recent first) and take last 5
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await loadData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleActivityPress = (activity: Activity) => {
    switch (activity.type) {
      case 'note':
        navigation.navigate('Notes');
        break;
      case 'customer':
        navigation.navigate('Khata');
        break;
      case 'expense':
        navigation.navigate('Expenses');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Aurteck"
        subtitle={formatDateForDisplay()}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="New Note"
              icon="document-text"
              color="#a855f7"
              backgroundColor="#a855f720"
              onPress={() => navigation.navigate('Notes')}
            />
            <QuickActionCard
              title="Add Customer"
              icon="person-add"
              color="#ec4899"
              backgroundColor="#ec489920"
              onPress={() => navigation.navigate('Khata')}
            />
            <QuickActionCard
              title="Daily Expenses"
              icon="receipt"
              color="#f97316"
              backgroundColor="#f9731620"
              onPress={() => navigation.navigate('Expenses')}
            />
            <QuickActionCard
              title="Clear Data"
              icon="trash"
              color="#ef4444"
              backgroundColor="#ef444420"
              onPress={handleClearData}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <StatCard
            title="Total Notes"
            value={notesCount}
            icon="document-text"
            color="#a855f7"
            backgroundColor="#a855f720"
          />
          <StatCard
            title="Total Customers"
            value={customersCount}
            icon="people"
            color="#ec4899"
            backgroundColor="#ec489920"
          />
          <StatCard
            title="Total Expenses"
            value={expensesCount}
            icon="receipt"
            color="#f97316"
            backgroundColor="#f9731620"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllActivities')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start by adding a note, customer, or expense
              </Text>
            </View>
          ) : (
            recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                type={activity.type}
                title={activity.title}
                subtitle={activity.subtitle}
                date={activity.date}
                amount={activity.amount}
                balanceType={activity.balanceType}
                onPress={() => handleActivityPress(activity)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;
