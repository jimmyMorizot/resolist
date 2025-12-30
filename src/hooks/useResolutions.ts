import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Resolution, Category } from '../types';

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 200;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

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

export interface UseResolutionsReturn {
  resolutions: Resolution[];
  addResolution: (title: string, category: Category, dueDate?: string) => void;
  deleteResolution: (id: string) => void;
  toggleResolution: (id: string) => void;
  updateResolution: (id: string, updates: Partial<Pick<Resolution, 'title' | 'category' | 'dueDate'>>) => void;
}

export function useResolutions(): UseResolutionsReturn {
  const [resolutions, setResolutions] = useLocalStorage<Resolution[]>('resolutions', []);

  const addResolution = useCallback(
    (title: string, category: Category, dueDate?: string) => {
      validateTitle(title);

      const now = new Date().toISOString();
      const newResolution: Resolution = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        completed: false,
        dueDate,
        createdAt: now,
        updatedAt: now,
      };

      setResolutions((prev) => [newResolution, ...prev]);
    },
    [setResolutions]
  );

  const deleteResolution = useCallback(
    (id: string) => {
      setResolutions((prev) => prev.filter((resolution) => resolution.id !== id));
    },
    [setResolutions]
  );

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

  const updateResolution = useCallback(
    (id: string, updates: Partial<Pick<Resolution, 'title' | 'category' | 'dueDate'>>) => {
      try {
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
                ...('dueDate' in updates && { dueDate: updates.dueDate }),
                updatedAt: new Date().toISOString(),
              };
            }
            return resolution;
          })
        );
      } catch (error) {
        if (error instanceof ValidationError) {
          throw error;
        }
        console.error('Error updating resolution:', error);
      }
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
