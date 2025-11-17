import { type GameState, type Card, suits, ranks } from "@shared/schema";

export interface IStorage {
  getGameState(): Promise<GameState>;
  setGameState(state: GameState): Promise<void>;
}

export class MemStorage implements IStorage {
  private gameState: GameState | null = null;

  async getGameState(): Promise<GameState> {
    if (!this.gameState) {
      this.gameState = this.createInitialState();
    }
    return this.gameState;
  }

  async setGameState(state: GameState): Promise<void> {
    this.gameState = state;
  }

  private createInitialState(): GameState {
    return {
      playerHand: [],
      dealerHand: [],
      deck: [],
      gameStatus: "betting",
      result: "",
      chipBalance: 1000,
      playerValue: 0,
      dealerValue: 0,
    };
  }
}

export const storage = new MemStorage();

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createDeckExcludingCards(excludeCards: Card[]): Card[] {
  const fullDeck = createDeck();
  const excludeSet = new Set(
    excludeCards.map(c => `${c.rank}-${c.suit}`)
  );
  
  return fullDeck.filter(card => {
    const cardKey = `${card.rank}-${card.suit}`;
    return !excludeSet.has(cardKey);
  });
}

export function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.hidden) continue;

    if (card.rank === "A") {
      aces += 1;
      value += 11;
    } else if (["K", "Q", "J"].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

export function determineWinner(
  playerValue: number,
  dealerValue: number,
  playerHand: Card[],
  dealerHand: Card[]
): { result: string; chipChange: number } {
  const playerBlackjack = isBlackjack(playerHand);
  const dealerBlackjack = isBlackjack(dealerHand);

  if (playerBlackjack && !dealerBlackjack) {
    return { result: "blackjack", chipChange: 150 };
  }

  if (dealerBlackjack && !playerBlackjack) {
    return { result: "lose", chipChange: -100 };
  }

  if (playerBlackjack && dealerBlackjack) {
    return { result: "push", chipChange: 0 };
  }

  if (playerValue > 21) {
    return { result: "lose", chipChange: -100 };
  }

  if (dealerValue > 21) {
    return { result: "win", chipChange: 100 };
  }

  if (playerValue > dealerValue) {
    return { result: "win", chipChange: 100 };
  }

  if (dealerValue > playerValue) {
    return { result: "lose", chipChange: -100 };
  }

  return { result: "push", chipChange: 0 };
}
