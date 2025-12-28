// Types pour l'application ResoList

/**
 * Catégories disponibles pour les résolutions
 */
export type Category = 'health' | 'work' | 'personal' | 'finance' | 'leisure' | 'other';

/**
 * Interface principale pour une résolution
 */
export interface Resolution {
  /** Identifiant unique (UUID) */
  id: string;

  /** Titre de la résolution (3-200 caractères) */
  title: string;

  /** Catégorie de la résolution */
  category: Category;

  /** Statut : complétée ou non */
  completed: boolean;

  /** Date de création (ISO string) */
  createdAt: string;

  /** Date de dernière modification (ISO string) */
  updatedAt: string;
}

/**
 * Configuration pour une catégorie
 */
export interface CategoryConfig {
  /** Libellé affiché à l'utilisateur */
  label: string;

  /** Couleurs Tailwind pour le badge (bg, text, border) */
  colors: {
    bg: string;
    text: string;
    border: string;
  };

  /** Nom de l'icône Lucide React */
  icon: string;

  /** Couleurs pour le confetti (format hex) */
  confettiColors: string[];
}
