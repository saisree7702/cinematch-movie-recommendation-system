import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { MovieWithGenres, FilterState } from '@/types';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import MovieGrid from '@/components/MovieGrid';
import MovieDetails from '@/components/MovieDetails';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { useAllMovies, useFavorites } from '@/hooks/useFavorites';
import { filterAndSortMovies } from '@/services/movieService';

const defaultFilters: FilterState = {
  search: '',
  genres: [],
  languages: [],
  yearFrom: null,
  yearTo: null,
  minRating: null,
  moods: [],
  sortBy: 'rating_desc',
};

export default function DiscoverPage() {
  const { movies, loading, error } = useAllMovies();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);

  const filteredMovies = useMemo(() => filterAndSortMovies(movies, appliedFilters), [movies, appliedFilters]);

  const handleApply = () => setAppliedFilters(filters);
  const handleClear = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Your Next Movie</h1>
        <p className="text-gray-400">Search, filter, and find the perfect movie for any mood.</p>
      </div>

      <div className="mb-6">
        <SearchBar value={filters.search} onChange={(v) => { setFilters({ ...filters, search: v }); setAppliedFilters({ ...appliedFilters, search: v }); }} />
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onApply={handleApply}
            onClear={handleClear}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
          />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              <span className="text-white font-bold">{filteredMovies.length}</span> movies found
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Sort: {appliedFilters.sortBy === 'rating_desc' ? 'Highest Rated' : appliedFilters.sortBy === 'year_desc' ? 'Newest' : appliedFilters.sortBy === 'year_asc' ? 'Oldest' : 'A-Z'}</span>
            </div>
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : loading ? (
            <LoadingSkeleton count={10} />
          ) : filteredMovies.length === 0 ? (
            <EmptyState
              title="No movies found"
              message="Try adjusting your filters or search terms to find more movies."
              action={
                <button onClick={handleClear} className="px-6 py-2.5 rounded-full bg-cin-gold text-black font-bold text-sm hover:bg-cin-gold/90 transition">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <MovieGrid
              movies={filteredMovies}
              favoriteIds={favoriteIds}
              onToggleFav={toggleFavorite}
              onMovieClick={setSelectedMovie}
            />
          )}
        </div>
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
