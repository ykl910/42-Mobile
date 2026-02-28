import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { supabase } from '../config/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { theme as t } from '../constants/theme';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri();

export default function Auth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const createSessionFromUrl = async (url: string) => {
    const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1] || '');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) console.error('Session error:', error);
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      createSessionFromUrl(url);
    });
    return () => subscription.remove();
  }, []);

  // Once logged in, go to diary
  useEffect(() => {
    if (user && !loading) {
      router.replace('/profile');
    }
  }, [user, loading]);

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      setIsAuthenticating(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No OAuth URL returned');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri, { preferEphemeralSession: true });

      if (result.type === 'success') {
        await createSessionFromUrl(result.url);
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      Alert.alert('Authentication Error', `Failed to sign in with ${provider}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={t.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Choose a provider to continue</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.providerButton, styles.googleButton]}
          onPress={() => signInWithProvider('google')}
          disabled={isAuthenticating}
        >
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.providerButton, styles.githubButton]}
          onPress={() => signInWithProvider('github')}
          disabled={isAuthenticating}
        >
          <Text style={styles.githubButtonText}>Continue with GitHub</Text>
        </TouchableOpacity>
      </View>

      {isAuthenticating && (
        <ActivityIndicator size="small" color={t.primary} style={styles.loader} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: t.fontSerif,
    color: t.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: t.fontSerif,
    color: t.textSecondary,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  googleButton: {
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.inputBorder,
  },
  githubButton: {
    backgroundColor: t.bgDark,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: t.text,
  },
  githubButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: t.textOnPrimary,
  },
  loader: {
    marginTop: 20,
  },
});
