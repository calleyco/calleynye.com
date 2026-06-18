"use client";

import type { ChangeEvent, ReactElement } from "react";
import { useCompressiveSource } from "./source-provider";

export function CompressiveUploader(): ReactElement {
  const { image, fileName, sourceKind, error, isLoading, setFromFile, reset } = useCompressiveSource();
  const hasUploadedImage = image !== null && sourceKind === "uploaded";

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      void setFromFile(file);
    }
    event.target.value = "";
  };

  return (
    <div className="compressive-uploader">
      <div className="compressive-uploader-body">
        <h3 className="compressive-uploader-title">
          {hasUploadedImage ? "Using your image" : "Test it on your own photo"}
        </h3>
        <p className="compressive-uploader-copy">
          {hasUploadedImage
            ? "Every demo below now re-encodes your uploaded image, live, in your browser. Nothing is sent anywhere."
            : "The demos use Simon Berger's mountain photo by default. Upload your own photograph and every number on this page recomputes on it. Photographs work best; flat graphics and text-heavy images compress differently."}
        </p>
        {fileName && image ? (
          <p className="compressive-uploader-filename">
            Loaded <strong>{fileName}</strong> — processed entirely in your browser.
          </p>
        ) : null}
        {error ? (
          <p className="compressive-uploader-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="compressive-uploader-actions">
        <label
          className="compressive-upload-button"
          data-active="true"
          htmlFor="compressive-upload-input"
        >
          <span>{isLoading ? "Loading…" : hasUploadedImage ? "Choose another" : "Upload an image"}</span>
          <input
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload an image to test the compression demos"
            className="sr-only"
            disabled={isLoading}
            id="compressive-upload-input"
            onChange={handleChange}
            type="file"
          />
        </label>
        {hasUploadedImage ? (
          <button
            className="compressive-upload-button"
            onClick={reset}
            type="button"
          >
            Reset to demo image
          </button>
        ) : null}
      </div>
    </div>
  );
}
