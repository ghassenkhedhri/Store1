
import React from 'react';
import { BadgeType } from '../types';

interface BadgeProps {
  type: BadgeType;
}

const badgeConfig = {
  [BadgeType.Trending]: { icon: '🔥', text: 'Trending', style: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
  [BadgeType.New]: { icon: '✨', text: 'New', style: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  [BadgeType.Eco]: { icon: '♻️', text: 'Eco', style: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  [BadgeType.FastShip]: { icon: '⚡', text: 'Fast Ship', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  [BadgeType.Deal]: { icon: '🏷️', text: 'Deal', style: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
};

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const config = badgeConfig[type];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.style}`}>
      {config.icon} <span className="ml-1.5">{config.text}</span>
    </span>
  );
};

export default Badge;
