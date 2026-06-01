export type CompressiveMime = "image/jpeg" | "image/webp";

export interface EncodedImage {
  url: string;
  bytes: number;
}

export interface LoadedImage {
  image: HTMLImageElement;
  fileName: string;
}

export interface LoadImageError {
  message: string;
}

export type LoadImageResult =
  | { ok: true; value: LoadedImage }
  | { ok: false; error: LoadImageError };

const HEIC_TYPE_PATTERN = /heic|heif/i;
const HEIC_NAME_PATTERN = /\.hei[cf]$/i;

export function isHeicFile(file: File): boolean {
  return HEIC_TYPE_PATTERN.test(file.type) || HEIC_NAME_PATTERN.test(file.name);
}

export function formatKilobytes(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

export function loadImageFile(file: File): Promise<LoadImageResult> {
  return new Promise((resolve) => {
    if (isHeicFile(file)) {
      resolve({
        ok: false,
        error: {
          message:
            "HEIC and HEIF images can't be decoded in the browser. Please choose a JPG, PNG, or WebP file.",
        },
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      resolve({
        ok: false,
        error: { message: "That doesn't look like an image file. Try a JPG, PNG, or WebP." },
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        resolve({ ok: false, error: { message: "Couldn't read that file. Try another image." } });
        return;
      }

      const image = new Image();
      image.onload = () => {
        resolve({ ok: true, value: { image, fileName: file.name } });
      };
      image.onerror = () => {
        resolve({
          ok: false,
          error: { message: "Couldn't decode that image. Try a different JPG, PNG, or WebP." },
        });
      };
      image.src = result;
    };

    reader.onerror = () => {
      resolve({ ok: false, error: { message: "Couldn't read that file. Try another image." } });
    };

    reader.readAsDataURL(file);
  });
}

export function paintScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#244b6b");
  sky.addColorStop(0.55, "#6f93ad");
  sky.addColorStop(0.75, "#d9c9a6");
  sky.addColorStop(1, "#b89b72");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.72, h * 0.32, 0, w * 0.72, h * 0.32, w * 0.4);
  glow.addColorStop(0, "rgba(255,243,214,0.9)");
  glow.addColorStop(1, "rgba(255,243,214,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  let rng = 2461;
  const rand = (): number => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  ctx.fillStyle = "#4a5d63";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  for (let x = 0; x <= w; x += w / 40) {
    ctx.lineTo(x, h * 0.62 - rand() * h * 0.08);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  const fleckCount = Math.floor((w * h) / 90);
  for (let i = 0; i < fleckCount; i += 1) {
    const x = rand() * w;
    const y = h * 0.6 + rand() * h * 0.4;
    const s = 1 + rand() * (w / 130);
    const g = 60 + rand() * 90;
    ctx.fillStyle = `rgba(${20 + rand() * 30},${g},${30 + rand() * 40},${0.5 + rand() * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(x, y, s, s * 0.8, rand() * 3, 0, 7);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(245,245,235,0.85)";
  ctx.lineWidth = Math.max(1, w / 400);
  for (let i = 0; i < 6; i += 1) {
    const x = w * (0.1 + rand() * 0.8);
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x + (rand() - 0.5) * 20, h * 0.55);
    ctx.stroke();
  }
}

export function buildDefaultCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    paintScene(ctx, width, height);
  }
  return canvas;
}

export function imageToCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingQuality = "high";

  const imageRatio = image.width / image.height;
  const boxRatio = width / height;

  let sourceWidth: number;
  let sourceHeight: number;
  let sourceX: number;
  let sourceY: number;

  if (imageRatio > boxRatio) {
    sourceHeight = image.height;
    sourceWidth = sourceHeight * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    sourceWidth = image.width;
    sourceHeight = sourceWidth / boxRatio;
    sourceX = 0;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  return canvas;
}

export function buildSourceCanvas(
  image: HTMLImageElement | null,
  width: number,
  height: number,
): HTMLCanvasElement {
  return image ? imageToCanvas(image, width, height) : buildDefaultCanvas(width, height);
}

export function encode(
  sourceCanvas: HTMLCanvasElement,
  outputWidth: number,
  outputHeight: number,
  mime: CompressiveMime,
  quality: number,
): Promise<EncodedImage | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sourceCanvas, 0, 0, outputWidth, outputHeight);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        resolve({ url: URL.createObjectURL(blob), bytes: blob.size });
      },
      mime,
      quality,
    );
  });
}

export function revokeIfPresent(encoded: EncodedImage | null): void {
  if (encoded) {
    URL.revokeObjectURL(encoded.url);
  }
}
