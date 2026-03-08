import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const FloatingActionButton: React.FC<FABProps> = ({ 
  onPress, 
  icon = 'add' 
}) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      accessibilityLabel="Add new item"
      accessibilityRole="button"
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default FloatingActionButton;
