import { Star, Calendar, Globe } from 'lucide-react';
import type { MovieWithGenres } from '@/types';
import FavoriteButton from './FavoriteButton';
import PosterImage from './PosterImage';

interface MovieCardProps {
  movie: MovieWithGenres;
  isFav: boolean;
  onToggleFav: (movieId: string) => Promise<boolean>;
  onClick: (movie: MovieWithGenres) => void;
}

export default function MovieCard({ movie, isFav, onToggleFav, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="group relative rounded-2xl overflow-hidden bg-cin-card border border-cin-border cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-cin-gold/40 hover:shadow-2xl hover:shadow-cin-gold/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <PosterImage
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fallbackClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-cin-gold/30">
          <Star className="w-3.5 h-3.5 text-cin-gold fill-cin-gold" />
          <span className="text-xs font-bold text-cin-gold">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Favorite button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton movieId={movie.id} isFav={isFav} onToggle={onToggleFav} size="sm" />
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {movie.release_year}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {movie.language}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {movie.genres.slice(0, 3).map((g) => (
            <span
              key={g.id}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
            >
              {g.name}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{movie.description}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(movie);
          }}
          className="mt-3 w-full py-2 rounded-lg bg-white/5 hover:bg-cin-gold/20 text-gray-300 hover:text-cin-gold text-xs font-semibold border border-white/10 hover:border-cin-gold/40 transition-all duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
