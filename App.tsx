import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import { products as initialProducts } from './data/seed';
// Fix: Import BadgeType enum to use its members for type-safe comparisons.
import { BadgeType, type Product, type SortOption } from './types';
import { SORT_OPTIONS } from './constants';
import { FilterIcon, XIcon } from './components/icons/Icon';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('trending');

  useEffect(() => {
    const isDarkModePreferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkModePreferred);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'trending':
        // Fix: Use BadgeType.Trending enum member instead of the string "trending" for type-safe comparison.
        filtered.sort((a, b) => (b.badges?.includes(BadgeType.Trending) ? 1 : -1) - (a.badges?.includes(BadgeType.Trending) ? 1 : -1) || b.rating - a.rating);
        break;
      case 'newest':
        // Fix: Use BadgeType.New enum member instead of the string "new" for type-safe comparison.
        filtered.sort((a, b) => (b.badges?.includes(BadgeType.New) ? 1 : -1) - (a.badges?.includes(BadgeType.New) ? 1 : -1) || b.id - a.id);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.priceCents - a.priceCents);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, sortOption]);

  return (
    <div className="min-h-screen bg-light dark:bg-charcoal transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onSearch={setSearchTerm} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white dark:bg-ink-200 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <ProductGrid products={filteredAndSortedProducts} />
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 dark:text-gray-400">No products found for "{searchTerm}".</p>
          </div>
        )}
      </main>
       <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} LumenMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;