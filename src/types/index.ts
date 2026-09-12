export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string | null;
  release_year: number;
  rating: number;
  language: string;
  duration: number;
  director: string;
  cast: string[];
  mood: string[];
  created_at: string;
  genres?: Genre[];
}

export interface MovieWithGenres extends Movie {
  genres: Genre[];
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_genres: string[];
  preferred_languages: string[];
  preferred_moods: string[];
  minimum_rating: number;
  preferred_year_from: number | null;
  preferred_year_to: number | null;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
  movie?: MovieWithGenres;
}

export interface RecommendationHistory {
  id: string;
  user_id: string;
  movie_id: string;
  recommendation_score: number;
  created_at: string;
}

export interface RecommendedMovie extends MovieWithGenres {
  matchPercentage: number;
  matchReasons: string[];
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface FilterState {
  search: string;
  genres: string[];
  languages: string[];
  yearFrom: number | null;
  yearTo: number | null;
  minRating: number | null;
  moods: string[];
  sortBy: SortOption;
}

export type SortOption = 'rating_desc' | 'year_desc' | 'year_asc' | 'title_asc';

export const GENRES = [
  'Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Horror',
  'Sci-Fi', 'Fantasy', 'Animation', 'Adventure', 'Crime', 'Mystery',
] as const;

export const LANGUAGES = [
  'English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam',
  'Kannada', 'Korean', 'Japanese', 'Other',
] as const;

export const MOODS = [
  'Happy', 'Relaxed', 'Romantic', 'Excited', 'Emotional',
  'Thrilling', 'Scared', 'Motivated',
] as const;

export const RATINGS = [5, 6, 7, 8, 9] as const;
