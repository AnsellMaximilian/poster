export const MOODS = [
  "CASUAL",
  "SENTIMENTAL",
  "CELEBRATORY",
  "GRATEFUL",
  "PROFESSIONAL",
] as const;

export const THEMES = [
  "SUNSET",
  "OCEAN",
  "FOREST",
  "NEON",
  "PASTEL",
  "MONOCHROME",
] as const;
export const FORMATS = ["MINIMALIST", "VINTAGE", "BOLD", "PLAYFUL"] as const;
export const TYPES = [
  "GENERIC",
  "INVITATION",
  "APPRECIATION",
  "ANNOUNCEMENT",
] as const;
export const SENDER_VOICES = [
  "FRIENDLY",
  "WITTY",
  "WARM",
  "SINCERE",
  "NEUTRAL",
] as const;

export type Mood = (typeof MOODS)[number];
export type Theme = (typeof THEMES)[number];
export type FormatStyle = (typeof FORMATS)[number];
export type PostcardType = (typeof TYPES)[number];
export type SenderVoice = (typeof SENDER_VOICES)[number];
