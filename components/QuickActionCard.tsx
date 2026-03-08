import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  icon, 
  color, 
  backgroundColor, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityRole="button"
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color={color} />
      <Text style={[styles.title, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default QuickActionCard;
