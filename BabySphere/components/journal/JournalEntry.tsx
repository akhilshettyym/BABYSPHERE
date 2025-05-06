import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { TagSelector } from './TagSelector';
import { SaveButton } from '../ui/SaveButton';
import { theme } from '../../utils/theme';
import { useJournal } from '../../hooks/useJournal';

export function JournalEntry() {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { saveEntry, isLoading, error } = useJournal();

  const handleSave = async () => {
    if (content.trim()) {
      await saveEntry(content, selectedTags);
      setContent('');
      setSelectedTags([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Journal</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your thoughts..."
        placeholderTextColor="#FFFFFF" // This sets the placeholder to white
        value={content}
        onChangeText={setContent}
        maxLength={500}
      />
      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <SaveButton
        onPress={handleSave}
        isLoading={isLoading}
        disabled={!content.trim()}
        label="Save Entry"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  error: {
    color: theme.colors.error,
    marginBottom: 8,
  },
});