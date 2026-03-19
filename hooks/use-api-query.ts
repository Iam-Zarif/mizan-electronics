"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getErrorMessage } from "@/lib/api";

export type ApiQueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
};

export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
  enabled = true,
  initialData: T | null = null,
): ApiQueryState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(enabled && initialData === null);
  const [error, setError] = useState<string | null>(null);
  const previousDepsRef = useRef<DependencyList | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextData = await fetcher();
      setData(nextData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, fetcher]);

  useEffect(() => {
    const previousDeps = previousDepsRef.current;
    const hasChanged =
      !previousDeps ||
      previousDeps.length !== deps.length ||
      deps.some((dependency, index) => !Object.is(dependency, previousDeps[index]));

    if (!hasChanged) {
      return;
    }

    previousDepsRef.current = deps;
    if (initialData !== null && !previousDeps) {
      return;
    }
    void refresh();
  }, [deps, initialData, refresh]);

  return {
    data,
    isLoading,
    error,
    refresh,
    setData,
  };
}
