"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { loadImageFile } from "@/lib/compressive-images";

interface CompressiveSourceContextValue {
  image: HTMLImageElement | null;
  fileName: string;
  error: string | null;
  isLoading: boolean;
  setFromFile: (file: File) => Promise<void>;
  reset: () => void;
}

const CompressiveSourceContext = createContext<CompressiveSourceContextValue | null>(null);

interface CompressiveSourceProps {
  children: ReactNode;
}

export function CompressiveSource({ children }: CompressiveSourceProps): ReactElement {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setFromFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    const result = await loadImageFile(file);
    setIsLoading(false);
    if (result.ok) {
      setImage(result.value.image);
      setFileName(result.value.fileName);
    } else {
      setError(result.error.message);
    }
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setFileName("");
    setError(null);
  }, []);

  const value = useMemo<CompressiveSourceContextValue>(
    () => ({ image, fileName, error, isLoading, setFromFile, reset }),
    [image, fileName, error, isLoading, setFromFile, reset],
  );

  return (
    <CompressiveSourceContext.Provider value={value}>{children}</CompressiveSourceContext.Provider>
  );
}

export function useCompressiveSource(): CompressiveSourceContextValue {
  const ctx = useContext(CompressiveSourceContext);
  if (!ctx) {
    throw new Error("useCompressiveSource must be used inside <CompressiveSource>.");
  }
  return ctx;
}
