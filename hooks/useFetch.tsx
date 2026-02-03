"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UseFetchOptions {
  successMessage?: string;
  errorMessage?: string;
  auto?: boolean;
  defaultArgs?: any[];
}

export const useFetch = <TArgs extends any[], TResult>(
  fetcher: (...args: TArgs) => Promise<TResult>,
  options?: UseFetchOptions,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await fetcher(...args);
        setData(result);
        if (options?.successMessage) {
          toast.success(options.successMessage);
        }
        return result;
      } catch (err: any) {
        setError(err);
        toast.error(options?.errorMessage || "Erro ao realizar a operação.", {
          description: err.message || "Tente novamente mais tarde.",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetcher, options?.successMessage, options?.errorMessage],
  );

  useEffect(() => {
    if (
      options?.auto &&
      Array.isArray(options.defaultArgs) &&
      options.defaultArgs.every((arg) => arg !== undefined && arg !== null)
    ) {
      execute(...(options.defaultArgs as TArgs));
    }
  }, [execute, options?.auto, options?.defaultArgs]);

  return {
    execute,
    isLoading,
    error,
    data,
  };
};
