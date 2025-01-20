import { useState, useEffect, useCallback } from 'react';

type StorageType = 'local' | 'sync';

/**
 * useChromeStorage - A custom hook to interact with Chrome Storage.
 * @param key The key for the storage item.
 * @param initialValue The initial value to use if no value exists in storage.
 * @param type The storage type ("local" or "sync").
 */
export function useChromeStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = 'local'
) {
  const [value, setValue] = useState<T>(initialValue);
  const storageArea = chrome.storage[type];

  // Load the value from Chrome Storage
  useEffect(() => {
    storageArea.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (result[key] !== undefined) {
        setValue(result[key] as T);
      }
    });
  }, [key, storageArea]);

  // Update the value in Chrome Storage
  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      storageArea.set({ [key]: newValue }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    },
    [key, storageArea]
  );

  // Remove the value from Chrome Storage
  const removeValue = useCallback(() => {
    storageArea.remove(key, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      setValue(initialValue);
    });
  }, [key, initialValue, storageArea]);

  return { value, setValue: updateValue, removeValue };
}
