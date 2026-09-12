import { supabase } from '@/lib/supabase';
import type { Profile, UserPreferences } from '@/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertUserPreferences(
  userId: string,
  prefs: Omit<UserPreferences, 'id' | 'user_id' | 'updated_at'>
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      preferred_genres: prefs.preferred_genres,
      preferred_languages: prefs.preferred_languages,
      preferred_moods: prefs.preferred_moods,
      minimum_rating: prefs.minimum_rating,
      preferred_year_from: prefs.preferred_year_from,
      preferred_year_to: prefs.preferred_year_to,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
