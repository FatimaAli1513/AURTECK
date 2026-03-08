import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import ActivityCard from '../components/ActivityCard';
import StatCard from '../components/StatCard';
import { getNotes, getCustomers, getExpenses } from '../utils/storage';
import { Activity } from '../types';
import { formatCurrency } from '../utils/helpers';

interface AllActivitiesScreenProps {
  navigation: any;
}

type FilterType = 'all' | 'note' | 'customer' | 'expense';

const AllActivitiesScreen: React.FC<AllActivitiesScreenProps> = ({ navigation }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [notesCount, setNotesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const loadActivities = async () => {
    try {
      const [notes, customers, expenses] = await Promise.all([
        getNotes(),
        getCustomers(),
        getExpenses(),
      ]);

      setNotesCount(notes.length);
      setCustomersCount(customers.length);
      const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      setTotalExpenses(expensesTotal);

      let receiveTotal = 0;
      let payTotal = 0;
      customers.forEach((customer) => {
        if (customer.balanceType === 'receive') {
          receiveTotal += customer.balance;
        } else {
          payTotal += Math.abs(customer.balance);
        }
      });
      setNetBalance(receiveTotal - payTotal);

      // Create activities
      const allActivities: Activity[] = [
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

      // Sort by date (most recent first)
      allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [])
  );

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter((activity) => activity.type === activeFilter);
      setFilteredActivities(filtered);
    }
  }, [activeFilter, activities]);

  const getFilterCount = (type: FilterType): number => {
    if (type === 'all') return activities.length;
    return activities.filter((a) => a.type === type).length;
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
        title="All Activities"
        showBack
        onBack={() => navigation.goBack()}
        spacing={true}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {(['all', 'note', 'customer', 'expense'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.tab,
              activeFilter === filter && styles.tabActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === filter && styles.tabTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getFilterCount(filter)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.content}>
        <View style={styles.summarySection}>
          <StatCard
            title="Notes"
            value={notesCount}
            icon="document-text"
            color="#a855f7"
            backgroundColor="#a855f720"
          />
          <StatCard
            title="Customers"
            value={customersCount}
            icon="people"
            color="#ec4899"
            backgroundColor="#ec489920"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon="receipt"
            color="#f97316"
            backgroundColor="#f9731620"
          />
          <View style={[styles.balanceCard, { backgroundColor: netBalance >= 0 ? '#10b98120' : '#ef444420' }]}>
            <Text style={styles.balanceLabel}>Net Balance</Text>
            <Text style={[styles.balanceAmount, { color: netBalance >= 0 ? '#10b981' : '#ef4444' }]}>
              {formatCurrency(Math.abs(netBalance))}
            </Text>
          </View>
        </View>
        {filteredActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No activities found</Text>
            <Text style={styles.emptyStateSubtext}>
              {activeFilter === 'all'
                ? 'Start by adding notes, customers, or expenses'
                : `No ${activeFilter}s found`}
            </Text>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {filteredActivities.map((activity) => (
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
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  tabs: {
    maxHeight: 60,
    backgroundColor: '#0a1929',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e3a5f',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  summarySection: {
    padding: 20,
  },
  balanceCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#d1d5db',
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activitiesList: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
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

export default AllActivitiesScreen;
