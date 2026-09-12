import { supabase } from '@/lib/supabase';
import type { Movie, MovieWithGenres, Genre, FilterState } from '@/types';

export async function getGenres(): Promise<Genre[]> {
  const { data, error } = await supabase.from('genres').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getAllMovies(): Promise<MovieWithGenres[]> {
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      genres:movie_genres(genre:genres(id, name))
    `)
    .order('rating', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    ...m,
    genres: (m.genres as { genre: Genre }[]).map((g) => g.genre),
  }));
}

export async function getMovieById(id: string): Promise<MovieWithGenres | null> {
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      genres:movie_genres(genre:genres(id, name))
    `)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    genres: (data.genres as { genre: Genre }[]).map((g) => g.genre),
  };
}

export async function getMoviesByIds(ids: string[]): Promise<MovieWithGenres[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      genres:movie_genres(genre:genres(id, name))
    `)
    .in('id', ids);
  if (error) throw error;
  return (data ?? []).map((m) => ({
    ...m,
    genres: (m.genres as { genre: Genre }[]).map((g) => g.genre),
  }));
}

export function filterAndSortMovies(movies: MovieWithGenres[], filters: FilterState): MovieWithGenres[] {
  let result = [...movies];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some((c) => c.toLowerCase().includes(q))
    );
  }

  if (filters.genres.length > 0) {
    result = result.filter((m) =>
      m.genres.some((g) => filters.genres.includes(g.name))
    );
  }

  if (filters.languages.length > 0) {
    result = result.filter((m) => filters.languages.includes(m.language));
  }

  if (filters.moods.length > 0) {
    result = result.filter((m) => m.mood.some((mo) => filters.moods.includes(mo)));
  }

  if (filters.minRating !== null) {
    result = result.filter((m) => m.rating >= filters.minRating!);
  }

  if (filters.yearFrom !== null) {
    result = result.filter((m) => m.release_year >= filters.yearFrom!);
  }

  if (filters.yearTo !== null) {
    result = result.filter((m) => m.release_year <= filters.yearTo!);
  }

  switch (filters.sortBy) {
    case 'rating_desc':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'year_desc':
      result.sort((a, b) => b.release_year - a.release_year);
      break;
    case 'year_asc':
      result.sort((a, b) => a.release_year - b.release_year);
      break;
    case 'title_asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return result;
}
