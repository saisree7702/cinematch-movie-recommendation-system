import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import type { MovieWithGenres } from '@/types';
import MovieGrid from '@/components/MovieGrid';
import MovieDetails from '@/components/MovieDetails';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getFavorites, removeFavorite } from '@/services/favoriteService';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<MovieWithGenres[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const favs = await getFavorites(user.id);
      setFavorites(favs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleRemove = async (movieId: string) => {
    if (!user) return;
    try {
      await removeFavorite(user.id, movieId);
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
      showToast('Removed from favorites', 'success');
    } catch {
      showToast('Failed to remove favorite', 'error');
    }
  };

  const favoriteIds = new Set(favorites.map((m) => m.id));

  const toggleFav = async (movieId: string): Promise<boolean> => {
    await handleRemove(movieId);
    return false;
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><LoadingSkeleton count={8} /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><ErrorMessage message={error} onRetry={loadFavorites} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-white mb-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          Your Favorites
        </h1>
        <p className="text-gray-400">{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved to your collection.</p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Start adding movies to your favorites by clicking the heart icon on any movie card."
          action={
            <Link to="/discover" className="px-6 py-2.5 rounded-full bg-cin-gold text-black font-bold text-sm hover:bg-cin-gold/90 transition">
              Discover Movies
            </Link>
          }
        />
      ) : (
        <>
          <MovieGrid
            movies={favorites}
            favoriteIds={favoriteIds}
            onToggleFav={toggleFav}
            onMovieClick={setSelectedMovie}
          />
        </>
      )}

      <MovieDetails
        movie={selectedMovie}
        isFav={selectedMovie ? favoriteIds.has(selectedMovie.id) : false}
        onToggleFav={toggleFav}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
