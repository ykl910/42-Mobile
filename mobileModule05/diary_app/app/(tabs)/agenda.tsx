import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { useAuth } from '../../context/auth-context';
import { supabase } from '../../config/supabase';
import { Entry } from '../../types/entry';
import { theme as t } from '../../constants/theme';

export default function Agenda() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (!authLoading && !user) router.replace('/');
  }, [user, authLoading]);

  useEffect(() => {
    if (user && segments[1] === 'agenda') {
      fetchEntries();
    }
  }, [user, segments]);

  useEffect(() => {
    filterEntriesByDate(selectedDate);
    updateMarkedDates();
  }, [selectedDate, entries]);

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

  const filterEntriesByDate = (date: string) => {
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === date;
    });
    setFilteredEntries(filtered);
  };

  const updateMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    
    // Mark all dates with entries
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      if (!marked[entryDate]) {
        marked[entryDate] = { marked: true, dotColor: t.primary };
      }
    });

    // Mark selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: t.primary,
      selectedTextColor: t.textOnPrimary,
    };

    setMarkedDates(marked);
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setSelectedEntry(null);
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
          <Text style={s.headerTitle}>📅 Agenda</Text>
          <Text style={s.headerEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={s.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Calendar */}
        <View style={s.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: t.bg,
              calendarBackground: t.card,
              textSectionTitleColor: t.textSecondary,
              selectedDayBackgroundColor: t.primary,
              selectedDayTextColor: t.textOnPrimary,
              todayTextColor: t.primary,
              dayTextColor: t.text,
              textDisabledColor: t.textLight,
              dotColor: t.primary,
              selectedDotColor: t.textOnPrimary,
              arrowColor: t.primary,
              monthTextColor: t.text,
              textDayFontFamily: t.fontSerif,
              textMonthFontFamily: t.fontSerif,
              textDayHeaderFontFamily: t.fontSerif,
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        {/* Entries List */}
        <View style={s.listContainer}>
          <Text style={s.sectionTitle}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          
          {loading ? (
            <View style={s.centered}>
              <ActivityIndicator size="large" color={t.primary} />
            </View>
          ) : filteredEntries.length === 0 ? (
            <View style={s.emptyContainer}>
              <Text style={s.empty}>No entries for this date</Text>
              <Text style={s.emptySub}>Select another date or create a new entry</Text>
            </View>
          ) : (
            <FlatList
              data={filteredEntries}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.card}
                  onPress={() => setSelectedEntry(item)}
                >
                  <View style={s.cardRow}>
                    <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={{ fontSize: 20 }}>{item.feeling}</Text>
                  </View>
                  <Text style={s.cardPreview} numberOfLines={2}>{item.content}</Text>
                  <Text style={s.cardTime}>
                    {new Date(item.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* View Modal */}
      <Modal visible={!!selectedEntry} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            {selectedEntry && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={s.cardRow}>
                  <Text style={{ fontSize: 32 }}>{selectedEntry.feeling}</Text>
                  <Text style={s.cardDate}>
                    {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <Text style={s.viewTitle}>{selectedEntry.title}</Text>
                <Text style={s.viewContent}>{selectedEntry.content}</Text>
                <TouchableOpacity
                  style={{ alignSelf: 'center', padding: 10 }}
                  onPress={() => {
                    confirmDelete(selectedEntry.id);
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

  // Calendar
  calendarContainer: {
    backgroundColor: t.card,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // List
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 12,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  empty: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: t.textLight,
    textAlign: 'center',
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
    marginBottom: 8,
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
  },
  cardPreview: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: t.textLight,
    fontStyle: 'italic',
  },
  delete: {
    fontSize: 13,
    color: t.danger,
    fontWeight: '600',
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
    maxHeight: '80%',
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
