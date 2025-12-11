import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling async operations in useEffect with proper cleanup
 * Prevents state updates after component unmount and handles race conditions
 */
export const useAsyncEffect = (
  asyncFunction: () => Promise<void>,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const executeAsync = async () => {
      try {
        if (isMounted) {
          await asyncFunction();
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Async effect error:', error);
        }
      }
    };

    executeAsync();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, dependencies);
};

/**
 * Hook to track if component is mounted
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return () => isMountedRef.current;
};

/**
 * Hook to prevent duplicate API calls
 */
export const useApiCall = <T extends (...args: any[]) => Promise<any>>(
  apiFunction: T
): T => {
  const pendingRef = useRef(false);
  const isMounted = useIsMounted();

  return (async (...args: Parameters<T>) => {
    if (pendingRef.current) {
      console.warn('API call already in progress, skipping duplicate');
      return;
    }

    pendingRef.current = true;

    try {
      const result = await apiFunction(...args);
      if (isMounted()) {
        return result;
      }
    } finally {
      pendingRef.current = false;
    }
  }) as T;
};
