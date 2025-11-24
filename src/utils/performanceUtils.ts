import React, { useCallback, useRef, useMemo } from 'react';

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<any>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized calculation for prayer times
export const useMemoizedPrayerCalculation = (
  latitude: number,
  longitude: number,
  prayerSchool: any,
  date: Date
) => {
  return useMemo(() => {
    // This will only recalculate when dependencies change
    return {
      coordinates: { latitude, longitude },
      calculationParams: { prayerSchool, date: date.toDateString() }
    };
  }, [latitude, longitude, prayerSchool, date.toDateString()]);
};

// Performance monitoring utility
export const performanceMonitor = {
  startTimer: (label: string) => {
    if (__DEV__) {
      console.time(label);
    }
  },
  
  endTimer: (label: string) => {
    if (__DEV__) {
      console.timeEnd(label);
    }
  },
  
  measureAsync: async <T>(label: string, asyncFn: () => Promise<T>): Promise<T> => {
    if (__DEV__) {
      console.time(label);
    }
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      if (__DEV__) {
        console.timeEnd(label);
      }
    }
  }
};

// Memory optimization utilities
export const memoryUtils = {
  // Clear unused references
  clearCache: (cacheRef: React.MutableRefObject<Map<string, any>>) => {
    if (cacheRef.current.size > 100) { // Limit cache size
      const entries = Array.from(cacheRef.current.entries());
      const toKeep = entries.slice(-50); // Keep last 50 entries
      cacheRef.current.clear();
      toKeep.forEach(([key, value]) => {
        cacheRef.current.set(key, value);
      });
    }
  },
  
  // Create a simple LRU cache
  createLRUCache: <K, V>(maxSize: number = 50) => {
    const cache = new Map<K, V>();
    
    return {
      get: (key: K): V | undefined => {
        if (cache.has(key)) {
          const value = cache.get(key)!;
          cache.delete(key);
          cache.set(key, value); // Move to end (most recent)
          return value;
        }
        return undefined;
      },
      
      set: (key: K, value: V): void => {
        if (cache.has(key)) {
          cache.delete(key);
        } else if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          if (firstKey !== undefined) {
             cache.delete(firstKey);
          }
        }
        cache.set(key, value);
      },
      
      clear: (): void => {
        cache.clear();
      },
      
      size: (): number => {
        return cache.size;
      }
    };
  }
};

// Bundle size optimization - lazy import helper
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Image optimization utilities
export const imageUtils = {
  // Optimize image loading
  getOptimizedImageUri: (uri: string, width?: number, height?: number) => {
    if (!width && !height) return uri;
    
    // For web, you could add query parameters for image optimization services
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    
    return `${uri}?${params.toString()}`;
  },
  
  // Preload critical images
  preloadImages: (imageUris: string[]) => {
    if (typeof Image !== 'undefined') {
      imageUris.forEach(uri => {
        const img = new Image();
        img.src = uri;
      });
    }
  }
};

// Network optimization
export const networkUtils = {
  // Batch API requests
  batchRequests: async <T>(
    requests: (() => Promise<T>)[],
    batchSize: number = 3
  ): Promise<T[]> => {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(req => req()));
      results.push(...batchResults);
    }
    
    return results;
  },
  
  // Request deduplication
  createRequestDeduplicator: <T>() => {
    const pendingRequests = new Map<string, Promise<T>>();
    
    return (key: string, requestFn: () => Promise<T>): Promise<T> => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key)!;
      }
      
      const promise = requestFn().finally(() => {
        pendingRequests.delete(key);
      });
      
      pendingRequests.set(key, promise);
      return promise;
    };
  }
};