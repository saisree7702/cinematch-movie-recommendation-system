import { Star, Globe, Sparkles } from 'lucide-react';
import type { RecommendedMovie } from '@/types';
import FavoriteButton from './FavoriteButton';
import PosterImage from './PosterImage';

interface RecommendationCardProps {
  movie: RecommendedMovie;
  isFav: boolean;
  onToggleFav: (movieId: string) => Promise<boolean>;
  onClick: (movie: RecommendedMovie) => void;
}

export default function RecommendationCard({ movie, isFav, onToggleFav, onClick }: RecommendationCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="group relative rounded-2xl overflow-hidden bg-cin-card border border-cin-border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-cin-gold/40 hover:shadow-2xl hover:shadow-cin-gold/10"
    >
      <div className="flex gap-4 p-4">
        <PosterImage
          src={movie.poster_url}
          alt={movie.title}
          className="w-24 h-36 md:w-28 md:h-40 rounded-xl object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
          fallbackClassName="w-24 h-36 md:w-28 md:h-40 rounded-xl flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-sm md:text-base leading-tight line-clamp-2">{movie.title}</h3>
            <FavoriteButton movieId={movie.id} isFav={isFav} onToggle={onToggleFav} size="sm" />
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1 text-cin-gold font-bold">
              <Star className="w-3 h-3 fill-cin-gold" />
              {movie.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {movie.language}
            </span>
            <span>{movie.release_year}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g.id}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Match percentage */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Sparkles className="w-3 h-3 text-cin-gold" />
                Match
              </span>
              <span className="text-xs font-bold text-cin-gold">{movie.matchPercentage}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cin-gold to-cin-rose"
                style={{ width: `${movie.matchPercentage}%` }}
              />
            </div>
          </div>

          {/* Why */}
          <div className="space-y-1 mb-3">
            {movie.matchReasons.slice(0, 2).map((r, i) => (
              <p key={i} className="text-[11px] text-gray-400 leading-snug">
                <span className="text-cin-gold">•</span> {r}
              </p>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(movie);
            }}
            className="text-xs font-semibold text-cin-gold hover:text-cin-gold/80 transition"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
