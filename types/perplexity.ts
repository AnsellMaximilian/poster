import { z } from "zod";

// Attack Schema
export const AttackSchema = z.object({
  name: z.string(),
  power: z.number(),
  description: z.string(),
});

// Participant Schema
export const ParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  powerSummary: z.string(),
  stats: z.object({
    hp: z.number(),
    defense: z.number(),
  }),
  topAttacks: z.array(AttackSchema),
});

// Effect Schema
export const EffectSchema = z.object({
  redDamage: z.number(),
  blueDamage: z.number(),
});

// Event Schema
export const EventSchema = z.object({
  description: z.string(),
  effect: EffectSchema,
});

// Battle Schema
export const BattleSchema = z.object({
  $id: z.string().optional(),
  redCorner: ParticipantSchema,
  blueCorner: ParticipantSchema,
  result: z.string(),
  intro: z.string(),
  events: z.array(EventSchema),
});

// Export types that match your original interfaces
export type Attack = z.infer<typeof AttackSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type Effect = z.infer<typeof EffectSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Battle = z.infer<typeof BattleSchema>;

// RESPONSES

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  search_context_size: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface Choice {
  index: number;
  finish_reason: string;
  message: Message;
  delta?: {
    role: string;
    content: string;
  };
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: Usage;
  citations: string[];
  object: string;
  choices: Choice[];
}

export interface BattleSimulationResponse {
  battle: Battle;
  citations: string[];
}
