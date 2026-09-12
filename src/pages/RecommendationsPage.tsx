import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Settings, RefreshCw } from 'lucide-react';
import type { MovieWithGenres, RecommendedMovie, UserPreferences } from '@/types';
import { GENRES, LANGUAGES, MOODS } from '@/types';
import RecommendationCard from '@/components/RecommendationCard';
import MovieDetails from '@/components/MovieDetails';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useAllMovies, useFavorites } from '@/hooks/useFavorites';
import { getUserPreferences, upsertUserPreferences } from '@/services/profileService';
import { generateRecommendations } from '@/services/recommendationService';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { movies, loading: moviesLoading } = useAllMovies();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);

  // Form state
  const [formGenres, setFormGenres] = useState<string[]>([]);
  const [formLanguages, setFormLanguages] = useState<string[]>([]);
  const [formMoods, setFormMoods] = useState<string[]>([]);
  const [formMinRating, setFormMinRating] = useState(0);
  const [formYearFrom, setFormYearFrom] = useState<number | null>(null);
  const [formYearTo, setFormYearTo] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    setPrefsLoading(true);
    getUserPreferences(user.id)
      .then((p) => {
        setPrefs(p);
        if (p) {
          setFormGenres(p.preferred_genres);
          setFormLanguages(p.preferred_languages);
          setFormMoods(p.preferred_moods);
          setFormMinRating(p.minimum_rating);
          setFormYearFrom(p.preferred_year_from);
          setFormYearTo(p.preferred_year_to);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setPrefsLoading(false));
  }, [user]);

  const generate = async (preferences: UserPreferences) => {
    if (!user) return;
    setGenerating(true);
    try {
      const favIds = Array.from(favoriteIds);
      const recs = await generateRecommendations(user.id, preferences, movies, favIds);
      setRecommendations(recs);
      if (recs.length === 0) {
        showToast('No recommendations found. Try adjusting your preferences.', 'info');
      } else {
        showToast(`Generated ${recs.length} recommendations`, 'success');
      }
    } catch (e) {
      showToast('Failed to generate recommendations', 'error');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!prefsLoading && prefs && movies.length > 0) {
      generate(prefs);
    }
  }, [prefsLoading, prefs, movies.length]);

  const handleSavePrefs = async () => {
    if (!user) return;
    try {
      const saved = await upsertUserPreferences(user.id, {
        preferred_genres: formGenres,
        preferred_languages: formLanguages,
        preferred_moods: formMoods,
        minimum_rating: formMinRating,
        preferred_year_from: formYearFrom,
        preferred_year_to: formYearTo,
      });
      setPrefs(saved);
      setShowSettings(false);
      showToast('Preferences saved', 'success');
      generate(saved);
    } catch {
      showToast('Failed to save preferences', 'error');
    }
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

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  if (prefsLoading || moviesLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><LoadingSkeleton count={6} /></div>;
  }

  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-white mb-2">
            <Sparkles className="w-8 h-8 text-cin-gold" />
            Recommended For You
          </h1>
          <p className="text-gray-400">Personalized movie picks based on your preferences and favorites.</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Preferences</span>
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-8 p-6 rounded-2xl glass animate-fade-in space-y-5">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Favorite Genres</h4>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip key={g} label={g} active={formGenres.includes(g)} onClick={() => setFormGenres(toggleArr(formGenres, g))} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Preferred Languages</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip key={l} label={l} active={formLanguages.includes(l)} onClick={() => setFormLanguages(toggleArr(formLanguages, l))} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Preferred Mood</h4>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={m} label={m} active={formMoods.includes(m)} onClick={() => setFormMoods(toggleArr(formMoods, m))} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Minimum Rating</h4>
              <select
                value={formMinRating}
                onChange={(e) => setFormMinRating(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cin-gold/40"
              >
                <option value={0}>Any rating</option>
                <option value={5}>5+</option>
                <option value={6}>6+</option>
                <option value={7}>7+</option>
                <option value={8}>8+</option>
                <option value={9}>9+</option>
              </select>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Year From</h4>
              <input
                type="number"
                placeholder="1950"
                value={formYearFrom ?? ''}
                onChange={(e) => setFormYearFrom(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Year To</h4>
              <input
                type="number"
                placeholder="2025"
                value={formYearTo ?? ''}
                onChange={(e) => setFormYearTo(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
            </div>
          </div>
          <button
            onClick={handleSavePrefs}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cin-gold to-cin-rose text-black font-bold text-sm hover:opacity-90 transition"
          >
            Save & Generate
          </button>
        </div>
      )}

      {/* Recommendations */}
      {generating ? (
        <LoadingSkeleton count={6} />
      ) : recommendations.length === 0 ? (
        <EmptyState
          title="No recommendations yet"
          message="Set your preferences to get personalized movie recommendations tailored to your taste."
          action={
            <button onClick={() => setShowSettings(true)} className="px-6 py-2.5 rounded-full bg-cin-gold text-black font-bold text-sm hover:bg-cin-gold/90 transition">
              Set Preferences
            </button>
          }
        />
      ) : (
        <>
          <button
            onClick={() => prefs && generate(prefs)}
            className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Recommendations
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {recommendations.map((movie) => (
              <RecommendationCard
                key={movie.id}
                movie={movie}
                isFav={favoriteIds.has(movie.id)}
                onToggleFav={toggleFavorite}
                onClick={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        </>
      )}

      <MovieDetails
        movie={selectedMovie}
        isFav={selectedMovie ? favoriteIds.has(selectedMovie.id) : false}
        onToggleFav={toggleFavorite}
        onClose={() => setSelectedMovie(null)}
        matchPercentage={(recommendations.find((r) => r.id === selectedMovie?.id))?.matchPercentage}
        matchReasons={(recommendations.find((r) => r.id === selectedMovie?.id))?.matchReasons}
      />
    </div>
  );
}
