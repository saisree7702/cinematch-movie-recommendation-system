import type { MovieWithGenres } from '@/types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: MovieWithGenres[];
  favoriteIds: Set<string>;
  onToggleFav: (movieId: string) => Promise<boolean>;
  onMovieClick: (movie: MovieWithGenres) => void;
}

export default function MovieGrid({ movies, favoriteIds, onToggleFav, onMovieClick }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFav={favoriteIds.has(movie.id)}
          onToggleFav={onToggleFav}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
}
