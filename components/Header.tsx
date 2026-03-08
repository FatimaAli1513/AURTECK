import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  onBack?: () => void;
  showBack?: boolean;
  spacing?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  count,
  onBack,
  showBack = false,
  spacing
}) => {
  return (
    <View style={styles.container}>
      {showBack && onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <View style={[styles.content, { paddingTop: spacing ? 0 : 25 }]}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0a1929',
    paddingTop: 30
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  countText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Header;
