
export enum BadgeType {
  Trending = 'trending',
  New = 'new',
  Eco = 'eco',
  FastShip = 'fast-ship',
  Deal = 'deal',
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  active: boolean;
  priceCents: number;
  currency: 'USD';
  rating: number; // 1-5
  reviewCount: number;
  imageUrl: string;
  tags?: string[];
  badges?: BadgeType[];
}

export type SortOption = 'trending' | 'newest' | 'price-asc' | 'price-desc';
