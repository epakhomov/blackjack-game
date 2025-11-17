import { z } from "zod";

export const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

export const cardSchema = z.object({
  suit: z.enum(suits),
  rank: z.enum(ranks),
  hidden: z.boolean().optional(),
});

export const gameStateSchema = z.object({
  playerHand: z.array(cardSchema),
  dealerHand: z.array(cardSchema),
  deck: z.array(cardSchema),
  gameStatus: z.enum(["betting", "playing", "dealer_turn", "finished"]),
  result: z.enum(["", "win", "lose", "push", "blackjack"]).optional(),
  chipBalance: z.number(),
  playerValue: z.number(),
  dealerValue: z.number(),
});

export const gameActionSchema = z.object({
  action: z.enum(["new_game", "hit", "stand"]),
});

export type Card = z.infer<typeof cardSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
export type GameAction = z.infer<typeof gameActionSchema>;
export type Suit = typeof suits[number];
export type Rank = typeof ranks[number];
