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
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { getNotes, saveNote, updateNote, deleteNote } from '../utils/storage';
import { Note } from '../types';
import { formatDateForDisplay } from '../utils/helpers';

interface NotesScreenProps {
  navigation: any;
}

const NotesScreen: React.FC<NotesScreenProps> = ({ navigation }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  const loadNotes = async () => {
    try {
      const loadedNotes = await getNotes();
      const sortedNotes = loadedNotes.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setNotes(sortedNotes);
      setFilteredNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const handleAddNote = () => {
    setEditingNote(undefined);
    setModalVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleSaveNote = async (note: Note) => {
    try {
      if (editingNote) {
        await updateNote(note.id, note);
      } else {
        await saveNote(note);
      }
      await loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId).then(() => {
      loadNotes();
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notes"
        subtitle={formatDateForDisplay()}
        count={notes.length}
        showBack
        onBack={() => navigation.goBack()}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notes..."
      />
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'Tap the + button to create your first note'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard note={item} onPress={() => handleEditNote(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FloatingActionButton onPress={handleAddNote} />
      <NoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
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

export default NotesScreen;
