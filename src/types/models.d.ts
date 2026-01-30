// Type definitions for the application

export interface Series {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  rating: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in milliseconds
  thumbnailUrl: string;
  premium: boolean;
  coinsRequired?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  type: "purchase" | "spend";
  amount: number;
  description: string;
  date: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  currency: string;
  bonus?: number;
}
