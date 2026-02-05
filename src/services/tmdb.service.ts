import axios from "axios";

import type {
  TMDBCredits,
  TMDBGenreListResponse,
  TMDBMultiSearchItem,
  TMDBPagedResponse,
  TMDBTvDetailsAppended,
  TMDBTvListItem,
  TMDBTvSeasonDetails,
} from "../types/tmdb";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";
const TMDB_LANGUAGE = process.env.EXPO_PUBLIC_TMDB_LANGUAGE ?? "en-US";

function assertAuth() {
  if (!TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
    throw new Error(
      "Missing TMDB auth. Set EXPO_PUBLIC_TMDB_API_KEY or EXPO_PUBLIC_TMDB_ACCESS_TOKEN in your .env file.",
    );
  }
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

tmdbClient.interceptors.request.use((config) => {
  if (TMDB_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  }
  return config;
});

function authParams() {
  return TMDB_API_KEY ? { api_key: TMDB_API_KEY } : {};
}

export function tmdbImageUrl(
  path: string | null | undefined,
  size: string = "w500",
) {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export const tmdbService = {
  async getTvGenres() {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBGenreListResponse>(
      "/genre/tv/list",
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
        },
      },
    );
    return data;
  },

  async discoverTvByGenre(genreId: number, page: number = 1) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBPagedResponse<TMDBTvListItem>>(
      "/discover/tv",
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
          page,
          sort_by: "popularity.desc",
          include_adult: false,
          include_null_first_air_dates: false,
          with_genres: String(genreId),
        },
      },
    );
    return data;
  },

  async getPopularTv(page: number = 1) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBPagedResponse<TMDBTvListItem>>(
      "/tv/popular",
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
          page,
        },
      },
    );
    return data;
  },

  async getTopRatedTv(page: number = 1) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBPagedResponse<TMDBTvListItem>>(
      "/tv/top_rated",
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
          page,
        },
      },
    );
    return data;
  },

  async searchMulti(query: string, page: number = 1) {
    assertAuth();
    const { data } = await tmdbClient.get<
      TMDBPagedResponse<TMDBMultiSearchItem>
    >("/search/multi", {
      params: {
        ...authParams(),
        language: TMDB_LANGUAGE,
        page,
        include_adult: false,
        query,
      },
    });
    return data;
  },

  async getTvDetails(tvId: number, options?: { appendToResponse?: string[] }) {
    assertAuth();

    const append = (options?.appendToResponse ?? [])
      .filter((s): s is string => Boolean(s))
      .join(",");

    const { data } = await tmdbClient.get<TMDBTvDetailsAppended>(
      `/tv/${tvId}`,
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
          ...(append ? { append_to_response: append } : {}),
        },
      },
    );
    return data;
  },

  async getTvCredits(tvId: number) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBCredits>(`/tv/${tvId}/credits`, {
      params: {
        ...authParams(),
        language: TMDB_LANGUAGE,
      },
    });
    return data;
  },

  async getTvRecommendations(tvId: number, page: number = 1) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBPagedResponse<TMDBTvListItem>>(
      `/tv/${tvId}/recommendations`,
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
          page,
        },
      },
    );
    return data;
  },

  async getTvSeasonDetails(tvId: number, seasonNumber: number) {
    assertAuth();
    const { data } = await tmdbClient.get<TMDBTvSeasonDetails>(
      `/tv/${tvId}/season/${seasonNumber}`,
      {
        params: {
          ...authParams(),
          language: TMDB_LANGUAGE,
        },
      },
    );
    return data;
  },
};
