import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, TrendingUp, Star, Clock, ArrowRight, Play } from 'lucide-react';
import type { MovieWithGenres } from '@/types';
import MovieGrid from '@/components/MovieGrid';
import MovieDetails from '@/components/MovieDetails';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { useAllMovies, useFavorites } from '@/hooks/useFavorites';

export default function HomePage() {
  const { movies, loading, error } = useAllMovies();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);

  const trending = useMemo(() => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10), [movies]);
  const popular = useMemo(() => [...movies].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 10), [movies]);
  const topRated = useMemo(() => [...movies].filter((m) => m.rating >= 8.5).sort((a, b) => b.rating - a.rating), [movies]);
  const recent = useMemo(() => [...movies].sort((a, b) => b.release_year - a.release_year).slice(0, 10), [movies]);

  if (error) return <ErrorMessage message={error} />;
  if (loading) return <div className="px-4 max-w-7xl mx-auto pt-8"><LoadingSkeleton count={10} /></div>;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          {trending[0]?.poster_url && (
            <img src={trending[0].poster_url} alt="" className="w-full h-full object-cover blur-2xl scale-125 opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-cin-bg/70 via-cin-bg/85 to-cin-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-cin-bg via-transparent to-cin-bg" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cin-gold" />
            <span className="text-sm text-gray-300 font-medium">Discover Movies You'll Love</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Find Your Next
            <br />
            <span className="text-gradient">Favorite Movie</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
            Discover personalized movie recommendations based on your taste, mood, and preferences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              to="/discover"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cin-gold to-cin-rose text-black font-bold hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              <Film className="w-5 h-5" />
              Discover Movies
            </Link>
            <Link
              to="/recommendations"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass text-white font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-cin-gold" />
              Get Personalized Recommendations
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Film className="w-4 h-4" /> {movies.length}+ Movies</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Curated Ratings</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Smart Matching</span>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 pb-10">
        <MovieSection
          title="Trending Movies"
          icon={<TrendingUp className="w-5 h-5 text-cin-gold" />}
          movies={trending}
          favoriteIds={favoriteIds}
          onToggleFav={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

        <MovieSection
          title="Top Rated Movies"
          icon={<Star className="w-5 h-5 text-cin-gold" />}
          movies={topRated}
          favoriteIds={favoriteIds}
          onToggleFav={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

        <MovieSection
          title="Recently Added"
          icon={<Clock className="w-5 h-5 text-cin-gold" />}
          movies={recent}
          favoriteIds={favoriteIds}
          onToggleFav={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

        <MovieSection
          title="Popular Movies"
          icon={<Play className="w-5 h-5 text-cin-gold" />}
          movies={popular}
          favoriteIds={favoriteIds}
          onToggleFav={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

        {movies.length === 0 && !loading && (
          <EmptyState title="No movies found" message="Check back later for new additions to our catalog." />
        )}
      </div>

      <MovieDetails
        movie={selectedMovie}
        isFav={selectedMovie ? favoriteIds.has(selectedMovie.id) : false}
        onToggleFav={toggleFavorite}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

function MovieSection({
  title,
  icon,
  movies,
  favoriteIds,
  onToggleFav,
  onMovieClick,
}: {
  title: string;
  icon: React.ReactNode;
  movies: MovieWithGenres[];
  favoriteIds: Set<string>;
  onToggleFav: (id: string) => Promise<boolean>;
  onMovieClick: (m: MovieWithGenres) => void;
}) {
  if (movies.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white">
          {icon}
          {title}
        </h2>
        <Link
          to="/discover"
          className="flex items-center gap-1 text-sm text-cin-gold hover:text-cin-gold/80 transition font-medium"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <MovieGrid
        movies={movies.slice(0, 10)}
        favoriteIds={favoriteIds}
        onToggleFav={onToggleFav}
        onMovieClick={onMovieClick}
      />
    </section>
  );
}
