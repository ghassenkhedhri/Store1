
import type { SortOption } from './types';

interface SortOptionConfig {
    value: SortOption;
    label: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
];
