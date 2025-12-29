import { useState, useEffect } from 'react';

const DATA_VERSION = 'v1.0';

interface VersionedData<T> {
  version: string;
  data: T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item) as VersionedData<T>;

      if (parsed.version !== DATA_VERSION) {
        console.warn(
          `localStorage data version mismatch for key "${key}". Expected ${DATA_VERSION}, got ${parsed.version}. Using initial value.`
        );
        return initialValue;
      }

      return parsed.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error loading from localStorage (key: "${key}"):`, error.message);
      }
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const versionedData: VersionedData<T> = {
        version: DATA_VERSION,
        data: storedValue,
      };

      const serializedValue = JSON.stringify(versionedData);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
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

  const setValue = (value: T | ((val: T) => T)) => {
    try {
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
