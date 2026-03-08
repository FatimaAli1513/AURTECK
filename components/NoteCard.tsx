import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate } from '../utils/helpers';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Note: ${note.title}`}
      accessibilityRole="button"
    >
      <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
      <Text style={styles.description} numberOfLines={3}>{note.description}</Text>
      <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 12,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default NoteCard;
