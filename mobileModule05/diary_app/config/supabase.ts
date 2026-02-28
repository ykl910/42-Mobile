import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://qsecxssxxcpjlatrizdc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZWN4c3N4eGNwamxhdHJpemRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjI3NTcsImV4cCI6MjA4NzY5ODc1N30.YssnWnfDROLpeTRPaEK7MMUSjqbJW1ugkmPgNbJDDuM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
