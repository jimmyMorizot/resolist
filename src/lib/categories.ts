import type { Category, CategoryConfig } from '@/types';

/**
 * Configuration complète des catégories
 *
 * Chaque catégorie possède :
 * - Un label français
 * - Des couleurs Tailwind cohérentes (bg, text, border)
 * - Une icône Lucide React
 * - Des couleurs pour le confetti lors de la complétion
 */
export const CATEGORIES: Record<Category, CategoryConfig> = {
  health: {
    label: 'Santé',
    colors: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
    },
    icon: 'Heart',
    confettiColors: ['#22c55e', '#86efac', '#4ade80'],
  },
  work: {
    label: 'Travail',
    colors: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
    },
    icon: 'Briefcase',
    confettiColors: ['#3b82f6', '#93c5fd', '#60a5fa'],
  },
  personal: {
    label: 'Personnel',
    colors: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
    },
    icon: 'User',
    confettiColors: ['#a855f7', '#d8b4fe', '#c084fc'],
  },
  finance: {
    label: 'Finance',
    colors: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
    },
    icon: 'DollarSign',
    confettiColors: ['#eab308', '#fde047', '#facc15'],
  },
  leisure: {
    label: 'Loisirs',
    colors: {
      bg: 'bg-pink-100',
      text: 'text-pink-700',
      border: 'border-pink-300',
    },
    icon: 'Sparkles',
    confettiColors: ['#ec4899', '#fbcfe8', '#f9a8d4'],
  },
  other: {
    label: 'Autre',
    colors: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
    },
    icon: 'MoreHorizontal',
    confettiColors: ['#6b7280', '#d1d5db', '#9ca3af'],
  },
};

/**
 * Retourne la configuration d'une catégorie
 */
export const getCategoryConfig = (category: Category): CategoryConfig => {
  return CATEGORIES[category];
};

/**
 * Retourne toutes les catégories disponibles
 */
export const getAllCategories = (): Category[] => {
  return Object.keys(CATEGORIES) as Category[];
};
