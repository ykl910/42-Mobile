import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Modal, TextInput, ScrollView,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/auth-context';
import { supabase } from '../../config/supabase';
import { Entry } from '../../types/entry';
import { theme as t } from '../../constants/theme';

const FEELINGS = ['😊', '😢', '😡', '😰', '🤔', '😎'];

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const segments = useSegments();
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
    if (user && segments[1] === 'profile') {
      fetchEntries();
    }
  }, [user, segments]);

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

  // Calculate feeling percentages
  const getFeelingStats = () => {
    if (entries.length === 0) return [];
    const feelingCounts: { [key: string]: number } = {};
    entries.forEach((entry) => {
      feelingCounts[entry.feeling] = (feelingCounts[entry.feeling] || 0) + 1;
    });
    return Object.entries(feelingCounts)
      .map(([feeling, count]) => ({
        feeling,
        count,
        percentage: ((count / entries.length) * 100).toFixed(0),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>🌿 Profile</Text>
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
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {/* User Info */}
          <Text style={s.welcomeText}>Welcome, {getUserName()}!</Text>
          <Text style={s.totalEntries}>Total Entries: {entries.length}</Text>

          {/* Recent Entries */}
          <Text style={s.sectionTitle}>Recent Entries</Text>
          {entries.slice(0, 2).map((entry) => (
            <TouchableOpacity 
              key={entry.id} 
              style={s.card} 
              onPress={() => setSelectedEntry(entry)}
            >
              <View style={s.cardRow}>
                <Text style={s.cardTitle} numberOfLines={1}>{entry.title}</Text>
                <Text style={{ fontSize: 20 }}>{entry.feeling}</Text>
              </View>
              <Text style={s.cardDate}>{new Date(entry.date).toLocaleDateString()}</Text>
            </TouchableOpacity>
          ))}

          {/* Feeling Distribution */}
          <Text style={s.sectionTitle}>Feelings</Text>
          <View style={s.statCard}>
            {getFeelingStats().map((stat) => (
              <View key={stat.feeling} style={s.feelingStat}>
                <Text style={s.feelingEmoji}>{stat.feeling}</Text>
                <View style={s.feelingBarContainer}>
                  <View style={[s.feelingBar, { width: `${stat.percentage}%` }]} />
                </View>
                <Text style={s.feelingPercentage}>{stat.percentage}%</Text>
              </View>
            ))}
          </View>
        </ScrollView>
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

  // Stats Container
  statCard: {
    backgroundColor: t.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: t.primary,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 8,
    marginTop: 8,
  },
  totalEntries: {
    fontSize: 16,
    color: t.textSecondary,
    fontFamily: t.fontSerif,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 12,
    marginTop: 12,
  },
  feelingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feelingEmoji: {
    fontSize: 22,
    width: 32,
  },
  feelingBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: t.inputBg,
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  feelingBar: {
    height: '100%',
    backgroundColor: t.primary,
    borderRadius: 10,
  },
  feelingPercentage: {
    fontSize: 13,
    fontWeight: '600',
    color: t.text,
    width: 45,
    textAlign: 'right',
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
    bottom: 100,
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
