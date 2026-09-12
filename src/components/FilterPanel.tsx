import { SlidersHorizontal, X } from 'lucide-react';
import { GENRES, LANGUAGES, MOODS, RATINGS } from '@/types';
import type { FilterState, SortOption } from '@/types';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ filters, onChange, onApply, onClear, isOpen, onToggle }: FilterPanelProps) {
  const toggleArrayValue = (key: 'genres' | 'languages' | 'moods', value: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-cin-gold/20 text-cin-gold border border-cin-gold/40'
          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-semibold text-white"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block fixed lg:static inset-0 z-50 lg:z-auto bg-black/80 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-0 p-4 lg:p-0 overflow-y-auto`}
      >
        <div className="glass rounded-2xl p-5 lg:sticky lg:top-24 max-w-full lg:max-w-none">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-lg">Filters</h3>
            <button onClick={onToggle} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Genre */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Genre</h4>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip
                  key={g}
                  label={g}
                  active={filters.genres.includes(g)}
                  onClick={() => toggleArrayValue('genres', g)}
                />
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Language</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  active={filters.languages.includes(l)}
                  onClick={() => toggleArrayValue('languages', l)}
                />
              ))}
            </div>
          </div>

          {/* Release Year */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Release Year</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="From"
                value={filters.yearFrom ?? ''}
                onChange={(e) => onChange({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                placeholder="To"
                value={filters.yearTo ?? ''}
                onChange={(e) => onChange({ ...filters, yearTo: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Minimum Rating</h4>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map((r) => (
                <Chip
                  key={r}
                  label={`${r}+`}
                  active={filters.minRating === r}
                  onClick={() => onChange({ ...filters, minRating: filters.minRating === r ? null : r })}
                />
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Mood</h4>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  active={filters.moods.includes(m)}
                  onClick={() => toggleArrayValue('moods', m)}
                />
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Sort By</h4>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cin-gold/40"
            >
              <option value="rating_desc">Highest Rated</option>
              <option value="year_desc">Newest</option>
              <option value="year_asc">Oldest</option>
              <option value="title_asc">A-Z</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onApply();
                onToggle();
              }}
              className="flex-1 py-2.5 rounded-xl bg-cin-gold text-black text-sm font-bold hover:bg-cin-gold/90 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={onClear}
              className="flex-1 py-2.5 rounded-xl glass text-gray-300 text-sm font-semibold hover:text-white transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
