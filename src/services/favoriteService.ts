import { supabase } from '@/lib/supabase';
import type { Favorite, MovieWithGenres } from '@/types';
import { getMoviesByIds } from './movieService';

export async function getFavoriteMovieIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('favorites')
    .select('movie_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((f) => f.movie_id));
}

export async function getFavorites(userId: string): Promise<MovieWithGenres[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('movie_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const movieIds = (data ?? []).map((f: Pick<Favorite, 'movie_id'>) => f.movie_id);
  return getMoviesByIds(movieIds);
}

export async function addFavorite(userId: string, movieId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, movie_id: movieId });
  if (error) {
    if (error.code === '23505') return; // already favorited
    throw error;
  }
}

export async function removeFavorite(userId: string, movieId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  if (error) throw error;
}

export async function isFavorite(userId: string, movieId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
