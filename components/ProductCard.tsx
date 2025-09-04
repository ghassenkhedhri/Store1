import React from 'react';
import type { Product } from '../types';
import Badge from './Badge';
import { StarIcon, ShoppingCartIcon } from './icons/Icon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceCents / 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-ink-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.badges?.map(badgeType => (
            <Badge key={badgeType} type={badgeType} />
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-grow">
          <a href={`/product/${product.slug}`} className="hover:text-accent">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </a>
        </h3>
        <div className="flex items-center mt-2">
          {renderStars(product.rating)}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex justify-between items-end mt-4">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(product.priceCents)}</p>
           <button className="relative z-10 flex items-center justify-center gap-2 bg-accent text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-ink-200 focus:ring-accent transition-colors">
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;