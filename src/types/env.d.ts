export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_TMDB_API_KEY?: string;
      EXPO_PUBLIC_TMDB_ACCESS_TOKEN?: string;
      EXPO_PUBLIC_TMDB_BASE_URL?: string;
      EXPO_PUBLIC_TMDB_IMAGE_BASE_URL?: string;
      EXPO_PUBLIC_TMDB_LANGUAGE?: string;
      [key: string]: string | undefined;
    }
  }
}
