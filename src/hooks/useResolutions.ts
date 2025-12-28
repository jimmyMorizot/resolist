import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Resolution, Category } from '../types';

/**
 * Constantes de validation
 */
const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 200;

/**
 * Erreur de validation personnalisée
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valide le titre d'une résolution
 */
function validateTitle(title: string): void {
  const trimmed = title.trim();

  if (trimmed.length < TITLE_MIN_LENGTH) {
    throw new ValidationError(
      `Le titre doit contenir au moins ${TITLE_MIN_LENGTH} caractères.`
    );
  }

  if (trimmed.length > TITLE_MAX_LENGTH) {
    throw new ValidationError(
      `Le titre ne peut pas dépasser ${TITLE_MAX_LENGTH} caractères.`
    );
  }
}

/**
 * Interface du retour du hook useResolutions
 */
export interface UseResolutionsReturn {
  /** Liste de toutes les résolutions */
  resolutions: Resolution[];

  /** Ajouter une nouvelle résolution */
  addResolution: (title: string, category: Category) => void;

  /** Supprimer une résolution par ID */
  deleteResolution: (id: string) => void;

  /** Basculer le statut complété/non complété */
  toggleResolution: (id: string) => void;

  /** Mettre à jour une résolution existante */
  updateResolution: (id: string, updates: Partial<Pick<Resolution, 'title' | 'category'>>) => void;
}

/**
 * Custom hook pour gérer la logique métier des résolutions (CRUD)
 *
 * Utilise localStorage pour persister les données via useLocalStorage.
 * Toutes les fonctions incluent une validation des données.
 *
 * @returns Un objet contenant les résolutions et les fonctions CRUD
 *
 * @example
 * const { resolutions, addResolution, deleteResolution, toggleResolution, updateResolution } = useResolutions();
 *
 * // Ajouter une résolution
 * addResolution('Faire du sport 3x par semaine', 'health');
 *
 * // Marquer comme complétée
 * toggleResolution(resolution.id);
 *
 * // Modifier
 * updateResolution(resolution.id, { title: 'Faire du sport 4x par semaine' });
 *
 * // Supprimer
 * deleteResolution(resolution.id);
 */
export function useResolutions(): UseResolutionsReturn {
  // Utiliser useLocalStorage pour persister les résolutions
  const [resolutions, setResolutions] = useLocalStorage<Resolution[]>('resolutions', []);

  /**
   * Ajouter une nouvelle résolution
   */
  const addResolution = useCallback(
    (title: string, category: Category) => {
      // Validation du titre
      validateTitle(title);

      // Créer la nouvelle résolution
      const now = new Date().toISOString();
      const newResolution: Resolution = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      // Ajouter au début de la liste (résolutions récentes en haut)
      setResolutions((prev) => [newResolution, ...prev]);
    },
    [setResolutions]
  );

  /**
   * Supprimer une résolution par ID
   */
  const deleteResolution = useCallback(
    (id: string) => {
      setResolutions((prev) => prev.filter((resolution) => resolution.id !== id));
    },
    [setResolutions]
  );

  /**
   * Basculer le statut complété/non complété d'une résolution
   */
  const toggleResolution = useCallback(
    (id: string) => {
      setResolutions((prev) =>
        prev.map((resolution) => {
          if (resolution.id === id) {
            return {
              ...resolution,
              completed: !resolution.completed,
              updatedAt: new Date().toISOString(),
            };
          }
          return resolution;
        })
      );
    },
    [setResolutions]
  );

  /**
   * Mettre à jour une résolution existante (titre et/ou catégorie)
   */
  const updateResolution = useCallback(
    (id: string, updates: Partial<Pick<Resolution, 'title' | 'category'>>) => {
      // Validation du titre si présent
      if (updates.title !== undefined) {
        validateTitle(updates.title);
      }

      setResolutions((prev) =>
        prev.map((resolution) => {
          if (resolution.id === id) {
            return {
              ...resolution,
              ...(updates.title !== undefined && { title: updates.title.trim() }),
              ...(updates.category !== undefined && { category: updates.category }),
              updatedAt: new Date().toISOString(),
            };
          }
          return resolution;
        })
      );
    },
    [setResolutions]
  );

  return {
    resolutions,
    addResolution,
    deleteResolution,
    toggleResolution,
    updateResolution,
  };
}
