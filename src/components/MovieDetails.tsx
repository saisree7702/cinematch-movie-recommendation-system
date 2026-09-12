import { useEffect } from 'react';
import { X, Star, Calendar, Globe, Clock, User, Users, Sparkles } from 'lucide-react';
import type { MovieWithGenres } from '@/types';
import FavoriteButton from './FavoriteButton';
import PosterImage from './PosterImage';

interface MovieDetailsProps {
  movie: MovieWithGenres | null;
  isFav: boolean;
  onToggleFav: (movieId: string) => Promise<boolean>;
  onClose: () => void;
  matchPercentage?: number;
  matchReasons?: string[];
}

export default function MovieDetails({
  movie,
  isFav,
  onToggleFav,
  onClose,
  matchPercentage,
  matchReasons,
}: MovieDetailsProps) {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cin-surface border border-cin-border animate-scale-in scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero backdrop */}
        <div className="relative h-48 md:h-64 overflow-hidden rounded-t-3xl">
          <PosterImage
            src={movie.poster_url}
            alt=""
            className="w-full h-full object-cover blur-sm scale-110 opacity-40"
            fallbackClassName="w-full h-full opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cin-surface via-cin-surface/60 to-transparent" />
        </div>

        <div className="px-6 md:px-8 pb-8 -mt-32 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <PosterImage
                src={movie.poster_url}
                alt={movie.title}
                className="w-40 md:w-48 rounded-2xl shadow-2xl border border-cin-border object-cover"
                fallbackClassName="w-40 md:w-48 h-60 md:h-72 rounded-2xl border border-cin-border"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pt-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{movie.title}</h2>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1.5 text-cin-gold font-bold">
                  <Star className="w-4 h-4 fill-cin-gold" />
                  {movie.rating.toFixed(1)}/10
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {movie.release_year}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Globe className="w-4 h-4" />
                  {movie.language}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-cin-gold/10 text-cin-gold border border-cin-gold/20"
                  >
                    {g.name}
                  </span>
                ))}
                {movie.mood.map((m) => (
                  <span
                    key={m}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5">{movie.description}</p>

              <div className="space-y-2.5 mb-6 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Director:</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Cast:</span>
                  <span className="text-white font-medium">{movie.cast.join(', ')}</span>
                </div>
              </div>

              <FavoriteButton movieId={movie.id} isFav={isFav} onToggle={onToggleFav} variant="pill" size="lg" />
            </div>
          </div>

          {/* Why we recommend */}
          {(matchPercentage !== undefined || matchReasons) && (
            <div className="mt-6 p-5 rounded-2xl glass">
              <h3 className="flex items-center gap-2 text-white font-bold mb-3">
                <Sparkles className="w-5 h-5 text-cin-gold" />
                Why We Recommend This Movie
              </h3>
              {matchPercentage !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">Match Score</span>
                    <span className="text-sm font-bold text-cin-gold">{matchPercentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cin-gold to-cin-rose transition-all duration-500"
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>
                </div>
              )}
              {matchReasons && matchReasons.length > 0 && (
                <ul className="space-y-1.5">
                  {matchReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cin-gold mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
