export type Category = 'health' | 'work' | 'personal' | 'finance' | 'leisure' | 'other';

export interface Resolution {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  dueDate?: string; // Date butoir optionnelle (format ISO)
  createdAt: string;
  updatedAt: string;
}

export interface CategoryConfig {
  label: string;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
  icon: string;
  confettiColors: string[];
}
