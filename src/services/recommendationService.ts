import { supabase } from '@/lib/supabase';
import type { MovieWithGenres, UserPreferences, RecommendedMovie } from '@/types';

export function scoreMovie(
  movie: MovieWithGenres,
  prefs: Pick<
    UserPreferences,
    'preferred_genres' | 'preferred_languages' | 'preferred_moods' | 'minimum_rating' | 'preferred_year_from' | 'preferred_year_to'
  >,
  favoriteGenres: string[] = []
): { score: number; reasons: string[] } {
  let score = 0;
  let maxScore = 0;
  const reasons: string[] = [];

  // Genre match (40% weight)
  maxScore += 40;
  const movieGenreNames = movie.genres.map((g) => g.name);
  const genreMatches = movieGenreNames.filter((g) => prefs.preferred_genres.includes(g));
  if (prefs.preferred_genres.length > 0) {
    if (genreMatches.length > 0) {
      score += 40 * (genreMatches.length / Math.max(movieGenreNames.length, genreMatches.length));
      reasons.push(`Matches your preferred genre${genreMatches.length > 1 ? 's' : ''}: ${genreMatches.join(', ')}`);
    }
    // Bonus for genres the user frequently favorites
    const favGenreMatches = movieGenreNames.filter((g) => favoriteGenres.includes(g));
    if (favGenreMatches.length > 0 && !genreMatches.includes(favGenreMatches[0])) {
      score += 5;
    }
  } else {
    score += 20; // neutral if no preference set
  }

  // Language match (20% weight)
  maxScore += 20;
  if (prefs.preferred_languages.length > 0) {
    if (prefs.preferred_languages.includes(movie.language)) {
      score += 20;
      reasons.push(`Available in your preferred language: ${movie.language}`);
    }
  } else {
    score += 10;
  }

  // Mood match (15% weight)
  maxScore += 15;
  if (prefs.preferred_moods.length > 0) {
    const moodMatches = movie.mood.filter((m) => prefs.preferred_moods.includes(m));
    if (moodMatches.length > 0) {
      score += 15 * (moodMatches.length / prefs.preferred_moods.length);
      reasons.push(`Matches your mood: ${moodMatches.join(', ')}`);
    }
  } else {
    score += 7;
  }

  // Rating (15% weight)
  maxScore += 15;
  const ratingScore = (movie.rating / 10) * 15;
  score += ratingScore;
  if (movie.rating >= prefs.minimum_rating) {
    if (movie.rating >= 8.5) {
      reasons.push(`Highly rated (${movie.rating.toFixed(1)}/10)`);
    }
  } else {
    score -= 5; // penalize below minimum
  }

  // Release year (10% weight)
  maxScore += 10;
  if (prefs.preferred_year_from !== null && prefs.preferred_year_to !== null) {
    if (movie.release_year >= prefs.preferred_year_from && movie.release_year <= prefs.preferred_year_to) {
      score += 10;
      reasons.push(`Released in your preferred period (${movie.release_year})`);
    }
  } else {
    score += 5;
  }

  const finalScore = Math.min(100, Math.round((score / maxScore) * 100));
  if (reasons.length === 0) {
    reasons.push('Popular pick that aligns with your general taste');
  }
  return { score: finalScore, reasons };
}

export async function generateRecommendations(
  userId: string,
  prefs: UserPreferences,
  allMovies: MovieWithGenres[],
  favoriteMovieIds: string[]
): Promise<RecommendedMovie[]> {
  // Derive favorite genres from favorited movies
  const favMovies = allMovies.filter((m) => favoriteMovieIds.includes(m.id));
  const favoriteGenres = Array.from(
    new Set(favMovies.flatMap((m) => m.genres.map((g) => g.name)))
  );

  const scored = allMovies
    .filter((m) => !favoriteMovieIds.includes(m.id)) // don't recommend already-favorited
    .map((movie) => {
      const { score, reasons } = scoreMovie(movie, prefs, favoriteGenres);
      return { ...movie, matchPercentage: score, matchReasons: reasons };
    })
    .filter((m) => m.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 20);

  // Save to recommendation_history
  if (scored.length > 0) {
    const historyRows = scored.map((m) => ({
      user_id: userId,
      movie_id: m.id,
      recommendation_score: m.matchPercentage,
    }));
    await supabase.from('recommendation_history').insert(historyRows);
  }

  return scored;
}

export async function getRecommendationHistory(userId: string): Promise<{ movie_id: string; recommendation_score: number }[]> {
  const { data, error } = await supabase
    .from('recommendation_history')
    .select('movie_id, recommendation_score')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}
