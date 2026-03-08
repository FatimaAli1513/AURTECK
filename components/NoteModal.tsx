import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types';
import { generateId } from '../utils/helpers';

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  note?: Note;
}

const NoteModal: React.FC<NoteModalProps> = ({ visible, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({ title: '', description: '' });
  }, [note, visible]);

  const handleSave = () => {
    const newErrors = { title: '', description: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const now = new Date().toISOString();
    const noteData: Note = note
      ? {
          ...note,
          title: title.trim(),
          description: description.trim(),
          updatedAt: now,
        }
      : {
          id: generateId(),
          title: title.trim(),
          description: description.trim(),
          createdAt: now,
          updatedAt: now,
        };

    onSave(noteData);
    setTitle('');
    setDescription('');
    setErrors({ title: '', description: '' });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{note ? 'Edit Note' : 'New Note'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Enter note title"
                placeholderTextColor="#6b7280"
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                placeholder="Enter note description"
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a1929',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  textArea: {
    minHeight: 120,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteModal;
