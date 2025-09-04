import React from 'react';
import { SearchIcon, ShoppingCartIcon, UserIcon, SunIcon, MoonIcon } from './icons/Icon';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onSearch }) => {
  return (
    <header className="bg-white/80 dark:bg-charcoal/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" className="text-accent" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
              </svg>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">LumenMart</span>
            </a>
          </div>
          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full bg-gray-100 dark:bg-ink-200 border border-transparent rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-black focus:text-gray-900 dark:focus:text-white focus:placeholder-gray-400 focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-charcoal focus:ring-accent">
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              <a href="#" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-200">
                <UserIcon className="h-6 w-6" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-200 relative">
                <ShoppingCartIcon className="h-6 w-6" />
                 <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent ring-2 ring-white dark:ring-charcoal"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;