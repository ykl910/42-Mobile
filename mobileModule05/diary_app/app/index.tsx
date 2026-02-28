import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { theme as t } from '../constants/theme';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={s.container}>
        <ActivityIndicator size="large" color={t.primary} />
      </View>
    );
  }

  const handlePress = () => {
    if (user) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/auth');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>🌿</Text>
      <Text style={s.title}>My Diary</Text>
      <Text style={s.subtitle}>Keep your thoughts secure</Text>

      <TouchableOpacity style={s.button} onPress={handlePress}>
        <Text style={s.buttonText}>{user ? 'Go to Profile' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    marginBottom: 50,
  },
  button: {
    backgroundColor: t.primary,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: t.textOnPrimary,
  },
});