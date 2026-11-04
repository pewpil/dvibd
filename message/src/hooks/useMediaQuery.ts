"use client";

import { useCallback, useSyncExternalStore } from "react";

const listCache: Map<string, MediaQueryList> = new Map();

function mediaQueryList(query: string): MediaQueryList {
  const cached: MediaQueryList | undefined = listCache.get(query);
  if (cached !== undefined) {
    return cached;
  }
  const list: MediaQueryList = window.matchMedia(query);
  listCache.set(query, list);
  return list;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const list: MediaQueryList = mediaQueryList(query);
      list.addEventListener("change", onStoreChange);
      return (): void => {
        list.removeEventListener("change", onStoreChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback((): boolean => {
    return mediaQueryList(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback((): boolean => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
