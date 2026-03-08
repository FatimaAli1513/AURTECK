import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatCurrency } from '../utils/helpers';

interface ActivityCardProps {
  type: 'note' | 'customer' | 'expense';
  title: string;
  subtitle: string;
  date: string;
  amount?: number;
  balanceType?: 'receive' | 'pay';
  onPress: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  type,
  title,
  subtitle,
  date,
  amount,
  balanceType,
  onPress,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'note':
        return 'document-text';
      case 'customer':
        return 'person';
      case 'expense':
        return 'receipt';
      default:
        return 'ellipse';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'note':
        return '#a855f7';
      case 'customer':
        return '#ec4899';
      case 'expense':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  const getAmountColor = () => {
    if (type === 'expense') return '#ef4444';
    if (balanceType === 'receive') return '#10b981';
    if (balanceType === 'pay') return '#ef4444';
    return '#9ca3af';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`${type} activity: ${title}`}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getColor()}20` }]}>
        <Ionicons name={getIcon()} size={24} color={getColor()} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
      {amount !== undefined && (
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {formatCurrency(amount)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityCard;
