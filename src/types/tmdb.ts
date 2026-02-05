export type TMDBMediaType = "movie" | "tv" | "person";

export interface TMDBPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

export interface TMDBTvListItem {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  vote_average: number;
  first_air_date?: string;
}

export interface TMDBTvSeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface TMDBTvDetails extends TMDBTvListItem {
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  seasons?: TMDBTvSeasonSummary[];
}

export interface TMDBTvDetailsAppended extends TMDBTvDetails {
  credits?: TMDBCredits;
  recommendations?: TMDBPagedResponse<TMDBTvListItem>;
}

export interface TMDBTvEpisode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  still_path: string | null;
  air_date?: string;
  runtime?: number;
}

export interface TMDBTvSeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: TMDBTvEpisode[];
}

export interface TMDBCast {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  order?: number;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBCast[];
}

export interface TMDBMultiSearchItem {
  id: number;
  media_type: TMDBMediaType;
  name?: string; // tv/person
  title?: string; // movie
  overview?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
}
