import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Modal, TextInput, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { supabase } from '../config/supabase';
import { Entry } from '../types/entry';
import { theme as t } from '../constants/theme';

const FEELINGS = ['😊', '😢', '😡', '😰', '🤔', '😎'];

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feeling, setFeeling] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entries').select('*')
        .eq('email', user?.email)
        .order('date', { ascending: false });
      if (error) throw error;
      setEntries(data ?? []);
    } catch (e) {
      console.error('Fetch entries error:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      Alert.alert('Error', 'Failed to delete entry');
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(id) },
    ]);
  };

  const createEntry = async () => {
    try {
      const { error } = await supabase
        .from('entries')
        .insert({ email: user?.email, title, content, feeling });
      if (error) throw error;
      setModalVisible(false);
      setTitle('');
      setContent('');
      setFeeling('');
      fetchEntries();
    } catch (e) {
      Alert.alert('Error', 'Failed to create entry');
    }
  };

  const closeCreateModal = () => {
    setModalVisible(false);
    setTitle('');
    setContent('');
    setFeeling('');
  };

  if (authLoading || !user) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={t.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>🌿 My Diary</Text>
          <Text style={s.headerEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={s.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Entries */}
      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={t.primary} />
        </View>
      ) : entries.length === 0 ? (
        <View style={s.centered}>
          <Text style={s.empty}>No entries yet</Text>
          <Text style={s.emptySub}>Tap + to write your first entry</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.card} onPress={() => setSelectedEntry(item)}>
              <View style={s.cardRow}>
                <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontSize: 20 }}>{item.feeling}</Text>
              </View>
              <Text style={s.cardDate}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={s.cardPreview} numberOfLines={2}>{item.content}</Text>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end' }}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={s.delete}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => {
        setTitle('');
        setContent('');
        setFeeling('');
        setModalVisible(true);
      }}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>New Entry</Text>
            <TextInput
              style={s.input}
              placeholder="Title"
              placeholderTextColor={t.textLight}
              value={title}
              onChangeText={setTitle}
            />
            <Text style={s.feelingLabel}>How are you feeling?</Text>
            <View style={s.emojiRow}>
              {FEELINGS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[s.emojiBtn, feeling === emoji && s.emojiBtnSelected]}
                  onPress={() => setFeeling(emoji)}
                >
                  <Text style={s.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[s.input, s.contentInput]}
              placeholder="Write your entry..."
              placeholderTextColor={t.textLight}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={s.submitBtn} onPress={createEntry}>
              <Text style={s.submitText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={closeCreateModal}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Modal */}
      <Modal visible={!!selectedEntry} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            {selectedEntry && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={s.cardRow}>
                  <Text style={{ fontSize: 32 }}>{selectedEntry.feeling}</Text>
                  <Text style={s.cardDate}>
                    {new Date(selectedEntry.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={s.viewTitle}>{selectedEntry.title}</Text>
                <Text style={s.viewContent}>{selectedEntry.content}</Text>
                <TouchableOpacity
                  style={{ alignSelf: 'center', padding: 10 }}
                  onPress={() => {
                    confirmDelete(selectedEntry.id);
                    setSelectedEntry(null);
                  }}
                >
                  <Text style={s.delete}>Delete Entry</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
            <TouchableOpacity style={s.cancelBtn} onPress={() => setSelectedEntry(null)}>
              <Text style={s.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: t.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.textOnPrimary,
  },
  headerEmail: {
    fontSize: 13,
    color: t.primaryFaded,
    marginTop: 2,
  },
  signOut: {
    fontSize: 14,
    color: t.primaryFaded,
    fontWeight: '600',
  },

  // Empty state
  empty: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: t.textLight,
  },

  // Entry card
  card: {
    backgroundColor: t.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: t.primaryLight,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: t.fontSerif,
    color: t.text,
    flex: 1,
    marginRight: 8,
  },
  cardDate: {
    fontSize: 12,
    color: t.textLight,
    marginBottom: 8,
  },
  cardPreview: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  delete: {
    fontSize: 13,
    color: t.danger,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 28,
    color: t.textOnPrimary,
    fontWeight: '300',
  },

  // Modal shared
  overlay: {
    flex: 1,
    backgroundColor: t.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: t.card,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: t.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: t.fontSerif,
    color: t.text,
    backgroundColor: t.inputBg,
    marginBottom: 12,
  },
  contentInput: {
    height: 120,
  },
  feelingLabel: {
    fontSize: 14,
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emojiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: t.inputBg,
    borderWidth: 1,
    borderColor: t.inputBorder,
  },
  emojiBtnSelected: {
    backgroundColor: t.primaryFaded,
    borderColor: t.primaryLight,
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 20,
  },
  submitBtn: {
    backgroundColor: t.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: t.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    color: t.textLight,
    fontSize: 15,
  },

  // View modal
  viewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 16,
  },
  viewContent: {
    fontSize: 16,
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
});
