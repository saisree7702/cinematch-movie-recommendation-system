import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface FavoriteButtonProps {
  movieId: string;
  isFav: boolean;
  onToggle: (movieId: string) => Promise<boolean>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'pill';
}

export default function FavoriteButton({ movieId, isFav, onToggle, size = 'md', variant = 'icon' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to save favorites', 'info');
      return;
    }
    const added = await onToggle(movieId);
    showToast(added ? 'Added to favorites' : 'Removed from favorites', added ? 'success' : 'info');
  };

  if (variant === 'pill') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
          isFav
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
            : 'glass text-gray-300 hover:text-white hover:border-white/20'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        {isFav ? 'Favorited' : 'Add to Favorites'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full glass transition-all duration-300 hover:scale-110 ${
        isFav ? 'text-rose-500' : 'text-gray-300 hover:text-white'
      }`}
    >
      <Heart className={`${iconSizes[size]} ${isFav ? 'fill-rose-500' : ''}`} />
    </button>
  );
}
