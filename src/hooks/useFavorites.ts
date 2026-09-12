import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getFavoriteMovieIds, addFavorite, removeFavorite } from '@/services/favoriteService';
import { getAllMovies } from '@/services/movieService';
import type { MovieWithGenres } from '@/types';

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    setLoading(true);
    getFavoriteMovieIds(user.id)
      .then(setFavoriteIds)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const toggleFavorite = useCallback(async (movieId: string): Promise<boolean> => {
    if (!user) return false;
    if (favoriteIds.has(movieId)) {
      await removeFavorite(user.id, movieId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
      return false;
    } else {
      await addFavorite(user.id, movieId);
      setFavoriteIds((prev) => new Set(prev).add(movieId));
      return true;
    }
  }, [user, favoriteIds]);

  const isFavorite = useCallback((movieId: string) => favoriteIds.has(movieId), [favoriteIds]);

  return { favoriteIds, loading, toggleFavorite, isFavorite };
}

export function useAllMovies(): { movies: MovieWithGenres[]; loading: boolean; error: string | null } {
  const [movies, setMovies] = useState<MovieWithGenres[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllMovies()
      .then(setMovies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}
