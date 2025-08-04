import { useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true
}: UseAutoSaveOptions<T>) {
  const [debouncedData] = useDebounce(data, delay);
  const previousDataRef = useRef<T>();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render to avoid saving initial data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = debouncedData;
      return;
    }

    // Only save if data actually changed and auto-save is enabled
    if (
      enabled &&
      debouncedData &&
      JSON.stringify(debouncedData) !== JSON.stringify(previousDataRef.current)
    ) {
      onSave(debouncedData).catch(console.error);
      previousDataRef.current = debouncedData;
    }
  }, [debouncedData, onSave, enabled]);
}
