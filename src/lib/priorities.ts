import type { Priority } from '@/types';

export interface PriorityConfig {
  label: string;
  value: Priority;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
  order: number; // Pour le tri (1 = plus haute priorité)
}

export const prioritiesConfig: Record<Priority, PriorityConfig> = {
  high: {
    label: 'Haute',
    value: 'high',
    colors: {
      bg: 'bg-rose-100 dark:bg-rose-950',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-700',
    },
    order: 1,
  },
  medium: {
    label: 'Moyenne',
    value: 'medium',
    colors: {
      bg: 'bg-amber-100 dark:bg-amber-950',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
    },
    order: 2,
  },
  low: {
    label: 'Basse',
    value: 'low',
    colors: {
      bg: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-300 dark:border-cyan-700',
    },
    order: 3,
  },
};

export const prioritiesList: Priority[] = ['high', 'medium', 'low'];
