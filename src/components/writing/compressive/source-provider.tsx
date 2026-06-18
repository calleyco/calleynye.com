"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { loadImageFile, loadImageUrl } from "@/lib/compressive-images";

const DEFAULT_IMAGE_SRC = "/images/compressive-mountains-unsplash.jpg";
const DEFAULT_IMAGE_NAME = "Simon Berger mountain photo";

type CompressiveSourceKind = "default" | "uploaded";

interface CompressiveSourceContextValue {
  image: HTMLImageElement | null;
  fileName: string;
  sourceKind: CompressiveSourceKind;
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
  const [fileName, setFileName] = useState<string>(DEFAULT_IMAGE_NAME);
  const [sourceKind, setSourceKind] = useState<CompressiveSourceKind>("default");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setFromDefaultImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await loadImageUrl(DEFAULT_IMAGE_SRC, DEFAULT_IMAGE_NAME);
    setIsLoading(false);
    if (result.ok) {
      setImage(result.value.image);
      setFileName(result.value.fileName);
      setSourceKind("default");
    } else {
      setImage(null);
      setFileName(DEFAULT_IMAGE_NAME);
      setSourceKind("default");
      setError(result.error.message);
    }
  }, []);

  useEffect(() => {
    void setFromDefaultImage();
  }, [setFromDefaultImage]);

  const setFromFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    const result = await loadImageFile(file);
    setIsLoading(false);
    if (result.ok) {
      setImage(result.value.image);
      setFileName(result.value.fileName);
      setSourceKind("uploaded");
    } else {
      setError(result.error.message);
    }
  }, []);

  const reset = useCallback(() => {
    void setFromDefaultImage();
  }, [setFromDefaultImage]);

  const value = useMemo<CompressiveSourceContextValue>(
    () => ({ image, fileName, sourceKind, error, isLoading, setFromFile, reset }),
    [image, fileName, sourceKind, error, isLoading, setFromFile, reset],
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
