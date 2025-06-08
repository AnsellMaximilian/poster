import { Models } from "appwrite";

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
export const TYPES = ["DECISION", "TRIBUTE", "RECAP"] as const;
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

export interface Postcard extends Models.Document {
  type: PostcardType;
  mood: Mood;
  themeColor: Theme;
  formatStyle: FormatStyle;
  senderVoice: SenderVoice;
  notes: string | null;
  userId: string;
  messageId: string | null;
  fromEmail: string | null;
  fromName: string | null;
  headerMessageId: string | null;
  emailBody: string | null;
  emailSubject: string | null;
  ccs: string[];
}

export interface PostcardResponse extends Models.Document {
  postcardId: string;
  messageId: string;
  fromEmail: string;
  fromName: string;
  headerMessageId: string;
  emailBody: string;
  emailSubject: string;
  replyHeaderMessageId: string;
}
