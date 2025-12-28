import { useState, useEffect } from 'react';

/**
 * Configuration pour le versioning des données dans localStorage
 */
const DATA_VERSION = 'v1.0';

/**
 * Interface pour les données versionnées
 */
interface VersionedData<T> {
  version: string;
  data: T;
}

/**
 * Custom hook pour gérer le localStorage avec support du versioning,
 * gestion d'erreurs et auto-save
 *
 * @param key - La clé localStorage
 * @param initialValue - La valeur initiale si aucune donnée n'est trouvée
 * @returns Un tuple [value, setValue] similaire à useState
 *
 * @example
 * const [name, setName] = useLocalStorage<string>('userName', 'Anonymous');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // État local pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Charger la valeur initiale depuis localStorage au premier render
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return initialValue;
      }

      // Parser les données versionnées
      const parsed = JSON.parse(item) as VersionedData<T>;

      // Vérifier la version
      if (parsed.version !== DATA_VERSION) {
        console.warn(
          `localStorage data version mismatch for key "${key}". Expected ${DATA_VERSION}, got ${parsed.version}. Using initial value.`
        );
        return initialValue;
      }

      return parsed.data;
    } catch (error) {
      // Gestion des erreurs (JSON invalide, localStorage désactivé, etc.)
      if (error instanceof Error) {
        console.error(`Error loading from localStorage (key: "${key}"):`, error.message);
      }
      return initialValue;
    }
  });

  // Sauvegarder dans localStorage lors des changements
  useEffect(() => {
    try {
      // Créer l'objet versionné
      const versionedData: VersionedData<T> = {
        version: DATA_VERSION,
        data: storedValue,
      };

      // Stringifier et sauvegarder
      const serializedValue = JSON.stringify(versionedData);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      // Gestion des erreurs (QuotaExceededError, etc.)
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error(
            `localStorage quota exceeded for key "${key}". ` +
            'Consider clearing old data or reducing storage usage.'
          );
        } else {
          console.error(`Error saving to localStorage (key: "${key}"):`, error.message);
        }
      }
    }
  }, [key, storedValue]);

  // Wrapper pour setValue qui supporte les fonctions de mise à jour
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre value d'être une fonction (comme useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error updating value for key "${key}":`, error.message);
      }
    }
  };

  return [storedValue, setValue];
}
