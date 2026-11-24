// Formato padrão de todos os vídeos do estúdio: vertical (Reels, TikTok, Shorts).
export const FORMATO_VERTICAL = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Formato horizontal (YouTube).
export const FORMATO_HORIZONTAL = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
