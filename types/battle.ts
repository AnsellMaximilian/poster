import { Models } from "appwrite";

export enum BattlePhase {
  INTRO = "INTRO",
  EVENT = "EVENT",
  OUTRO = "OUTRO",
}

export enum BattleResult {
  RED_WIN = "RED_WIN",
  BLUE_WIN = "BLUE_WIN",
  DRAW = "DRAW",
}

export type BattleHistory = Models.Document & {
  battleResultJSON: string;
};
